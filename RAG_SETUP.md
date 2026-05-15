# RAG 問答功能設定（Gemini 免費 API）

## 一次性準備

### 1. 取得 Gemini API key（免費）

到 https://aistudio.google.com/apikey 登入 Google 帳號 → Create API key → 複製。

Gemini 免費額度（截至 2025）：
- `text-embedding-004`：每分鐘 1,500 次請求
- `gemini-2.5-flash`：每分鐘 15 次、每天 1,500 次

對本站 28 筆資料 + 學校 demo 規模綽綽有餘。

### 2. 安裝 Netlify CLI（本機開發用）

```bash
npm install -g netlify-cli
```

### 3. 設定本機 API key

在 `drug-website/` 建一個 `.env` 檔（已在 `.gitignore` 內，不會被 commit）：

```
GEMINI_API_KEY=你的key貼這裡
```

## 預先計算 embeddings

每次改了 `src/data/drugs.js` 或 `src/data/diseases.js` 後執行一次：

```bash
# Windows PowerShell:
$env:GEMINI_API_KEY="你的key"; npm run embeddings

# 或在 bash:
GEMINI_API_KEY=你的key npm run embeddings
```

會產生 `netlify/functions/embeddings.json`（約 200-300 KB，含 28 筆 768 維向量）。

## 本機開發

```bash
npm run netlify-dev
```

開啟 http://localhost:8888，點導覽列「🤖 AI 問答」測試。

**注意**：不能用 `npm run dev`（純 Vite）測 AI 問答 — 那只有前端，沒有 Netlify Functions。

## 部署到 Netlify

1. 把 repo 推到 GitHub / GitLab，在 Netlify 連結 repo
2. 到 Netlify dashboard → Site settings → Environment variables → 新增：
   - Key: `GEMINI_API_KEY`
   - Value: 你的 API key
3. **重要**：因為 `embeddings.json` 在 `.gitignore` 裡，部署前要：
   - 方式 A（推薦）：本機 `npm run embeddings` 產生檔案後，**臨時拿掉 .gitignore 那行**，commit 進去
   - 方式 B：在 Netlify build 階段也跑 embedding script（需要把 API key 加到 build env，build 時間會多 ~30 秒）

## 架構說明

```
[使用者問題] → /api/ask (Netlify Function)
                 │
                 ├─ 1. 呼叫 Gemini Embedding API（768d 向量）
                 ├─ 2. 跟 embeddings.json 內 28 筆做 cosine similarity
                 ├─ 3. 取 top-4 相關 chunk 組成 prompt
                 ├─ 4. 呼叫 Gemini 2.5 Flash 生成回答
                 └─ 5. 回傳 { answer, sources }
                 ↓
[Ask.jsx 渲染] 對話氣泡 + 來源 chip
```

## 防幻覺策略

`netlify/functions/ask.mjs` 的 `buildPrompt()` 函式內，prompt 強制要求：

1. 事實必須來自檢索到的「來源」，沒有的資訊必須說「資料庫中沒有相關資訊」
2. 每段陳述附 [1][2] 來源編號
3. 結尾必須加醫療免責聲明
4. 不得提供處方劑量超出來源範圍

若仍出現幻覺，調整方向：
- 降低 `temperature`（目前 0.2，可降到 0）
- 增加 top-k（目前 4，可改 6-8）
- 在 prompt 加上「再三檢查每個事實是否在來源中」

## 故障排除

| 症狀 | 原因 | 解法 |
|---|---|---|
| `GEMINI_API_KEY not configured on server` | 環境變數沒設 | 檢查 `.env` 或 Netlify env |
| `embed 429` | 超過 free tier QPM | 等一分鐘，或減少 retry |
| 函式找不到 embeddings.json | 沒先跑 embedding 腳本 | `npm run embeddings` |
| 答案說「資料庫中沒有相關資訊」 | 語料庫真的沒這筆 | 擴充 drugs.js / diseases.js |
