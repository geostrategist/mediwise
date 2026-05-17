import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-grid">
            <div className="hero-main">
              <div className="hero-badge">
                🤖 AI for a Better Future・成淵高中
              </div>
              <h1>
                AI 讓健康資訊<br />
                <span>觸手可及</span>
              </h1>
              <p className="hero-desc">
                提供台灣民眾準確的藥品資訊、衛教知識與症狀初步分析，
                以 AI 輔助健康決策，讓每個人都能做出更明智的醫療選擇。
              </p>
              <div className="hero-actions">
                <Link to="/drugs" className="btn btn-primary btn-lg">
                  💊 查詢藥品資訊
                </Link>
                <Link to="/check" className="btn btn-outline btn-lg">
                  🩺 症狀自我分析
                </Link>
              </div>
              <div className="hero-disclaimer">
                ⚠️ 本工具僅供教育參考，不取代專業醫療建議
              </div>
            </div>

            {/* Cover panel */}
            <div className="hero-cover">
              <svg className="hero-cover-deco" viewBox="0 0 360 120" fill="none" aria-hidden="true">
                <path
                  d="M0 70 H96 L112 70 L126 30 L142 104 L158 52 L172 70 H236 L250 70 L262 44 L274 88 L286 70 H360"
                  stroke="rgba(255,255,255,0.55)" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
                <circle cx="142" cy="104" r="4" fill="#a7f3d0" />
                <circle cx="320" cy="28" r="22" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                <circle cx="36" cy="26" r="11" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                <path d="M308 96 h10 m-5 -5 v10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="hero-cover-kicker">🚀 立即行動</div>
              <h2 className="hero-cover-title">
                為您的健康領航<br />
                <span>搶先體驗智慧醫藥導航</span>
              </h2>

              <div className="hero-cover-feats">
                <span className="hero-feat">💊 藥品查詢</span>
                <span className="hero-feat">📖 衛教知識</span>
                <span className="hero-feat">🩺 症狀分析</span>
              </div>

              <div className="hero-cover-slogan">
                讓健康資訊更簡單，讓用藥理由更透明
              </div>

              <div className="hero-cover-quote">
                現有系統解決了「資訊透明」，<br />
                而智醫未來進一步解決「<strong>資訊理解</strong>」與「<strong>決策支持</strong>」。
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Feature Cards */}
        <div className="feature-grid">
          <Link to="/drugs" className="feature-card" style={{ '--hover-color': '#0d9488' }}>
            <div
              className="feature-card-icon"
              style={{ background: '#f0fdfa' }}
            >
              💊
            </div>
            <div
              className="feature-card-badge"
              style={{ background: '#ccfbf1', color: '#0f766e' }}
            >
              50% 核心功能
            </div>
            <div>
              <h3>藥品資訊查詢</h3>
              <p>收錄 20 種台灣常見用藥，包含用法、劑量、藥理機轉、適應症及副作用詳細說明。</p>
            </div>
            <div className="feature-card-arrow" style={{ color: '#0d9488' }}>
              立即查詢 →
            </div>
          </Link>

          <Link to="/health" className="feature-card">
            <div
              className="feature-card-icon"
              style={{ background: '#eff6ff' }}
            >
              🏥
            </div>
            <div
              className="feature-card-badge"
              style={{ background: '#dbeafe', color: '#1d4ed8' }}
            >
              30% 衛教功能
            </div>
            <div>
              <h3>衛教資訊</h3>
              <p>台灣 8 大常見本土疾病，涵蓋症狀、預防措施及健保政策介紹，提升民眾健康識能。</p>
            </div>
            <div className="feature-card-arrow" style={{ color: '#2563eb' }}>
              了解更多 →
            </div>
          </Link>

          <Link to="/check" className="feature-card">
            <div
              className="feature-card-icon"
              style={{ background: '#fff7ed' }}
            >
              🩺
            </div>
            <div
              className="feature-card-badge"
              style={{ background: '#fed7aa', color: '#c2410c' }}
            >
              20% 分析功能
            </div>
            <div>
              <h3>身體狀況分析</h3>
              <p>勾選症狀後即可獲得初步分析與就醫建議，依照台灣醫療分級制度，引導民眾正確就醫。</p>
            </div>
            <div className="feature-card-arrow" style={{ color: '#ea580c' }}>
              開始分析 →
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-value">20</div>
            <div className="stat-label">收錄藥品種類</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">8</div>
            <div className="stat-label">台灣常見疾病</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">60+</div>
            <div className="stat-label">可分析症狀</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4</div>
            <div className="stat-label">醫療分級引導</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">99%</div>
            <div className="stat-label">全民健保覆蓋率</div>
          </div>
        </div>

        {/* About Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', alignItems: 'start' }}>
          <div
            className="card"
            style={{ padding: '2rem', background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)' }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>產品核心理念</h3>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7 }}>
              台灣民眾面臨藥品資訊取得困難、衛教知識不足等問題。
              本產品結合 AI 技術，打造高可及性的健康資訊平台，
              讓每位民眾都能輕鬆獲得正確的醫療健康知識。
            </p>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚖️</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>法規遵循聲明</h3>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7 }}>
              本平台嚴格遵守醫療法、藥事法、個人資料保護法等相關規定。
              所有藥品圖片均為 AI 生成，台灣本土藥品限指示藥及成藥。
              本工具不提供診斷，不取代醫師意見。
            </p>
          </div>
        </div>

        {/* AI 可解釋性說明 */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>AI 可解釋性設計</h3>
          <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7, marginBottom: '0.25rem' }}>
            本平台的每項 AI 功能都讓使用者看得到「為什麼這樣判斷」，而非只給出黑箱結果。
            可解釋性（Explainability）能幫助民眾核對資訊、建立信任，也避免過度依賴 AI。
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1rem',
              marginTop: '1.25rem',
            }}
          >
            {[
              {
                icon: '🩺',
                title: '症狀分析 — 白箱規則引擎',
                desc: '不是黑箱模型，而是公開的規則比對。結果會攤開命中的規則、計算「符合程度」分數，並標示你勾選的哪些症狀是判斷依據、哪些不是。',
                color: '#ea580c',
                bg: '#fff7ed',
              },
              {
                icon: '🤖',
                title: 'AI 問答 — 檢索接地（RAG）',
                desc: '回答僅依據知識庫檢索到的內容生成，每段話標註 [1][2] 引用來源並附相似度分數，使用者可回溯原始資料、查核正確性。',
                color: '#0d9488',
                bg: '#f0fdfa',
              },
              {
                icon: '📷',
                title: '相片辨識 — 信心度與理由',
                desc: '辨識藥品時回傳「高/中/低」把握程度，並以文字說明從照片看到哪些線索；把握不足時主動回報「無法辨識」，不硬猜。',
                color: '#2563eb',
                bg: '#eff6ff',
              },
            ].map(item => (
              <div
                key={item.title}
                style={{
                  background: item.bg,
                  borderRadius: 'var(--radius)',
                  padding: '1.1rem 1.15rem',
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: item.color, marginBottom: '0.35rem' }}>
                  {item.title}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Banner */}
        <div
          style={{
            background: '#fefce8',
            border: '1px solid #fde047',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            marginBottom: '2rem',
          }}
        >
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
          <div>
            <strong style={{ fontSize: '0.9rem', color: '#713f12' }}>重要聲明</strong>
            <p style={{ fontSize: '0.83rem', color: '#854d0e', marginTop: '0.25rem', lineHeight: 1.6 }}>
              本平台提供之資訊僅供教育及參考用途，不得作為醫療診斷或治療依據。
              服藥前請詳閱藥品仿單，或諮詢醫師、藥師。如有緊急醫療需求，請立即撥打 119 或前往急診。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
