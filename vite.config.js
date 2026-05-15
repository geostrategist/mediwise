import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Dev-only middleware that mirrors netlify/functions/ask.mjs.
// Lets us iterate locally without Netlify CLI (which has a Windows+CJK path bug).
function askDevMiddleware(env) {
  const EMBED_MODEL = 'gemini-embedding-001'
  const EMBED_DIM = 768
  const GEN_MODEL = 'gemini-2.5-flash'
  let EMB = null

  function loadEmbeddings() {
    if (EMB) return EMB
    const path = resolve(process.cwd(), 'netlify/functions/embeddings.json')
    EMB = JSON.parse(readFileSync(path, 'utf8'))
    return EMB
  }

  function cosine(a, b) {
    let dot = 0, na = 0, nb = 0
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i]
      na += a[i] * a[i]
      nb += b[i] * b[i]
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb))
  }

  async function embedQuery(text, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
        taskType: 'RETRIEVAL_QUERY',
        outputDimensionality: EMBED_DIM,
      }),
    })
    if (!res.ok) throw new Error(`embed ${res.status}: ${await res.text()}`)
    return (await res.json()).embedding.values
  }

  async function generate(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEN_MODEL}:generateContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
    })
    if (!res.ok) throw new Error(`generate ${res.status}: ${await res.text()}`)
    const json = await res.json()
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? '(無回應)'
  }

  function buildPrompt(question, hits) {
    const context = hits.map((h, i) => `--- 來源 [${i + 1}] ${h.type === 'drug' ? '藥品' : '疾病'}：${h.name} ---\n${h.text}`).join('\n\n')
    return `你是台灣健康資訊助理。請僅依據以下「來源」內容回答使用者問題。

**強制規則**（違反必須拒答）：
1. 答案中的事實必須來自「來源」；若來源未提及，必須回答「資料庫中沒有相關資訊」，禁止憑常識或外部知識補充。
2. 每一段陳述後請以 [1]、[2] 形式標註來源編號。
3. 結尾必須加上一行：「⚠️ 本回答僅供教育參考，不取代醫師、藥師專業建議。如有疑慮請就醫。」
4. 不得提供處方建議、不得指示使用劑量超出來源所述範圍。
5. 使用繁體中文回答。

==========來源==========
${context}
==========來源結束==========

使用者問題：${question}

請依規則回答：`
  }

  return {
    name: 'ask-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/ask', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        const apiKey = env.GEMINI_API_KEY
        if (!apiKey) {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          return res.end(JSON.stringify({ error: 'GEMINI_API_KEY not set in .env' }))
        }
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
          const question = (body.question ?? '').trim()
          const topK = Math.min(Math.max(body.topK ?? 4, 1), 8)
          if (!question) {
            res.statusCode = 400
            res.setHeader('content-type', 'application/json')
            return res.end(JSON.stringify({ error: 'question is required' }))
          }
          if (question.length > 500) {
            res.statusCode = 400
            res.setHeader('content-type', 'application/json')
            return res.end(JSON.stringify({ error: 'question too long (max 500 chars)' }))
          }
          const { chunks: docs } = loadEmbeddings()
          const qVec = await embedQuery(question, apiKey)
          const ranked = docs
            .map(c => ({ ...c, score: cosine(qVec, c.vector) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
          const hits = ranked.map(({ vector, ...rest }) => rest)
          const answer = await generate(buildPrompt(question, hits), apiKey)
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({
            answer,
            sources: hits.map(h => ({ id: h.id, type: h.type, name: h.name, score: Number(h.score.toFixed(4)) })),
          }))
        } catch (err) {
          console.error('[/api/ask]', err)
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: String(err.message ?? err) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), askDevMiddleware(env)],
    base: './',
  }
})
