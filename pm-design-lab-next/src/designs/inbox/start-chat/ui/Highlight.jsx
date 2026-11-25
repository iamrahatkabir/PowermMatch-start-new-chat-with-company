import { Fragment } from 'react'

// Highlights the search query inside text.
export function Highlight({ text = '', query = '' }) {
  const parts = (() => {
    const q = query.trim()
    if (!q) return [{ t: text }]
    const i = text.toLowerCase().indexOf(q.toLowerCase())
    if (i < 0) return [{ t: text }]
    return [{ t: text.slice(0, i) }, { t: text.slice(i, i + q.length), hit: true }, { t: text.slice(i + q.length) }]
  })()
  return (
    <span>{parts.map((p, i) => <Fragment key={i}>{p.hit ? <mark className="rounded-sm bg-brand-light text-inherit">{p.t}</mark> : p.t}</Fragment>)}</span>
  )
}
