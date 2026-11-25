'use client'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { GripVertical } from 'lucide-react'
import { cx } from '@/lib/cx'
import { getDesign } from './registry'

// /d/<slug>?v=B — keys 1-9 / ← → switch variants, H hides the toolbar.
// The toolbar can be dragged anywhere by its grip (remembered for every design in localStorage);
// double-click the grip to put it back at the bottom center.
const STORE = 'pm-lab-toolbar-pos'
const read = () => {
  try { return JSON.parse(localStorage.getItem(STORE)) } catch { return null }
}
const save = (pos) => {
  try { pos ? localStorage.setItem(STORE, JSON.stringify(pos)) : localStorage.removeItem(STORE) } catch {}
}

export function DesignPage({ slug }) {
  const router = useRouter()
  const params = useSearchParams()
  const design = getDesign(slug)
  const [toolbar, setToolbar] = useState(true)
  const keys = design?.keys ?? []
  const v = params.get('v')
  const current = keys.includes(v) ? v : keys[0]

  const go = useCallback((k) => {
    const q = new URLSearchParams(params.toString())
    q.set('v', k)
    router.replace(`/d/${slug}?${q}`, { scroll: false })
  }, [params, router, slug])

  useEffect(() => {
    function onKey(e) {
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return
      const i = keys.indexOf(current)
      if (/^[1-9]$/.test(e.key) && keys[e.key - 1]) go(keys[e.key - 1])
      else if (e.key === 'ArrowRight') go(keys[(i + 1) % keys.length])
      else if (e.key === 'ArrowLeft') go(keys[(i - 1 + keys.length) % keys.length])
      else if (e.key.toLowerCase() === 'h') setToolbar((t) => !t)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keys, current, go])

  // Draggable toolbar
  const bar = useRef(null)
  const offset = useRef(null)
  const [pos, setPos] = useState(null)
  useEffect(() => setPos(read()), [])
  const clamp = useCallback(({ x, y }) => {
    const r = bar.current?.getBoundingClientRect()
    const w = r?.width ?? 0
    const h = r?.height ?? 0
    return { x: Math.min(Math.max(8, x), window.innerWidth - w - 8), y: Math.min(Math.max(8, y), window.innerHeight - h - 8) }
  }, [])
  function startDrag(e) {
    e.preventDefault()
    const r = bar.current.getBoundingClientRect()
    offset.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function drag(e) {
    if (offset.current) setPos(clamp({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }))
  }
  function endDrag() {
    if (!offset.current) return
    offset.current = null
    setPos((p) => (save(p), p))
  }
  function resetPos() {
    setPos(null)
    save(null)
  }
  // The bar's width changes with the design title / version label, so keep it on screen
  useLayoutEffect(() => setPos((p) => (p ? clamp(p) : p)), [slug, current, clamp])
  useEffect(() => {
    const keep = () => setPos((p) => (p ? clamp(p) : p))
    window.addEventListener('resize', keep)
    return () => window.removeEventListener('resize', keep)
  }, [clamp])

  if (!design) {
    return <div className="p-10 text-sm text-gray-500">Unknown design “{slug}”. <Link href="/" className="underline">All designs</Link></div>
  }
  const Variant = current && design.components[current]

  return (
    <>
      {Variant && <Variant key={current} />}

      {toolbar && (
        <div
          ref={bar}
          className={cx('fixed z-50 flex max-w-[calc(100vw-32px)] items-center gap-1 overflow-x-auto rounded-xl bg-gray-900 p-1.5 text-sm text-white shadow-xl', !pos && 'bottom-4 left-1/2 -translate-x-1/2')}
          style={pos ? { left: pos.x, top: pos.y } : undefined}
        >
          <span
            className="flex shrink-0 cursor-grab touch-none items-center self-stretch rounded-lg px-0.5 text-gray-500 hover:bg-gray-800 hover:text-white active:cursor-grabbing"
            title="Drag to move · double-click to reset"
            onPointerDown={startDrag}
            onPointerMove={drag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={resetPos}
          ><GripVertical size={16} /></span>
          <Link href="/" className="rounded-lg px-2.5 py-1.5 text-gray-400 hover:text-white" title="All designs">←</Link>
          <span className="hidden max-w-48 truncate px-2 font-semibold sm:inline" title={design.title}>{design.title}</span>
          {keys.map((k, i) => (
            <button
              key={k}
              type="button"
              className={cx('whitespace-nowrap rounded-lg px-3 py-1.5 font-semibold', k === current ? 'bg-brand text-gray-900' : 'text-gray-300 hover:bg-gray-800')}
              title={`${design.variants?.[k] ?? ''} (${i + 1})`}
              onClick={() => go(k)}
            >
              {k}{design.variants?.[k] && k === current && <span className="ml-1.5 hidden font-normal md:inline">{design.variants[k]}</span>}
            </button>
          ))}
          <span className="hidden whitespace-nowrap px-2 text-xs text-gray-400 lg:inline">1–9 · ← → · H hide</span>
        </div>
      )}
    </>
  )
}
