const q = '我頭痛又發燒，普拿疼跟布洛芬哪個比較適合？'
const res = await fetch('https://mediwise99.netlify.app/api/ask', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ question: q }),
})
const d = await res.json()
console.log('HTTP', res.status, '| answer length:', (d.answer ?? '').length)
console.log(d.answer ?? d.error)
