import { useState } from 'react'
import {
  trendingDiseases,
  trendingMeta,
  categoryMeta,
  alertMeta,
  RADAR_AXES,
} from '../data/trending'

// ── 雷達圖（純 SVG，無第三方套件）────────────────────────────────
// 四軸固定順序：感染率 / 傳播速 / 醫療載荷 / 重症率，數值 0–100。
function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function RadarChart({ values, color, size = 220, showLabels = true }) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - (showLabels ? 42 : 14)
  const angles = [-90, 0, 90, 180] // 上、右、下、左

  const ringPoints = (ratio) =>
    angles
      .map((ang) => polar(cx, cy, maxR * ratio, ang).join(','))
      .join(' ')

  const dataPoints = angles
    .map((ang, i) => polar(cx, cy, (maxR * values[i]) / 100, ang).join(','))
    .join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg" role="img" aria-label="區域風險雷達圖">
      {/* 背景同心多邊形 */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon key={r} points={ringPoints(r)} className="radar-ring" />
      ))}
      {/* 軸線 */}
      {angles.map((ang, i) => {
        const [x, y] = polar(cx, cy, maxR, ang)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />
      })}
      {/* 數據區塊 */}
      <polygon
        points={dataPoints}
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {angles.map((ang, i) => {
        const [x, y] = polar(cx, cy, (maxR * values[i]) / 100, ang)
        return <circle key={i} cx={x} cy={y} r="3.5" fill={color} />
      })}
      {/* 軸標籤 */}
      {showLabels &&
        angles.map((ang, i) => {
          const [x, y] = polar(cx, cy, maxR + 20, ang)
          const anchor = i === 1 ? 'start' : i === 3 ? 'end' : 'middle'
          return (
            <text key={i} x={x} y={y} textAnchor={anchor} className="radar-label">
              <tspan x={x} dy="-0.1em">{RADAR_AXES[i]}</tspan>
              <tspan x={x} dy="1.15em" className="radar-label-val" fill={color}>
                {values[i]}
              </tspan>
            </text>
          )
        })}
    </svg>
  )
}

// ── 標籤膠囊 ────────────────────────────────────────────────────
function ChipRow({ items, variant }) {
  return (
    <div className="chip-row">
      {items.map((t, i) => (
        <span key={i} className={`info-chip chip-${variant}`}>
          {t}
        </span>
      ))}
    </div>
  )
}

