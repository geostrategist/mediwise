# 智醫未來 — 開發進度

> 每次工作結束更新此檔，下次接手先看這裡。

## 目前狀態（2026-05-15）

- **線上網址**：https://mediwise99.netlify.app
- **Repo**：https://github.com/geostrategist/mediwise（branch `main`）
- **部署方式**：Netlify 連結 GitHub，`git push` 後自動部署
- **最新 commit**：`0c1c046` feat(drugs): 精選 20 種新增「用相片辨識」

## 已完成

- 四大頁面：首頁、藥品資訊（精選 20 種 / 食藥署 OTC 2,188 / 健保 3,348）、衛教資訊、症狀分析、AI 問答
- AI 問答：RAG（Gemini embedding + 2.5 Flash），Function `/api/ask`
- 症狀分析（BodyCheck）：`src/data/symptoms.js` 規則引擎，41 症狀 / 21 規則
- 相片辨識：`/api/identify` Function，Gemini Vision 從精選 20 種辨識藥品照片

## 待辦 / 下一步

- [ ] 確認 Netlify 已設 `GEMINI_API_KEY` 環境變數（AI 問答與相片辨識都需要）
- [ ] 上線後實測相片辨識（拍真實藥盒）
- [ ] 視需要擴充精選藥品數量（目前 20 種）

## 注意事項

- 本機 `netlify dev` 在此 Windows 環境會因 `.netlify/` 資料夾權限（EPERM）失敗；
  Function 改用 `scripts/test-identify.mjs` 獨立測試，不影響雲端部署。
- 改了 `src/data/drugs.js` 或 `diseases.js` 後，需重跑 `npm run embeddings` 更新 RAG 語料。
- 測試腳本：`scripts/test-bodycheck.py`（症狀分析）、`scripts/test-identify.mjs`（相片辨識）。
