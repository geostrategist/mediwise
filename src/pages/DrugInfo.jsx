import { useState, useMemo, useEffect, useRef } from 'react'
import { drugs, drugCategories, drugTags } from '../data/drugs'
import DrugModal from '../components/DrugModal'
import TfdaDrugModal from '../components/TfdaDrugModal'
import NhiDrugModal from '../components/NhiDrugModal'

const TFDA_PAGE_SIZE = 60
const NHI_PAGE_SIZE = 60

// 將使用者選的照片在瀏覽器端縮圖+壓縮，避免上傳數 MB 的原始相片。
function fileToCompressedBase64(file, maxDim = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality).replace(/^data:image\/jpeg;base64,/, ''))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('無法讀取這張圖片')) }
    img.src = url
  })
}

function CuratedDrugsTab() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [tag, setTag] = useState('全部')
  const [selected, setSelected] = useState(null)
  const [identifying, setIdentifying] = useState(false)
  const [identifyMsg, setIdentifyMsg] = useState(null)
  const fileInputRef = useRef(null)

  async function handlePhoto(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // 允許重新選同一張
    if (!file) return
    setIdentifyMsg(null)
    setIdentifying(true)
    try {
      const image = await fileToCompressedBase64(file)
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ image, mimeType: 'image/jpeg' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      if (data.drugId) {
        const drug = drugs.find(d => d.id === data.drugId)
        setSelected(drug)
        setIdentifyMsg({ type: 'success', text: `已辨識為「${drug.name}」（把握度：${data.confidence}）—— 已為你開啟詳情。` })
      } else {
        setIdentifyMsg({ type: 'nomatch', text: data.reason || '無法從照片辨識出精選 20 種中的藥品，請改用文字搜尋。' })
      }
    } catch (err) {
      setIdentifyMsg({ type: 'error', text: `辨識失敗：${String(err.message ?? err)}` })
    } finally {
      setIdentifying(false)
    }
  }

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
    <>
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'stretch', marginBottom: '1rem' }}>
        <div className="search-wrapper" style={{ flex: 1, marginBottom: 0 }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="輸入藥品名稱、品牌名、症狀或藥品功效..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-teal"
          onClick={() => fileInputRef.current?.click()}
          disabled={identifying}
          style={{ flexShrink: 0, opacity: identifying ? 0.65 : 1 }}
        >
          {identifying ? '⏳ 辨識中…' : '📷 用相片辨識'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhoto}
          style={{ display: 'none' }}
        />
      </div>

      {identifyMsg && (
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'flex-start',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.83rem',
            lineHeight: 1.55,
            background: identifyMsg.type === 'success' ? '#f0fdfa' : identifyMsg.type === 'error' ? '#fef2f2' : '#fffbeb',
            border: `1px solid ${identifyMsg.type === 'success' ? '#99f6e4' : identifyMsg.type === 'error' ? '#fecaca' : '#fde68a'}`,
            color: identifyMsg.type === 'success' ? '#0f766e' : identifyMsg.type === 'error' ? '#991b1b' : '#92400e',
          }}
        >
          <span style={{ flexShrink: 0 }}>
            {identifyMsg.type === 'success' ? '✅' : identifyMsg.type === 'error' ? '⚠️' : '🔍'}
          </span>
          <span style={{ flex: 1 }}>{identifyMsg.text}</span>
          <button
            onClick={() => setIdentifyMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '0.9rem', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      )}

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

      {selected && <DrugModal drug={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function TfdaDrugsTab() {
  const [allDrugs, setAllDrugs] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [visible, setVisible] = useState(TFDA_PAGE_SIZE)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/tfda-drugs.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setAllDrugs)
      .catch(err => setLoadError(String(err.message ?? err)))
  }, [])

  const filtered = useMemo(() => {
    if (!allDrugs) return []
    const q = query.trim().toLowerCase()
    return allDrugs.filter(d => {
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.englishName?.toLowerCase().includes(q) ||
        d.ingredient?.toLowerCase().includes(q) ||
        d.indications?.toLowerCase().includes(q) ||
        d.license?.toLowerCase().includes(q)
      const matchC = category === '全部' || d.category === category
      return matchQ && matchC
    })
  }, [allDrugs, query, category])

  useEffect(() => { setVisible(TFDA_PAGE_SIZE) }, [query, category])

  const pageDrugs = filtered.slice(0, visible)

  if (loadError) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <h3>無法載入食藥署資料</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{loadError}</p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          請先執行 <code>npm run import-tfda</code> 產生 public/tfda-drugs.json
        </p>
      </div>
    )
  }

  if (!allDrugs) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <h3>載入中...</h3>
        <p>正在載入食藥署 2,188 筆藥品資料</p>
      </div>
    )
  }

  const categories = ['全部', '醫師藥師藥劑生指示藥品', '成藥', '乙類成藥']

  return (
    <>
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="輸入中文/英文藥名、主成分、適應症、許可證字號..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        {categories.map(c => (
          <button
            key={c}
            className={`filter-pill ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
        共找到 <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> 種藥品
        {pageDrugs.length < filtered.length && (
          <span style={{ color: '#94a3b8' }}>（顯示前 {pageDrugs.length} 筆）</span>
        )}
        {(query || category !== '全部') && (
          <button
            onClick={() => { setQuery(''); setCategory('全部') }}
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

      {pageDrugs.length > 0 ? (
        <>
          <div className="drug-grid">
            {pageDrugs.map(drug => (
              <div
                key={drug.id}
                className="drug-card"
                onClick={() => setSelected(drug)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(drug)}
                style={{ borderColor: '#fde68a' }}
              >
                <div className="drug-card-icon" style={{ background: '#fef3c7' }}>
                  📋
                </div>
                <div>
                  <div className="drug-card-name" style={{ fontSize: '0.95rem' }}>{drug.name}</div>
                  {drug.englishName && (
                    <div style={{ fontSize: '0.72rem', color: '#92400e', fontStyle: 'italic', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {drug.englishName}
                    </div>
                  )}
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>{drug.license}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, marginTop: '0.3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {drug.indications || '(無適應症資訊)'}
                </div>
                <div className="drug-card-footer">
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 600,
                    }}
                  >
                    {drug.category === '醫師藥師藥劑生指示藥品' ? '指示藥' : drug.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
                    查看詳情 →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {pageDrugs.length < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => setVisible(v => v + TFDA_PAGE_SIZE)}
                className="btn btn-outline"
              >
                顯示更多（還有 {filtered.length - pageDrugs.length} 筆）
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>找不到符合條件的藥品</h3>
          <p>試試其他關鍵字，或清除篩選條件</p>
        </div>
      )}

      {selected && <TfdaDrugModal drug={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function NhiDrugsTab() {
  const [allDrugs, setAllDrugs] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const [visible, setVisible] = useState(NHI_PAGE_SIZE)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('/nhi-drugs.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setAllDrugs)
      .catch(err => setLoadError(String(err.message ?? err)))
  }, [])

  const filtered = useMemo(() => {
    if (!allDrugs) return []
    const q = query.trim().toLowerCase()
    return allDrugs.filter(d => {
      const matchQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.englishName?.toLowerCase().includes(q) ||
        d.ingredient?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q) ||
        d.atc?.toLowerCase().includes(q) ||
        d.groupName?.toLowerCase().includes(q)
      const matchC = category === '全部' || d.category === category
      return matchQ && matchC
    })
  }, [allDrugs, query, category])

  useEffect(() => { setVisible(NHI_PAGE_SIZE) }, [query, category])

  const pageDrugs = filtered.slice(0, visible)

  if (loadError) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <h3>無法載入健保用藥資料</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{loadError}</p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          請先執行 <code>npm run import-nhi</code> 產生 public/nhi-drugs.json
        </p>
      </div>
    )
  }

  if (!allDrugs) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⏳</div>
        <h3>載入中...</h3>
        <p>正在載入健保署 3,348 筆有給付規定的藥品資料</p>
      </div>
    )
  }

  const categories = ['全部', '一般學名藥', 'BA/BE學名藥', '研發廠', '生物相似性藥品', '生物製劑']

  return (
    <>
      <div
        style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          fontSize: '0.82rem',
          color: '#1e3a8a',
          lineHeight: 1.6,
          display: 'flex',
          gap: '0.75rem',
        }}
      >
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💡</span>
        <span>
          <strong>關於本資料庫：</strong>
          這 3,348 筆健保有特殊給付規定的藥品，<strong>多為處方藥</strong>，民眾不可自行購買。
          這個查詢主要用途是了解你拿到的藥單上的藥品健保價、給付條件、ATC 分類等資訊。
        </span>
      </div>

      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="輸入中文/英文藥名、成分、健保代號、ATC 代碼..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        {categories.map(c => (
          <button
            key={c}
            className={`filter-pill ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
        共找到 <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> 種藥品
        {pageDrugs.length < filtered.length && (
          <span style={{ color: '#94a3b8' }}>（顯示前 {pageDrugs.length} 筆）</span>
        )}
        {(query || category !== '全部') && (
          <button
            onClick={() => { setQuery(''); setCategory('全部') }}
            style={{ marginLeft: '0.75rem', fontSize: '0.78rem', color: '#0d9488', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ✕ 清除篩選
          </button>
        )}
      </div>

      {pageDrugs.length > 0 ? (
        <>
          <div className="drug-grid">
            {pageDrugs.map(drug => (
              <div
                key={drug.id}
                className="drug-card"
                onClick={() => setSelected(drug)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelected(drug)}
                style={{ borderColor: '#bfdbfe' }}
              >
                <div className="drug-card-icon" style={{ background: '#dbeafe' }}>🏥</div>
                <div>
                  <div className="drug-card-name" style={{ fontSize: '0.95rem' }}>{drug.name}</div>
                  {drug.englishName && (
                    <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontStyle: 'italic', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {drug.englishName}
                    </div>
                  )}
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>代號 {drug.code}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 700, marginTop: '0.3rem' }}>
                  💰 NT$ {drug.price || '—'}
                  {drug.spec && <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '0.4rem', fontSize: '0.75rem' }}>/ {drug.spec}</span>}
                </div>
                <div className="drug-card-footer">
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
                    {drug.category || '未分類'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 600 }}>
                    查看詳情 →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {pageDrugs.length < filtered.length && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button onClick={() => setVisible(v => v + NHI_PAGE_SIZE)} className="btn btn-outline">
                顯示更多（還有 {filtered.length - pageDrugs.length} 筆）
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>找不到符合條件的藥品</h3>
          <p>試試其他關鍵字，或清除篩選條件</p>
        </div>
      )}

      {selected && <NhiDrugModal drug={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

export default function DrugInfo() {
  const [tab, setTab] = useState('curated')

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div className="section-tag">💊 藥品資訊</div>
          <h2>台灣常見用藥查詢</h2>
          <p>精選 20 種（深度資訊）+ 食藥署 2,188 種 OTC + 健保 3,348 種給付藥品</p>
        </div>

        <div className="tab-list" style={{ marginBottom: '1.5rem' }}>
          <button className={`tab-btn ${tab === 'curated' ? 'active' : ''}`} onClick={() => setTab('curated')}>
            💊 精選 20 種
          </button>
          <button className={`tab-btn ${tab === 'tfda' ? 'active' : ''}`} onClick={() => setTab('tfda')}>
            📋 食藥署 OTC 2,188 種
          </button>
          <button className={`tab-btn ${tab === 'nhi' ? 'active' : ''}`} onClick={() => setTab('nhi')}>
            🏥 健保用藥 3,348 種
          </button>
        </div>

        {tab === 'curated' ? <CuratedDrugsTab /> : tab === 'tfda' ? <TfdaDrugsTab /> : <NhiDrugsTab />}

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
          「精選 20 種」為本站整理，含機轉、副作用、警語等完整衛教資訊。
          「食藥署 2,188 種」資料來源為食藥署「全部藥品許可證資料集」（依主成分去重）。
          「健保用藥 3,348 種」為健保署「健保用藥品項查詢項目檔」中，目前有效期內且具特殊給付規定者。
          實際使用前請詳閱藥品仿單，並諮詢醫師或藥師。
        </div>
      </div>
    </div>
  )
}