// ── 卡片 ────────────────────────────────────────────────────────
function TrendingCard({ disease, onOpen }) {
  const cat = categoryMeta[disease.category]
  const alert = alertMeta[disease.alertLevel]
  return (
    <div
      className="trending-card"
      style={{ borderTop: `3px solid ${cat.color}` }}
      onClick={() => onOpen(disease)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(disease)}
    >
      <div className="trending-card-head">
        <span className="trending-icon">{disease.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="trending-name">{disease.name}</div>
          <div className="trending-en">{disease.englishName}</div>
        </div>
        <div className="trending-score" title="關注指數">
          <div className="trending-score-num">{disease.importanceScore}</div>
          <div className="trending-score-cap">關注指數</div>
        </div>
      </div>

      <div className="trending-badges">
        <span className="cat-badge" style={{ background: cat.bg, color: cat.color }}>
          {cat.label}
        </span>
        <span className="alert-badge" style={{ color: alert.color }}>
          ● {alert.label}
        </span>
      </div>

      <div className="trending-mini-radar">
        <RadarChart values={disease.radar} color={cat.color} size={132} showLabels={false} />
      </div>

      <div className="trending-meta-row">
        <div>
          <span className="meta-k">病例</span>
          <span className="meta-v">{disease.caseSummary}</span>
        </div>
        <div>
          <span className="meta-k">週變化</span>
          <span className="meta-v">{disease.weeklyChange}</span>
        </div>
      </div>

      <div className="trending-cta" style={{ color: cat.color }}>
        查看完整防護建議 →
      </div>
    </div>
  )
}

// ── 詳情 Modal（涵蓋 7 項功能）──────────────────────────────────
function TrendingModal({ disease, onClose }) {
  if (!disease) return null
  const cat = categoryMeta[disease.category]
  const alert = alertMeta[disease.alertLevel]

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal slide-up">
        <div className="modal-header">
          <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{disease.icon}</div>
          <div className="modal-header-info">
            <div className="modal-name">{disease.name}</div>
            <div className="modal-brand">{disease.englishName}</div>
            <div className="trending-badges" style={{ marginTop: '0.45rem' }}>
              <span className="cat-badge" style={{ background: cat.bg, color: cat.color }}>
                {cat.label}
              </span>
              <span className="alert-badge" style={{ color: alert.color }}>
                ● {alert.label}
              </span>
              <span className="alert-badge" style={{ color: '#64748b' }}>
                關注指數 {disease.importanceScore}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 為何上榜 */}
          <div className="reason-box" style={{ borderLeft: `3px solid ${cat.color}` }}>
            <div className="reason-title">📈 為何上榜</div>
            <p>{disease.attentionReason}</p>
            <p className="reason-summary">{disease.shortSummary}</p>
          </div>

          {/* 1. 區域風險雷達 */}
          <div className="disease-modal-section">
            <h4>📡 區域風險雷達</h4>
            <div className="radar-wrap">
              <RadarChart values={disease.radar} color={cat.color} size={240} />
              <div className="radar-metrics">
                {RADAR_AXES.map((axis, i) => (
                  <div key={axis} className="radar-metric">
                    <div className="radar-metric-top">
                      <span>{axis}</span>
                      <span style={{ color: cat.color, fontWeight: 700 }}>
                        {disease.radar[i]}
                      </span>
                    </div>
                    <div className="radar-bar">
                      <div
                        className="radar-bar-fill"
                        style={{ width: `${disease.radar[i]}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. 典型症狀 */}
          <div className="disease-modal-section">
            <h4>🤒 典型症狀</h4>
            <ChipRow items={disease.typicalSymptoms} variant="symptom" />
          </div>

          {/* 6. 傳染途徑 */}
          <div className="disease-modal-section">
            <h4>🦠 傳染途徑</h4>
            <ChipRow items={disease.transmissionRoutes} variant="route" />
          </div>

          {/* 4. 高風險族群 */}
          <div className="disease-modal-section">
            <h4>👥 高風險族群</h4>
            <ChipRow items={disease.riskGroups} variant="group" />
          </div>

          {/* 5. 高風險區域 */}
          <div className="disease-modal-section">
            <h4>📍 高風險區域</h4>
            <ChipRow items={disease.riskRegions} variant="region" />
          </div>

          {/* 2. 行為建議卡 */}
          <div className="disease-modal-section">
            <h4>🧭 行為建議卡</h4>
            <div className="action-card">
              <div className="action-icon">🏥</div>
              <div>
                <div className="action-title">就醫動線導航</div>
                <p>{disease.action.visit}</p>
              </div>
            </div>
            <div className="action-card">
              <div className="action-icon">😷</div>
              <div>
                <div className="action-title">口罩與防護指引</div>
                <p>{disease.action.mask}</p>
              </div>
            </div>
          </div>

          {/* 3. 社群擴散防護 */}
          <div className="household-alert">
            <div className="household-title">🏠 社群擴散防護 — 家庭成員風險聯動</div>
            <p>{disease.householdAlert}</p>
          </div>

          <div className="disclaimer-box">
            ⚕️ 本區塊整理自疾管署公開衛教資訊與媒體輿情，僅供風險認知參考，
            非個人診斷建議。出現疑似症狀請依指引就醫，緊急狀況請撥 119、防疫諮詢撥 1922。
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 主區塊 ──────────────────────────────────────────────────────
export default function TrendingPanel() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="trending-section">
      <div className="trending-section-head">
        <div className="section-tag">📡 流行疾病動態</div>
        <h3>本週公眾關注 × 醫學流行監測</h3>
        <p>
          以下為近期公眾討論度高、或醫學上定義為流行／群聚並於台灣具風險的疾病，
          依關注指數排序前 6 名。
        </p>
        <div className="trending-source">
          資料更新：{trendingMeta.asOfDate}（{trendingMeta.region}）｜來源：{trendingMeta.sources}
        </div>
      </div>

      <div className="trending-grid">
        {trendingDiseases.map((d) => (
          <TrendingCard key={d.id} disease={d} onOpen={setSelected} />
        ))}
      </div>

      {selected && <TrendingModal disease={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
