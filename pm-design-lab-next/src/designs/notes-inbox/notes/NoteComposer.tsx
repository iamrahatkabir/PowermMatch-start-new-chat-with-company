'use client'
// The Note tab's composer: light yellow writing area, "@" opens a colleague list,
// Save note (Enter also saves, Shift+Enter = new line).
import { useEffect, useRef, useState } from 'react'
import { AtSign, Link } from 'lucide-react'
import { PmAvatar, PmButton } from '@/ds'
import { cx } from '@/lib/cx'
import type { Agent } from '@/mock/inbox-types'
import { mentionQuery, mentionsIn } from './mentions'

type Props = {
  value: string
  onChange: (v: string) => void
  /** Called with the text and the colleagues mentioned in it */
  onSave: (text: string, mentions: string[]) => void
  colleagues: Agent[]
  disabled?: boolean
  /** Change this number to move focus into the text area (e.g. after Reply) */
  focusKey?: number
}

export function NoteComposer({ value, onChange, onSave, colleagues, disabled, focusKey }: Props) {
  const area = useRef<HTMLTextAreaElement>(null)
  const [cursor, setCursor] = useState(0)
  const [active, setActive] = useState(0)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (focusKey === undefined || !area.current) return
    area.current.focus()
    area.current.setSelectionRange(value.length, value.length)
    setCursor(value.length)
  }, [focusKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const q = closed ? null : mentionQuery(value, cursor)
  const matches = q ? colleagues.filter((c) => c.name.toLowerCase().includes(q.query.toLowerCase())).slice(0, 5) : []
  const canSave = !disabled && value.trim().length > 0

  function pick(c: Agent) {
    if (!q) return
    const next = `${value.slice(0, q.start)}@${c.name} ${value.slice(cursor)}`
    const pos = q.start + c.name.length + 2
    onChange(next)
    setCursor(pos)
    requestAnimationFrame(() => { area.current?.focus(); area.current?.setSelectionRange(pos, pos) })
  }

  function save() {
    if (!canSave) return
    onSave(value.trim(), mentionsIn(value, colleagues.map((c) => c.name)))
  }

  function insertAt() {
    const el = area.current
    const pos = el ? el.selectionStart : value.length
    const before = value.slice(0, pos)
    const add = before && !/\s$/.test(before) ? ' @' : '@'
    onChange(before + add + value.slice(pos))
    const next = pos + add.length
    setClosed(false)
    setCursor(next)
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(next, next) })
  }

  return (
    <div className="relative rounded-b-2xl bg-brand-bg">
      {matches.length > 0 && (
        <div className="absolute bottom-full left-3 z-10 mb-1 w-64 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
          {matches.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={cx('flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-900', i === active ? 'bg-gray-100' : 'hover:bg-gray-50')}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); pick(c) }}
            >
              <PmAvatar name={c.name} src={c.photo} size={24} />{c.name}
            </button>
          ))}
        </div>
      )}
      <textarea
        ref={area}
        value={value}
        rows={3}
        disabled={disabled}
        placeholder="Use @ to mention your colleagues on note"
        className="block w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 disabled:opacity-40"
        onChange={(e) => { onChange(e.target.value); setCursor(e.target.selectionStart); setActive(0); setClosed(false) }}
        onSelect={(e) => setCursor(e.currentTarget.selectionStart)}
        onKeyDown={(e) => {
          if (matches.length) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % matches.length); return }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + matches.length) % matches.length); return }
            if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(matches[active] ?? matches[0]); return }
            if (e.key === 'Escape') { e.preventDefault(); setClosed(true); return }
          }
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); save() }
        }}
      />
      <div className={cx('flex items-center gap-1 px-3 pb-3 text-gray-600', disabled && 'opacity-40')}>
        <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-brand-light" title="Mention a colleague" onClick={insertAt}><AtSign size={16} /></button>
        <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-brand-light" title="Insert link"><Link size={16} /></button>
        <PmButton size="sm" variant={canSave ? 'primary' : 'secondary'} disabled={!canSave} className="ml-auto" onClick={save}>Save note</PmButton>
      </div>
    </div>
  )
}
