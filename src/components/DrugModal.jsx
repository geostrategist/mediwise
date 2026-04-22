import { useEffect } from 'react'

export default function DrugModal({ drug, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal slide-up">
        {/* Header */}
        <div className="modal-header">
          <div
            className="modal-header-icon"
            style={{ background: drug.color + '18' }}
          >
            {drug.icon}
          </div>
          <div className="modal-header-info">
            <div className="modal-name">{drug.name}</div>
            <div style={{ fontSize: '0.9rem', color: '#0d9488', fontStyle: 'italic', marginBottom: '0.15rem' }}>{drug.englishName}</div>
            <div className="modal-brand">{drug.brandName}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`category-badge badge-${drug.category}`}>{drug.category}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🌏 {drug.origin}</span>
              {drug.tags.map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="關閉">✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="info-section">
            <div className="info-label">💊 用法</div>
            <div className="info-text">{drug.usage}</div>
          </div>

          <div className="info-section">
            <div className="info-label">📏 劑量</div>
            <div className="info-text">{drug.dosage}</div>
          </div>

          <div className="info-section">
            <div className="info-label">🔬 藥理作用（機轉）</div>
            <div className="info-text">{drug.mechanism}</div>
          </div>

          <div className="info-section">
            <div className="info-label">✅ 適應症</div>
            <ul className="info-list">
              {drug.indications.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <div className="info-label">⚠️ 副作用</div>
            <ul className="info-list">
              {drug.sideEffects.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="warning-box">
            <span>⚠️</span>
            <span><strong>注意事項：</strong>{drug.warnings}</span>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem',
            fontSize: '0.78rem',
            color: '#94a3b8',
            borderLeft: `3px solid ${drug.color}`,
          }}>
            本資訊僅供教育參考。實際用藥請遵醫囑，或諮詢藥師。
          </div>
        </div>
      </div>
    </div>
  )
}
