// Import 健保署「健保用藥品項查詢項目檔」 → chunked JSON for RAG.
//
// Source: https://info.nhi.gov.tw/api/iode0000s01/Dataset?rId=A21030000I-E41001-001
// Strategy:
//   1. Filter to entries currently in 給付期間 (today between 有效起日 and 有效迄日)
//   2. Dedupe by 成分（main ingredient）— pick the cheapest 支付價 representative
//   3. Default: keep only entries with non-empty 給付規定章節 (where NHI actually has special coverage rules)
//   4. Cap at MAX_COUNT to keep embedding cost reasonable

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { parse } from 'csv-parse/sync'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CSV_PATH = resolve(__dirname, 'cache/nhi-drugs.csv')
const CHUNK_OUT_PATH = resolve(__dirname, 'cache/nhi-drugs.json')
const UI_OUT_PATH = resolve(ROOT, 'public/nhi-drugs.json')

const MAX_COUNT = Number(process.env.MAX_COUNT ?? Infinity)
// Default: keep only entries with a 給付規定章節 (NHI special coverage rule).
// Without this, we'd have 200k+ generic entries.
const REQUIRE_RULE = process.env.REQUIRE_RULE !== '0'

console.log(`Reading ${CSV_PATH}...`)
const raw = readFileSync(CSV_PATH, 'utf8')

console.log('Parsing CSV...')
const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  relax_quotes: true,
  relax_column_count: true,
})
console.log(`  total rows: ${records.length}`)

// Date format in NHI CSV: ROC year + month + day, like "1110301" (民國111年3月1日 = 2022/3/1)
// Some have leading spaces. Convert to YYYYMMDD for comparison.
function rocDateToInt(s) {
  if (!s) return 0
  const t = s.trim()
  if (!t) return 0
  // Most are 7 digits: YYYMMDD (e.g. 1110301)
  const m = t.match(/^(\d{2,3})(\d{2})(\d{2})$/)
  if (!m) return 0
  const yy = Number(m[1]) + 1911
  return yy * 10000 + Number(m[2]) * 100 + Number(m[3])
}

const today = (() => {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
})()

// Step 1: filter to active coverage period
const active = records.filter(r => {
  const start = rocDateToInt(r['有效起日'])
  const end = rocDateToInt(r['有效迄日'])
  return start && end && start <= today && today <= end
})
console.log(`  active (in coverage period as of today): ${active.length}`)

// Step 2: optionally filter to entries with a 給付規定章節
const withRule = REQUIRE_RULE
  ? active.filter(r => (r['給付規定章節'] ?? '').trim())
  : active
console.log(`  with 給付規定章節: ${withRule.length}${REQUIRE_RULE ? '' : ' (REQUIRE_RULE=0; kept all active)'}`)

// Step 3: dedupe by ingredient — keep cheapest 支付價 as representative
function normalizeIngredient(s) {
  if (!s) return ''
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(/[;,；，、]/)
    .map(x => x.trim())
    .filter(Boolean)
    .sort()
    .join('|')
}

const byIngredient = new Map()
for (const r of withRule) {
  const key = normalizeIngredient(r['成分'])
  if (!key) continue
  if (!byIngredient.has(key)) byIngredient.set(key, [])
  byIngredient.get(key).push(r)
}
console.log(`  unique ingredients: ${byIngredient.size}`)

function priceNum(s) {
  const n = Number(String(s ?? '').replace(/[, ]/g, ''))
  return Number.isFinite(n) ? n : Infinity
}

const reps = []
for (const [key, group] of byIngredient) {
  group.sort((a, b) => priceNum(a['支付價']) - priceNum(b['支付價']))
  reps.push({ key, record: group[0], variantCount: group.length })
}

reps.sort((a, b) => {
  // Quality: prefer entries with English name + Chinese name + rule
  const qa = (a.record['藥品英文名稱'] ? 1 : 0) + (a.record['藥品中文名稱'] ? 1 : 0)
  const qb = (b.record['藥品英文名稱'] ? 1 : 0) + (b.record['藥品中文名稱'] ? 1 : 0)
  return qb - qa
})

const picked = reps.slice(0, MAX_COUNT)
console.log(`  kept (cap=${MAX_COUNT}): ${picked.length}`)

function clean(s) {
  return s ? s.replace(/\s+/g, ' ').trim() : ''
}

const fullRecords = picked.map(({ record: r, variantCount }, i) => {
  const id = `nhi-${i + 1}`
  const name = clean(r['藥品中文名稱']) || clean(r['藥品英文名稱']) || `(未命名)${r['藥品代號']}`
  const englishName = clean(r['藥品英文名稱'])
  const code = clean(r['藥品代號'])
  const ingredient = clean(r['成分'])
  const form = clean(r['劑型'])
  const category = clean(r['藥品分類'])
  const groupName = clean(r['分類分組名稱'])
  const atc = clean(r['ATC代碼'])
  const price = clean(r['支付價'])
  const ruleSection = clean(r['給付規定章節'])
  const ruleLink = clean(r['給付規定章節連結'])
  const dispenser = clean(r['藥商'])
  const manufacturer = clean(r['製造廠名稱'])
  const unit = clean(r['規格單位'])
  const spec = clean(r['規格量']) + (unit ? ` ${unit}` : '')

  const text = [
    `【健保用藥】${name}`,
    englishName ? `英文名稱：${englishName}` : null,
    `健保藥品代號：${code}`,
    ingredient ? `成分：${ingredient}` : null,
    spec.trim() ? `規格：${spec}` : null,
    form ? `劑型：${form}` : null,
    category ? `分類：${category}` : null,
    groupName ? `健保分組：${groupName}` : null,
    atc ? `ATC 代碼：${atc}` : null,
    price ? `健保支付價：${price} 元` : null,
    ruleSection ? `給付規定章節：${ruleSection}` : null,
    dispenser ? `藥商：${dispenser}` : null,
    variantCount > 1 ? `（同成分共 ${variantCount} 個健保品項）` : null,
  ].filter(Boolean).join('\n')

  return {
    id,
    type: 'nhi-drug',
    name,
    englishName,
    code,
    ingredient,
    form,
    category,
    groupName,
    atc,
    price,
    ruleSection,
    ruleLink,
    dispenser,
    manufacturer,
    spec: spec.trim(),
    variantCount,
    text,
  }
})

const chunks = fullRecords.map(({ id, type, name, text }) => ({ id, type, name, text }))
writeFileSync(CHUNK_OUT_PATH, JSON.stringify(chunks))
console.log(`\nWrote ${CHUNK_OUT_PATH} (${chunks.length} chunks for embedding)`)

const uiRecords = fullRecords.map(({ text, ...rest }) => rest)
mkdirSync(resolve(ROOT, 'public'), { recursive: true })
writeFileSync(UI_OUT_PATH, JSON.stringify(uiRecords))
console.log(`Wrote ${UI_OUT_PATH} (${uiRecords.length} drugs for UI)`)

const catCount = {}
for (const r of fullRecords) {
  catCount[r.category || '(未分類)'] = (catCount[r.category || '(未分類)'] ?? 0) + 1
}
console.log('  by category:', catCount)
console.log('  sample names:', fullRecords.slice(0, 5).map(r => r.name).join(', '))
