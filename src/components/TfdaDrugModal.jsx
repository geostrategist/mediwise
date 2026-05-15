import { useEffect } from 'react'

export default function TfdaDrugModal({ drug, onClose }) {
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
        <div className="modal-header">
          <div
            className="modal-header-icon"
            style={{ background: '#fef3c7' }}
          >
            📋
          </div>
          <div className="modal-header-info">
            <div className="modal-name">{drug.name}</div>
            {drug.englishName && (
              <div style={{ fontSize: '0.85rem', color: '#92400e', fontStyle: 'italic', marginBottom: '0.15rem' }}>
                {drug.englishName}
              </div>
            )}
            <div className="modal-brand">許可證字號：{drug.license}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  background: '#fef3c7',
                  color: '#92400e',
                  fontWeight: 600,
                }}
              >
                {drug.category}
              </span>
              {drug.form && (
                <span style={{ fontSize: '0.75rem', color: '#64748b', padding: '0.2rem 0.5rem', background: '#f1f5f9', borderRadius: '999px' }}>
                  {drug.form}
                </span>
              )}
              {drug.country && (
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🌏 {drug.country}</span>
              )}
              {drug.variantCount > 1 && (
                <span style={{ fontSize: '0.72rem', color: '#0d9488', padding: '0.2rem 0.5rem', background: '#f0fdfa', borderRadius: '999px' }}>
                  同成分 {drug.variantCount} 品項
                </span>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="關閉">✕</button>
        </div>

        <div className="modal-body">
          {drug.ingredient && (
            <div className="info-section">
              <div className="info-label">🧪 主成分</div>
              <div className="info-text" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {drug.ingredient}
              </div>
            </div>
          )}

          {drug.indications && (
            <div className="info-section">
              <div className="info-label">✅ 適應症</div>
              <div className="info-text">{drug.indications}</div>
            </div>
          )}

          {drug.dosage && (
            <div className="info-section">
              <div className="info-label">📏 用法用量</div>
              <div className="info-text">{drug.dosage}</div>
            </div>
          )}

          {drug.applicant && (
            <div className="info-section">
              <div className="info-label">🏢 申請廠商</div>
              <div className="info-text" style={{ fontSize: '0.85rem' }}>{drug.applicant}</div>
            </div>
          )}

          <div
            style={{
              background: '#fffbeb',
              borderRadius: 'var(--radius)',
              padding: '0.85rem 1rem',
              fontSize: '0.8rem',
              color: '#854d0e',
              borderLeft: '3px solid #f59e0b',
              lineHeight: 1.6,
            }}
          >
            📋 <strong>資料來源：</strong>衛生福利部食品藥物管理署「全部藥品許可證資料集」
            <br />
            <span style={{ fontSize: '0.75rem' }}>
              本資料為食藥署核准許可證之公開資訊，副作用與警語請參閱實體仿單。實際用藥請諮詢醫師或藥師。
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
