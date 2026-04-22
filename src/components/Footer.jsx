import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            <span>智醫未來</span>
            <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
              AI for a Better Future｜成淵高中
            </div>
          </div>
          <div className="footer-links">
            <Link to="/">首頁</Link>
            <Link to="/drugs">藥品資訊</Link>
            <Link to="/health">衛教資訊</Link>
            <Link to="/check">症狀分析</Link>
          </div>
        </div>
        <div className="footer-copy">
          ⚠️ 本網站內容僅供教育參考用途，不得取代專業醫療建議、診斷或治療。如有健康疑慮，請諮詢合格醫療人員。<br />
          © 2026 智醫未來｜姚毅焺・江聿庭・汪鄧翔
        </div>
      </div>
    </footer>
  )
}
