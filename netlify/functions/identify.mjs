// Netlify Function: /api/identify
// Receives a base64 photo of a medication and asks Gemini 2.5 Flash (vision)
// to match it against the 20 hand-curated drugs. Returns the matched drug id
// or 0 when it cannot confidently identify one. The API key stays server-side.

import { drugs } from '../../src/data/drugs.js'

const GEN_MODEL = 'gemini-2.5-flash'
const MAX_IMAGE_BYTES = 4 * 1024 * 1024 // 4 MB of base64 ≈ 3 MB raw

const CATALOG = drugs
  .map(d => `${d.id}. ${d.name}（${d.englishName}）— 品牌/俗名：${d.brandName}｜分類：${d.category}`)
  .join('\n')

function buildPrompt() {
  return `你是台灣藥品辨識助理。使用者上傳了一張藥品照片（可能是藥盒、鋁箔板、藥瓶、藥膏條、或藥品本身）。

請仔細觀察照片中的所有線索：包裝上的中文/英文藥名、品牌名、主成分、劑型外觀、顏色、標誌。
然後判斷它是否為下列「精選 20 種藥品」之一：

${CATALOG}

判斷規則：
1. 只能從上述 20 種中選擇，drugId 必須是 1-20 的整數。
2. 若照片不清楚、無法辨識、或不屬於這 20 種，drugId 回傳 0。
3. confidence 用「高」「中」「低」表示把握程度；把握低於「中」時請回傳 drugId 0。
4. reason 用繁體中文簡短說明你從照片看到什麼線索（20-60 字）。
5. 嚴禁猜測；看不清楚就回傳 0。`
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    drugId: { type: 'INTEGER' },
    drugName: { type: 'STRING' },
    confidence: { type: 'STRING' },
    reason: { type: 'STRING' },
  },
  required: ['drugId', 'confidence', 'reason'],
}

async function identify(base64, mimeType, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEN_MODEL}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: buildPrompt() },
          { inline_data: { mime_type: mimeType, data: base64 } },
        ],
      }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  })
  if (!res.ok) throw new Error(`generate ${res.status}: ${await res.text()}`)
  const json = await res.json()
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini 未回傳辨識結果')
  return JSON.parse(text)
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY not configured on server' }, { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const base64 = (body.image ?? '').replace(/^data:image\/\w+;base64,/, '')
  const mimeType = body.mimeType ?? 'image/jpeg'
  if (!base64) {
    return Response.json({ error: 'image is required' }, { status: 400 })
  }
  if (base64.length > MAX_IMAGE_BYTES) {
    return Response.json({ error: '圖片太大，請使用較小的照片' }, { status: 413 })
  }

  try {
    const result = await identify(base64, mimeType, apiKey)
    const drugId = Number.isInteger(result.drugId) ? result.drugId : 0
    const match = drugs.find(d => d.id === drugId) ?? null
    return Response.json({
      drugId: match ? match.id : 0,
      name: match ? match.name : null,
      confidence: result.confidence ?? '低',
      reason: result.reason ?? '',
    })
  } catch (err) {
    console.error(err)
    return Response.json({ error: String(err.message ?? err) }, { status: 500 })
  }
}

export const config = { path: '/api/identify' }
