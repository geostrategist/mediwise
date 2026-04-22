import { useState } from 'react'
import { diseases, nhiPolicies } from '../data/diseases'

function DiseaseModal({ disease, onClose }) {
  if (!disease) return null
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal slide-up">
        <div className="modal-header">
          <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{disease.icon}</div>
          <div className="modal-header-info">
            <div className="modal-name">{disease.name}</div>
            <div className="modal-brand">{disease.englishName}</div>
            <span
              className="disease-level-badge"
              style={{
                marginTop: '0.4rem',
                background: disease.levelColor + '18',
                color: disease.levelColor,
                display: 'inline-block',
              }}
            >
              {disease.level}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="disease-modal-section">
            <h4>📌 概述</h4>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7 }}>{disease.overview}</p>
          </div>
          <div className="disease-modal-section">
            <h4>📊 台灣流行狀況</h4>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7 }}>{disease.epidemiology}</p>
          </div>
          <div className="disease-modal-section">
            <h4>🤒 主要症狀</h4>
            <div className="symptom-chips" style={{ marginTop: '0.4rem' }}>
              {disease.symptoms.map((s, i) => (
                <span key={i} className="symptom-chip">{s}</span>
              ))}
            </div>
          </div>
          <div className="disease-modal-section">
            <h4>🛡️ 預防方法</h4>
            <div className="symptom-chips" style={{ marginTop: '0.4rem' }}>
              {disease.prevention.map((p, i) => (
                <span key={i} className="prevention-chip">{p}</span>
              ))}
            </div>
          </div>
          <div className="disease-modal-section">
            <h4>💊 治療方向</h4>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7 }}>{disease.treatment}</p>
          </div>
          <div
            style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: 'var(--radius)',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem',
              color: '#7c2d12',
              lineHeight: 1.6,
            }}
          >
            🏥 <strong>何時就醫：</strong>{disease.whenToSee}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HealthEdu() {
  const [tab, setTab] = useState('diseases')
  const [selectedDisease, setSelectedDisease] = useState(null)

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🏥 衛教資訊</div>
          <h2>健康知識與疾病預防</h2>
          <p>台灣常見本土疾病、流行病學資訊與全民健保政策介紹</p>
        </div>

        {/* Tabs */}
        <div className="tab-list">
          <button
            className={`tab-btn ${tab === 'diseases' ? 'active' : ''}`}
            onClick={() => setTab('diseases')}
          >
            🦠 常見疾病（8種）
          </button>
          <button
            className={`tab-btn ${tab === 'nhi' ? 'active' : ''}`}
            onClick={() => setTab('nhi')}
          >
            💳 健保政策
          </button>
        </div>

        {tab === 'diseases' && (
          <div className="fade-in">
            <div
              style={{
                background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: '#1e40af',
                lineHeight: 1.6,
              }}
            >
              💡 點選任一疾病卡片，可查看完整的症狀、預防措施、流行狀況及就醫建議。
            </div>
            <div className="disease-grid">
              {diseases.map(disease => (
                <div
                  key={disease.id}
                  className="disease-card"
                  onClick={() => setSelectedDisease(disease)}
                  style={{ borderTop: `3px solid ${disease.color}` }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelectedDisease(disease)}
                >
                  <div className="disease-header">
                    <span className="disease-icon">{disease.icon}</span>
                    <div>
                      <div className="disease-name">{disease.name}</div>
                      <div className="disease-en">{disease.englishName}</div>
                    </div>
                  </div>
                  <div>
                    <span
                      className="disease-level-badge"
                      style={{ background: disease.levelColor + '15', color: disease.levelColor }}
                    >
                      {disease.level}
                    </span>
                  </div>
                  <p className="disease-overview">{disease.overview}</p>
                  <div
                    style={{
                      marginTop: '0.85rem',
                      fontSize: '0.8rem',
                      color: disease.color,
                      fontWeight: 600,
                    }}
                  >
                    查看完整資訊 →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'nhi' && (
          <div className="fade-in">
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ fontSize: '2rem' }}>🏥</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
                  全民健康保險簡介
                </div>
                <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7 }}>
                  台灣全民健保自 1995 年開辦，採單一支付者制度，覆蓋率達 99% 以上，
                  保障範圍涵蓋門診、住院、手術、藥物等，是台灣最重要的社會安全制度之一。
                </div>
              </div>
            </div>

            <div className="policy-grid">
              {nhiPolicies.map(p => (
                <div key={p.id} className="policy-card">
                  <div className="policy-icon">{p.icon}</div>
                  <div className="policy-title">{p.title}</div>
                  <div className="policy-content">{p.content}</div>
                </div>
              ))}
            </div>

            {/* Medical Level Table */}
            <div className="card" style={{ marginTop: '1.5rem', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem' }}>🏢 台灣醫療分級制度</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['層級', '類型', '適合情況', '需要轉診', '自付比例'].map(h => (
                        <th
                          key={h}
                          style={{
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            fontWeight: 700,
                            color: '#475569',
                            fontSize: '0.8rem',
                            borderBottom: '2px solid #e2e8f0',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['一', '基層診所', '感冒、輕症、慢性病追蹤', '否', '最低'],
                      ['二', '地區醫院', '中度急性病、需住院', '建議', '較低'],
                      ['三', '區域醫院', '複雜疾病、專科門診', '需要', '中'],
                      ['四', '醫學中心', '重症、罕見疾病、教學研究', '需要', '最高'],
                    ].map(([level, type, situation, referral, cost], i) => (
                      <tr
                        key={level}
                        style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 ? '#fafafa' : '#fff' }}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0d9488' }}>第{level}級</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{type}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{situation}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: referral === '否' ? '#dcfce7' : referral === '建議' ? '#fef9c3' : '#fee2e2',
                              color: referral === '否' ? '#15803d' : referral === '建議' ? '#854d0e' : '#991b1b',
                            }}
                          >
                            {referral}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedDisease && (
        <DiseaseModal disease={selectedDisease} onClose={() => setSelectedDisease(null)} />
      )}
    </div>
  )
}
