import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SAMPLE_QUESTIONS = [
  '我頭痛又發燒，普拿疼跟布洛芬哪個比較適合？',
  '登革熱的症狀有哪些？什麼時候要去急診？',
  '小孩感染流感能吃阿斯匹靈嗎？',
  '高血壓平常要注意什麼？台灣健保有給付什麼藥？',
]

function renderAnswer(text) {
  return text.split('\n').map((line, i) => (
    <p key={i} style={{ margin: '0 0 0.5rem', lineHeight: 1.7 }}>{line || ' '}</p>
  ))
}

export default function Ask() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([]) // [{ q, answer, sources, error? }]
  const endRef = useRef(null)
  const navigate = useNavigate()

  // 點擊來源 → 深連結到該藥品/疾病的詳細資訊頁並開啟詳情
  const openSource = (s) => {
    const path = s.type === 'disease' ? '/health' : '/drugs'
    navigate(`${path}?focus=${encodeURIComponent(s.id)}`)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  async function submit(q) {
    const query = (q ?? question).trim()
    if (!query || loading) return
    setQuestion('')
    setLoading(true)
    const turn = { q: query }
    setHistory(h => [...h, turn])

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: query }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setHistory(h => h.map((t, i) => i === h.length - 1 ? { ...t, answer: data.answer, sources: data.sources } : t))
    } catch (err) {
      setHistory(h => h.map((t, i) => i === h.length - 1 ? { ...t, error: String(err.message ?? err) } : t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 880 }}>
        <div className="section-header">
          <div className="section-tag">🤖 AI 問答（RAG）</div>
          <h2>用問的查藥品與疾病資訊</h2>
          <p>輸入自然語言問題，AI 會從本站知識庫中檢索資料並標註來源</p>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            fontSize: '0.82rem',
            color: '#991b1b',
            lineHeight: 1.6,
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
          <span>
            <strong>重要聲明：</strong>
            本工具由 Gemini AI 生成回答，所有資訊僅供教育參考。
            AI 回答可能不完整或不正確，請務必諮詢醫師或藥師。緊急狀況請撥打 <strong>119</strong>。
          </span>
        </div>

        {/* How it works */}
        <div
          className="card"
          style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.85rem', background: '#f0fdfa', borderColor: '#99f6e4' }}
        >
          <strong style={{ color: '#0f766e' }}>💡 運作原理（RAG, Retrieval-Augmented Generation）</strong>
          <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', color: '#334155', lineHeight: 1.8 }}>
            <li>把你的問題轉成向量，從知識庫中檢索最相關的內容（20 種精選衛教藥品 + 8 種台灣常見疾病 + 800 種食藥署核准 OTC 仿單）</li>
            <li>把檢索結果 + 你的問題送給 Gemini，要求只能根據資料回答並標註來源</li>
            <li>顯示回答與來源卡片，方便你核對原始資訊</li>
          </ol>
        </div>

        {/* Conversation */}
        <div style={{ marginBottom: '1.5rem' }}>
          {history.length === 0 && !loading && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.6rem' }}>💬 試試這些問題：</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SAMPLE_QUESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="filter-pill"
                    style={{ textAlign: 'left', whiteSpace: 'normal', lineHeight: 1.4 }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((t, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              {/* Question bubble */}
              <div
                style={{
                  background: '#0d9488',
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  borderRadius: '14px 14px 4px 14px',
                  maxWidth: '80%',
                  marginLeft: 'auto',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  marginBottom: '0.75rem',
                }}
              >
                {t.q}
              </div>

              {/* Answer card */}
              <div
                className="card"
                style={{
                  padding: '1rem 1.25rem',
                  background: '#fff',
                  borderRadius: '4px 14px 14px 14px',
                  maxWidth: '90%',
                }}
              >
                {t.error ? (
                  <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                    ❌ 錯誤：{t.error}
                  </div>
                ) : t.answer ? (
                  <>
                    <div style={{ fontSize: '0.7rem', color: '#0d9488', fontWeight: 700, marginBottom: '0.5rem' }}>
                      🤖 GEMINI AI
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#0f172a' }}>
                      {renderAnswer(t.answer)}
                    </div>
                    {t.sources?.length > 0 && (
                      <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px dashed #e2e8f0' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.4rem' }}>
                          📚 引用來源（依相關度排序・點擊可查看詳細資訊）
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {t.sources.map((s, idx) => {
                            const styleByType = {
                              'drug':       { bg: '#f0fdfa', fg: '#0f766e', border: '#99f6e4', icon: '💊', tag: '精選' },
                              'disease':    { bg: '#eff6ff', fg: '#1d4ed8', border: '#bfdbfe', icon: '🏥', tag: '疾病' },
                              'tfda-drug':  { bg: '#fef3c7', fg: '#92400e', border: '#fde68a', icon: '📋', tag: '食藥署' },
                              'nhi-drug':   { bg: '#eef2ff', fg: '#3730a3', border: '#c7d2fe', icon: '🏥', tag: '健保' },
                            }[s.type] ?? { bg: '#f1f5f9', fg: '#475569', border: '#cbd5e1', icon: '📄', tag: '' }
                            return (
                              <button
                                key={s.id}
                                onClick={() => openSource(s)}
                                className="source-chip"
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '0.25rem 0.65rem',
                                  background: styleByType.bg,
                                  color: styleByType.fg,
                                  border: `1px solid ${styleByType.border}`,
                                  borderRadius: '999px',
                                  cursor: 'pointer',
                                  fontFamily: 'inherit',
                                }}
                                title={`${styleByType.tag}｜相似度：${s.score}｜點擊查看詳細資訊`}
                              >
                                [{idx + 1}] {styleByType.icon} {s.name} ↗
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    <span className="loading-dot" />
                    AI 思考中...
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={e => { e.preventDefault(); submit() }}
          style={{
            position: 'sticky',
            bottom: '1rem',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.5rem',
            display: 'flex',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="輸入問題，例如：登革熱不能吃哪些退燒藥？"
            maxLength={500}
            disabled={loading}
            style={{
              flex: 1,
              border: 'none',
              padding: '0.6rem 0.85rem',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              outline: 'none',
              background: 'transparent',
            }}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn btn-primary"
            style={{ opacity: loading || !question.trim() ? 0.5 : 1 }}
          >
            {loading ? '...' : '送出'}
          </button>
        </form>

        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.75rem' }}>
          知識庫：20 種精選藥品 + 8 種疾病 + 800 種食藥署仿單｜模型：Gemini 2.5 Flash + gemini-embedding-001
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .loading-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0d9488;
          animation: pulse 1.2s infinite;
        }
      `}</style>
    </div>
  )
}
