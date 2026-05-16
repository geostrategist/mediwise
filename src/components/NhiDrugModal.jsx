import { useEffect } from 'react'

export default function NhiDrugModal({ drug, onClose }) {
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
          <div className="modal-header-icon" style={{ background: '#dbeafe' }}>🏥</div>
          <div className="modal-header-info">
            <div className="modal-name">{drug.name}</div>
            {drug.englishName && (
              <div style={{ fontSize: '0.85rem', color: '#1d4ed8', fontStyle: 'italic', marginBottom: '0.15rem' }}>
                {drug.englishName}
              </div>
            )}
            <div className="modal-brand">健保藥品代號：{drug.code}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {drug.category && (
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
                  {drug.category}
                </span>
              )}
              {drug.form && (
                <span style={{ fontSize: '0.75rem', color: '#64748b', padding: '0.2rem 0.5rem', background: '#f1f5f9', borderRadius: '999px' }}>
                  {drug.form}
                </span>
              )}
              {drug.atc && (
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: '#f0fdfa', color: '#0f766e', fontFamily: 'monospace' }}>
                  ATC {drug.atc}
                </span>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="關閉">✕</button>
        </div>

        <div className="modal-body">
          {drug.ingredient && (
            <div className="info-section">
              <div className="info-label">🧪 成分</div>
              <div className="info-text" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{drug.ingredient}</div>
            </div>
          )}

          {drug.spec && (
            <div className="info-section">
              <div className="info-label">📐 規格</div>
              <div className="info-text">{drug.spec}</div>
            </div>
          )}

          {Number(drug.price) > 0 && (
            <div className="info-section">
              <div className="info-label">💰 健保支付價</div>
              <div className="info-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d9488' }}>
                NT$ {drug.price}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                此為健保署核定支付價，並非市場零售價
              </div>
            </div>
          )}

          {drug.groupName && (
            <div className="info-section">
              <div className="info-label">🏷️ 健保分組</div>
              <div className="info-text" style={{ fontSize: '0.85rem' }}>{drug.groupName}</div>
            </div>
          )}

          {drug.ruleSection && (
            <div className="info-section">
              <div className="info-label">📜 給付規定章節</div>
              <div className="info-text" style={{ fontSize: '0.85rem' }}>{drug.ruleSection}</div>
              {drug.ruleLink && (
                <a
                  href={drug.ruleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.8rem', color: '#0d9488', marginTop: '0.4rem', display: 'inline-block' }}
                >
                  查看完整給付規定 →
                </a>
              )}
            </div>
          )}

          {drug.dispenser && (
            <div className="info-section">
              <div className="info-label">🏢 藥商</div>
              <div className="info-text" style={{ fontSize: '0.85rem' }}>{drug.dispenser}</div>
            </div>
          )}

          {drug.variantCount > 1 && (
            <div className="info-section">
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                💡 此成分共有 <strong>{drug.variantCount}</strong> 個健保品項（顯示其中支付價最低者）
              </div>
            </div>
          )}

          <div
            style={{
              background: '#eff6ff',
              borderRadius: 'var(--radius)',
              padding: '0.85rem 1rem',
              fontSize: '0.8rem',
              color: '#1e3a8a',
              borderLeft: '3px solid #3b82f6',
              lineHeight: 1.6,
            }}
          >
            🏥 <strong>資料來源：</strong>衛生福利部中央健康保險署「健保用藥品項查詢項目檔」
            <br />
            <span style={{ fontSize: '0.75rem' }}>
              本資料庫多為處方用藥，民眾不可自行購買。實際用藥請遵醫囑，給付規則以健保署最新公告為準。
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
