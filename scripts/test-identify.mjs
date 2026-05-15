// 獨立端對端測試 /api/identify 的 Gemini Vision 辨識邏輯。
//   node --env-file=.env scripts/test-identify.mjs <image-path> [expectedDrugId]
import { readFileSync } from 'node:fs'
import { drugs } from '../src/data/drugs.js'

const GEN_MODEL = 'gemini-2.5-flash'
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) { console.error('ERROR: GEMINI_API_KEY 未設定（用 --env-file=.env）'); process.exit(1) }

const imgPath = process.argv[2] ?? 'scripts/cache/test-panadol.jpg'
const expected = process.argv[3] ? Number(process.argv[3]) : null
const base64 = readFileSync(imgPath).toString('base64')

const CATALOG = drugs
  .map(d => `${d.id}. ${d.name}（${d.englishName}）— 品牌/俗名：${d.brandName}｜分類：${d.category}`)
  .join('\n')

const prompt = `你是台灣藥品辨識助理。使用者上傳了一張藥品照片（可能是藥盒、鋁箔板、藥瓶、藥膏條、或藥品本身）。

請仔細觀察照片中的所有線索：包裝上的中文/英文藥名、品牌名、主成分、劑型外觀、顏色、標誌。
然後判斷它是否為下列「精選 20 種藥品」之一：

${CATALOG}

判斷規則：
1. 只能從上述 20 種中選擇，drugId 必須是 1-20 的整數。
2. 若照片不清楚、無法辨識、或不屬於這 20 種，drugId 回傳 0。
3. confidence 用「高」「中」「低」表示把握程度；把握低於「中」時請回傳 drugId 0。
4. reason 用繁體中文簡短說明你從照片看到什麼線索（20-60 字）。
5. 嚴禁猜測；看不清楚就回傳 0。`

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${GEN_MODEL}:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'image/jpeg', data: base64 } }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            drugId: { type: 'INTEGER' },
            drugName: { type: 'STRING' },
            confidence: { type: 'STRING' },
            reason: { type: 'STRING' },
          },
          required: ['drugId', 'confidence', 'reason'],
        },
      },
    }),
  },
)

if (!res.ok) { console.error(`Gemini ${res.status}:`, await res.text()); process.exit(1) }
const json = await res.json()
const text = json.candidates?.[0]?.content?.parts?.[0]?.text
const result = JSON.parse(text)
const match = drugs.find(d => d.id === result.drugId)

console.log('圖片:', imgPath)
console.log('Gemini 回傳:', JSON.stringify(result, null, 2))
console.log('對應藥品:', match ? `#${match.id} ${match.name}（${match.englishName}）` : '無 (drugId 0)')
if (expected !== null) {
  const ok = result.drugId === expected
  console.log(ok ? `PASS — 辨識為預期的 #${expected}` : `FAIL — 預期 #${expected}，實際 #${result.drugId}`)
  process.exit(ok ? 0 : 1)
}
