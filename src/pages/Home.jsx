import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
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
