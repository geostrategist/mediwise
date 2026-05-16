import { useState, useMemo } from 'react'
import { symptomGroups, analysisRules, defaultResult } from '../data/symptoms'

// 回傳命中規則並附上 explain 物件，攤開判斷依據（可解釋性）。
function analyze(selected) {
  if (selected.length === 0) return null

  for (const rule of analysisRules) {
    const matched = rule.symptoms.filter(s => selected.includes(s))
    const isSingle = rule.symptoms.length === 1
    const triggered = matched.length >= 2 || (isSingle && matched.length === 1)
    if (!triggered) continue
    return {
      ...rule,
      explain: {
        matched,
        unmatched: rule.symptoms.filter(s => !selected.includes(s)),
        total: rule.symptoms.length,
        score: Math.round((matched.length / rule.symptoms.length) * 100),
        trigger: isSingle ? 'single' : 'multi',
        extra: selected.filter(s => !rule.symptoms.includes(s)),
      },
    }
  }
  return { ...defaultResult, explain: null }
}

export default function BodyCheck() {
  const [selected, setSelected] = useState([])

  const toggle = (symptom) => {
    setSelected(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const result = useMemo(() => analyze(selected), [selected])

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">🩺 症狀分析</div>
          <h2>身體狀況初步分析</h2>
          <p>勾選您目前的症狀，系統將提供初步分析與就醫建議</p>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
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
            本功能僅提供初步參考，無法取代醫師診斷。
            心理疾病相關症狀不在本工具分析範圍內。
            如有緊急狀況（胸痛、意識不清、呼吸困難），請立即撥打 <strong>119</strong>。
          </span>
        </div>

        <div className="body-check-layout">
          {/* Left: Symptom Selector */}
          <div>
            {selected.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="selected-count">
                  ✓ 已選 {selected.length} 項症狀
                </span>
                <button
                  onClick={() => setSelected([])}
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    background: 'none',
                    border: '1px solid #e2e8f0',
                    borderRadius: '999px',
                    padding: '0.3rem 0.75rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  清除全部
                </button>
              </div>
            )}

            {symptomGroups.map(group => (
              <div key={group.category} className="symptom-group">
                <div className="symptom-group-title">{group.category}</div>
                <div className="symptom-checkbox-grid">
                  {group.symptoms.map(symptom => (
                    <label key={symptom} style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        className="symptom-checkbox"
                        checked={selected.includes(symptom)}
                        onChange={() => toggle(symptom)}
                      />
                      <span className="symptom-label">
                        {selected.includes(symptom) && '✓ '}
                        {symptom}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Result Panel */}
          <div>
            <div
              className="result-panel"
              style={result ? { borderColor: result.color } : {}}
            >
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#475569' }}>
                📋 分析結果
              </h3>

              {!result ? (
                <div className="result-empty">
                  <div className="result-empty-icon">🩺</div>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    請在左側勾選您的症狀<br />系統將自動分析並給出建議
                  </p>
                </div>
              ) : (
                <div className="fade-in">
                  <div
                    className="result-card"
                    style={{ background: result.bgColor }}
                  >
                    <div className="result-level" style={{ color: result.color }}>
                      {result.levelText}
                    </div>
                    <div className="result-name">{result.result}</div>
                    <div className="result-advice">{result.advice}</div>
                    <div
                      className="result-facility"
                      style={{ borderLeft: `3px solid ${result.color}` }}
                    >
                      🏥 建議就醫層級：{result.facilityLevel}
                    </div>
                  </div>

                  {/* 判斷依據（可解釋性） */}
                  {result.explain ? (
                    <div className="explain-box">
                      <div className="explain-title">🔍 判斷依據（可解釋性）</div>

                      <div className="explain-score">
                        <span className="explain-score-label">符合程度</span>
                        <div className="explain-bar">
                          <div
                            className="explain-bar-fill"
                            style={{ width: `${result.explain.score}%`, background: result.color }}
                          />
                        </div>
                        <span className="explain-pct" style={{ color: result.color }}>
                          {result.explain.score}%
                        </span>
                      </div>
                      <p className="explain-line">
                        此判斷對應一條關注 <strong>{result.explain.total}</strong> 項症狀的規則，
                        你勾選的症狀符合其中 <strong>{result.explain.matched.length}</strong> 項。
                      </p>

                      <div className="explain-sub">規則關注的症狀（✓ 為你的判斷依據）：</div>
                      <div className="explain-chips">
                        {result.explain.matched.map(s => (
                          <span key={s} className="explain-chip hit">✓ {s}</span>
                        ))}
                        {result.explain.unmatched.map(s => (
                          <span key={s} className="explain-chip miss">✗ {s}</span>
                        ))}
                      </div>

                      <p className="explain-line">
                        <strong>觸發方式：</strong>
                        {result.explain.trigger === 'single'
                          ? '此為高風險「紅旗症狀」，只要偵測到 1 項即觸發最高層級就醫建議。'
                          : '此為多症狀規則，勾選符合其中 ≥ 2 項即觸發。'}
                      </p>
                      <p className="explain-line">
                        <strong>判斷順序：</strong>系統將 {analysisRules.length} 條規則依嚴重度由高到低
                        排列、逐條比對，上方為第一條達到觸發門檻的規則，因此優先於其他較輕症的可能。
                      </p>

                      {result.explain.extra.length > 0 && (
                        <>
                          <div className="explain-sub">你另外勾選、但不屬於此規則判斷依據的症狀：</div>
                          <div className="explain-chips">
                            {result.explain.extra.map(s => (
                              <span key={s} className="explain-chip extra">{s}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="explain-box">
                      <div className="explain-title">🔍 判斷依據（可解釋性）</div>
                      <p className="explain-line">
                        你勾選的症狀組合未對應到系統 {analysisRules.length} 條規則中的任何一條觸發條件
                        （多症狀規則需符合 ≥ 2 項、紅旗症狀需 1 項）。
                        因此系統不臆測病因，改建議由醫師綜合評估。
                      </p>
                      <div className="explain-sub">你勾選的症狀：</div>
                      <div className="explain-chips">
                        {selected.map(s => (
                          <span key={s} className="explain-chip extra">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="disclaimer-box">
                    ⚕️ 此分析結果僅供參考，由規則引擎生成，非醫師診斷。
                    症狀相似的疾病眾多，請務必至醫療機構接受專業評估。
                    若症狀嚴重或您有疑慮，請勿延誤就醫。
                  </div>
                </div>
              )}
            </div>

            {/* Medical Hierarchy Quick Guide */}
            <div
              className="card"
              style={{ padding: '1.25rem', marginTop: '1.25rem' }}
            >
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.85rem', color: '#475569' }}>
                🏢 快速就醫指引
              </h4>
              {[
                { icon: '🚨', level: '立即急診', desc: '胸痛、意識不清、抽搐、嚴重呼吸困難', color: '#dc2626', bg: '#fef2f2' },
                { icon: '⚠️', level: '今日就醫', desc: '持續高燒、嚴重疼痛、懷疑傳染病', color: '#ea580c', bg: '#fff7ed' },
                { icon: '📋', level: '近期就醫', desc: '輕至中度症狀超過 2–3 天', color: '#0d9488', bg: '#f0fdfa' },
                { icon: '✅', level: '居家觀察', desc: '輕微症狀，補水休息即可', color: '#2563eb', bg: '#eff6ff' },
              ].map(item => (
                <div
                  key={item.level}
                  style={{
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'center',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: item.bg,
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>
                      {item.level}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', textAlign: 'center' }}>
                緊急救護：119｜衛生福利部疾病管制署：1922
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
