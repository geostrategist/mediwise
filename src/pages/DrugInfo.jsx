import { useState, useMemo } from 'react'
import { drugs, drugCategories, drugTags } from '../data/drugs'
import DrugModal from '../components/DrugModal'

export default function DrugInfo() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [tag, setTag] = useState('全部')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return drugs.filter(d => {
      const matchQuery =
        !query ||
        d.name.includes(query) ||
        d.brandName.toLowerCase().includes(query.toLowerCase()) ||
        d.tags.some(t => t.includes(query)) ||
        d.indications.some(i => i.includes(query))
      const matchCat = category === '全部' || d.category === category
      const matchTag = tag === '全部' || d.tags.includes(tag)
      return matchQuery && matchCat && matchTag
    })
  }, [query, category, tag])

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="section-tag">💊 藥品資訊</div>
          <h2>台灣常見用藥查詢</h2>
          <p>收錄 20 種常見藥品，點選任一藥品可查看詳細資訊</p>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="輸入藥品名稱、品牌名、症狀或藥品功效..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="filter-row">
          {drugCategories.map(c => (
            <button
              key={c}
              className={`filter-pill ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
          <span style={{ borderLeft: '1px solid #e2e8f0', margin: '0 0.25rem' }} />
          {drugTags.slice(0, 8).map(t => (
            <button
              key={t}
              className={`filter-pill ${tag === t ? 'active' : ''}`}
              onClick={() => setTag(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
          共找到 <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> 種藥品
          {(query || category !== '全部' || tag !== '全部') && (
            <button
              onClick={() => { setQuery(''); setCategory('全部'); setTag('全部') }}
              style={{
                marginLeft: '0.75rem',
                fontSize: '0.78rem',
                color: '#0d9488',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ✕ 清除篩選
            </button>
          )}
        </div>

        {/* Drug Grid */}
        {filtered.length > 0 ? (
          <div className="drug-grid">
            {filtered.map(drug => (
              <div
                key={drug.id}
                className="drug-card"
                onClick={() => setSelected(drug)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(drug)}
              >
                <div className="drug-card-icon" style={{ background: drug.color + '18' }}>
                  {drug.icon}
                </div>
                <div>
                  <div className="drug-card-name">{drug.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#0d9488', fontStyle: 'italic', marginTop: '0.1rem' }}>{drug.englishName}</div>
                  <div className="drug-card-brand">{drug.brandName}</div>
                </div>
                <div className="drug-card-tags">
                  {drug.tags.slice(0, 3).map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div className="drug-card-footer">
                  <span className={`category-badge badge-${drug.category}`}>
                    {drug.category}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: drug.color, fontWeight: 600 }}>
                    查看詳情 →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>找不到符合條件的藥品</h3>
            <p>試試其他關鍵字，或清除篩選條件</p>
          </div>
        )}

        {/* Disclaimer */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1rem 1.25rem',
            background: '#f8fafc',
            borderRadius: 'var(--radius)',
            border: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            color: '#64748b',
            lineHeight: 1.6,
          }}
        >
          📋 <strong>資料說明：</strong>
          本頁藥品資訊以教育為目的整理。台灣本土藥品均為指示藥或成藥；
          日本、美國進口藥品資訊以當地市售規格為準。
          實際使用前請詳閱藥品仿單，並諮詢醫師或藥師。
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <DrugModal drug={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
