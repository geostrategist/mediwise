// Import TFDA (食藥署) 全部藥品許可證資料集 → structured JSON.
//
// Source: https://data.fda.gov.tw/data/opendata/export/36/csv (ZIP-wrapped CSV)
// Strategy:
//   1. Filter to 未註銷 (active license) AND 藥品類別 ∈ {成藥, 指示藥} (OTC scope)
//   2. Dedupe by normalized 主成分略述 (active ingredient)
//   3. Cap at MAX_COUNT to keep embedding cost reasonable (free-tier RPD safety)
//   4. Emit JSON matching the chunk schema used by build-embeddings.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { parse } from 'csv-parse/sync'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CSV_PATH = resolve(__dirname, 'cache/36_2.csv')
// Two outputs:
//   - chunk JSON for the embedding builder (id/type/name/text)
//   - structured JSON for the React DrugInfo page (full fields, no chunk text overhead)
const CHUNK_OUT_PATH = resolve(__dirname, 'cache/tfda-otc-drugs.json')
const UI_OUT_PATH = resolve(ROOT, 'public/tfda-drugs.json')

// Default cap = all unique ingredients. Set MAX_COUNT env to limit.
const MAX_COUNT = Number(process.env.MAX_COUNT ?? Infinity)

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

// Step 1: filter
// 註銷狀態: empty string = active license (已註銷 = cancelled, 已廢止 = repealed)
// 藥品類別 (OTC scope):
//   成藥, 乙類成藥, 甲類成藥 = OTC, available without consultation
//   醫師藥師藥劑生指示藥品 = "指示藥", requires pharmacist counsel but no Rx
const OTC_CATEGORIES = new Set([
  '成藥',
  '乙類成藥',
  '甲類成藥',
  '醫師藥師藥劑生指示藥品',
])
const active = records.filter(r =>
  (r['註銷狀態'] ?? '').trim() === '' &&
  OTC_CATEGORIES.has(r['藥品類別'])
)
console.log(`  active OTC (成藥/指示藥, 未註銷): ${active.length}`)

// Step 2: dedupe by normalized active ingredient
//   - lowercase, strip whitespace, sort ingredients alphabetically so different orderings collapse
function normalizeIngredient(s) {
  if (!s) return ''
  return s
    .toLowerCase()
    .split(/[;,；，、]/)
    .map(x => x.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .sort()
    .join('|')
}

const byIngredient = new Map()
for (const r of active) {
  const key = normalizeIngredient(r['主成分略述'])
  if (!key) continue
  if (!byIngredient.has(key)) {
    byIngredient.set(key, [])
  }
  byIngredient.get(key).push(r)
}
console.log(`  unique ingredient profiles: ${byIngredient.size}`)

// Step 3: pick a representative for each ingredient group
//   - prefer entries with non-empty 適應症 AND 用法用量
//   - prefer newer 發證日期 as tiebreaker
function quality(r) {
  let s = 0
  if (r['適應症']?.trim()) s += 4
  if (r['用法用量']?.trim()) s += 4
  if (r['英文品名']?.trim()) s += 1
  if (r['劑型']?.trim()) s += 1
  return s
}

function dateNum(s) {
  if (!s) return 0
  const m = s.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/)
  return m ? Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]) : 0
}

const reps = []
for (const [key, group] of byIngredient) {
  group.sort((a, b) => {
    const dq = quality(b) - quality(a)
    if (dq !== 0) return dq
    return dateNum(b['發證日期']) - dateNum(a['發證日期'])
  })
  reps.push({ key, record: group[0], variantCount: group.length })
}

// Drop entries with empty 適應症 (RAG will get nothing useful from them)
const withIndications = reps.filter(r => r.record['適應症']?.trim())
console.log(`  with 適應症: ${withIndications.length}`)

// Sort by quality desc, then take top MAX_COUNT
withIndications.sort((a, b) => quality(b.record) - quality(a.record))
const picked = withIndications.slice(0, MAX_COUNT)
console.log(`  kept (after cap=${MAX_COUNT}): ${picked.length}`)

// Step 4: shape into chunk records
function cleanText(s) {
  if (!s) return ''
  return s.replace(/\s+/g, ' ').replace(/[　 ]+/g, ' ').trim()
}

// Build full structured records (for UI) AND chunk records (for embedding).
const fullRecords = picked.map(({ record: r, variantCount }, i) => {
  const id = `tfda-${i + 1}`
  const name = cleanText(r['中文品名']) || cleanText(r['英文品名']) || `(未命名)${r['許可證字號']}`
  const englishName = cleanText(r['英文品名'])
  const license = cleanText(r['許可證字號'])
  const category = cleanText(r['藥品類別'])
  const form = cleanText(r['劑型'])
  const ingredient = cleanText(r['主成分略述'])
  const indications = cleanText(r['適應症'])
  const dosage = cleanText(r['用法用量'])
  const applicant = cleanText(r['申請商名稱'])
  const country = cleanText(r['製造廠國別'])
  const text = [
    `【藥品｜食藥署仿單】${name}`,
    englishName ? `英文品名：${englishName}` : null,
    `許可證字號：${license}`,
    `藥品類別：${category}`,
    form ? `劑型：${form}` : null,
    ingredient ? `主成分：${ingredient}` : null,
    indications ? `適應症：${indications}` : null,
    dosage ? `用法用量：${dosage}` : null,
    applicant ? `申請廠商：${applicant}` : null,
    country ? `製造國別：${country}` : null,
    variantCount > 1 ? `（市場上共有 ${variantCount} 個同成分品項）` : null,
  ].filter(Boolean).join('\n')

  return {
    id,
    type: 'tfda-drug',
    name,
    englishName,
    license,
    category,
    form,
    ingredient,
    indications,
    dosage,
    applicant,
    country,
    variantCount,
    text, // also used by build-embeddings.mjs
  }
})

// Chunk-shaped JSON for embedding pipeline
const chunks = fullRecords.map(({ id, type, name, text }) => ({ id, type, name, text }))
writeFileSync(CHUNK_OUT_PATH, JSON.stringify(chunks, null, 0))
console.log(`\nWrote ${CHUNK_OUT_PATH} (${chunks.length} chunks for embedding)`)

// Structured JSON for UI (DrugInfo page). Strip `text` to keep size down.
const uiRecords = fullRecords.map(({ text, ...rest }) => rest)

mkdirSync(resolve(ROOT, 'public'), { recursive: true })
writeFileSync(UI_OUT_PATH, JSON.stringify(uiRecords))
console.log(`Wrote ${UI_OUT_PATH} (${uiRecords.length} drugs for UI)`)

// Quick stats
const catCount = {}
for (const r of fullRecords) {
  catCount[r.category] = (catCount[r.category] ?? 0) + 1
}
console.log('  by category:', catCount)
console.log('  sample names:', fullRecords.slice(0, 5).map(r => r.name).join(', '))
