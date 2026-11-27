'use client'
// The Note tab's composer: light yellow writing area, typing "@" opens a scrollable list of agents above the @,
// Save note (Enter also saves, Shift+Enter = new line).
// variant 'reply' = the Thread panel's box: white, bordered, "Reply…", Send button.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Building2, Link, Paperclip, Send } from 'lucide-react'
import { PmAvatar, PmButton } from '@/ds'
import { cx } from '@/lib/cx'
import type { Agent, NoteTag } from '@/mock/inbox-types'
import { caretPosition, mentionQuery, mentionsIn, tagsIn } from './mentions'

// One row in the @ list
type Pickable = { key: string; name: string; photo?: string; group: string; company?: boolean }
const GROUP: Record<NoteTag['kind'], string> = { company: 'Companies', candidate: 'Candidates', applicant: 'Applicants' }

type Props = {
  value: string
  onChange: (v: string) => void
  /** Called with the text, the colleagues mentioned in it and the companies / candidates tagged in it */
  onSave: (text: string, mentions: string[], tags: NoteTag[]) => void
  colleagues: Agent[]
  /** Companies, candidates and applicants that can be tagged (same @ list, own groups) */
  entities?: NoteTag[]
  disabled?: boolean
  /** Change this number to move focus into the text area (e.g. after Reply) */
  focusKey?: number
  variant?: 'note' | 'reply'
  /** Overrides the default hint text */
  placeholder?: string
  /** Shown above the text area (e.g. the note type chips) */
  header?: ReactNode
  /** Extra controls left of the Save button (e.g. the note type picker) */
  tools?: ReactNode
  /** Keeps Save disabled (e.g. no note type chosen yet); saveBlockedHint is shown as its tooltip */
  saveBlocked?: boolean
  saveBlockedHint?: string
  /** Save button text (default "Save note" / "Send") */
  saveLabel?: string
  /** Esc pressed while no @ list is open (e.g. cancel editing) */
  onEscape?: () => void
}

export function NoteComposer({ value, onChange, onSave, colleagues, entities = [], disabled, focusKey, variant = 'note', placeholder, header, tools, saveBlocked, saveBlockedHint, saveLabel, onEscape }: Props) {
  const isReply = variant === 'reply'
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
  // @ list: colleagues, then companies, candidates and applicants (grouped)
  const all: Pickable[] = [
    ...colleagues.map((c) => ({ key: `a-${c.id}`, name: c.name, photo: c.photo, group: 'Colleagues' })),
    ...entities.map((e) => ({ key: `t-${e.id}`, name: e.name, photo: e.photo, group: GROUP[e.kind], company: e.kind === 'company' })),
  ]
  const found = q ? all.filter((c) => c.name.toLowerCase().includes(q.query.toLowerCase())) : []
  // With tagging on: one list, each category once (Colleagues, Companies, Candidates, Applicants), max 3 matches each
  const categorized = entities.length > 0
  const PER_GROUP = 3
  const matches = categorized
    ? ['Colleagues', 'Companies', 'Candidates', 'Applicants'].flatMap((g) => found.filter((c) => c.group === g).slice(0, PER_GROUP))
    : found
  const showList = q !== null && (categorized ? true : matches.length > 0)
  // The list opens just above the "@" being typed
  const anchor = q && area.current ? caretPosition(area.current, q.start) : null
  const list = useRef<HTMLDivElement>(null)
  useEffect(() => {
    list.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])
  const canSave = !disabled && !saveBlocked && value.trim().length > 0

  function pick(c: Pickable) {
    if (!q) return
    const next = `${value.slice(0, q.start)}@${c.name} ${value.slice(cursor)}`
    const pos = q.start + c.name.length + 2
    onChange(next)
    setCursor(pos)
    requestAnimationFrame(() => { area.current?.focus(); area.current?.setSelectionRange(pos, pos) })
  }

  function save() {
    if (!canSave) return
    onSave(value.trim(), mentionsIn(value, colleagues.map((c) => c.name)), tagsIn(value, entities))
  }

  return (
    <div className={cx('relative', isReply ? 'rounded-2xl border border-gray-200 bg-white' : 'rounded-b-2xl bg-brand-bg')}>
      {showList && (
        <div
          className={cx('absolute z-10 flex max-h-[300px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg', 'w-[260px]')}
          style={{ left: Math.max(8, Math.min(anchor?.left ?? 12, (area.current?.offsetWidth ?? 0) - 268)), bottom: `calc(100% - ${(anchor?.top ?? 0) + (area.current?.offsetTop ?? 0)}px + 4px)` }}
        >
          <div ref={list} className="min-h-0 overflow-y-auto p-1.5">
          {matches.length === 0 && <p className="px-2 py-2 text-sm text-gray-500">No one found</p>}
          {matches.map((c, i) => (
            <div key={c.key}>
              {categorized && (i === 0 || matches[i - 1].group !== c.group) && <div className="px-2 pb-1 pt-2 text-xs font-medium text-gray-500 first:pt-1">{c.group}</div>}
              <button
                type="button"
                data-idx={i}
                className={cx('flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-gray-900', i === active ? 'bg-gray-50' : 'hover:bg-gray-50')}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => { e.preventDefault(); pick(c) }}
              >
                {c.company
                  ? <span className="flex size-4 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-600"><Building2 size={11} /></span>
                  : <span className="shrink-0"><PmAvatar name={c.name} src={c.photo} size={16} /></span>}
                <span className="min-w-0 truncate">{c.name}</span>
              </button>
            </div>
          ))}
          </div>
        </div>
      )}
      {!categorized && q && q.query && matches.length === 0 && (
        <div
          className="absolute z-10 w-[216px] rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-500 shadow-lg"
          style={{ left: Math.max(8, Math.min(anchor?.left ?? 12, (area.current?.offsetWidth ?? 0) - 224)), bottom: `calc(100% - ${(anchor?.top ?? 0) + (area.current?.offsetTop ?? 0)}px + 4px)` }}
        >
          {entities.length ? 'No one found' : 'No colleague found'}
        </div>
      )}
      {header}
      <textarea
        ref={area}
        value={value}
        rows={isReply ? 4 : 3}
        disabled={disabled}
        placeholder={placeholder ?? (isReply ? 'Reply…' : 'Use @ to mention your colleagues on note')}
        className="block w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 disabled:opacity-40"
        onChange={(e) => { onChange(e.target.value); setCursor(e.target.selectionStart); setActive(0); setClosed(false) }}
        onSelect={(e) => setCursor(e.currentTarget.selectionStart)}
        onKeyDown={(e) => {
          if (showList && categorized && e.key === 'Escape') { e.preventDefault(); setClosed(true); return }
          if (matches.length) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % matches.length); return }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + matches.length) % matches.length); return }
            if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(matches[active] ?? matches[0]); return }
            if (e.key === 'Escape') { e.preventDefault(); setClosed(true); return }
          }
          if (e.key === 'Escape' && onEscape) { e.preventDefault(); onEscape(); return }
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); save() }
        }}
      />
      <div className={cx('flex items-center gap-1 px-3 pb-3 text-gray-600', disabled && 'opacity-40')}>
        <button type="button" className={cx('flex size-8 items-center justify-center rounded-lg', isReply ? 'hover:bg-gray-50' : 'hover:bg-brand-light')} title="Attach file"><Paperclip size={16} /></button>
        <button type="button" className={cx('flex size-8 items-center justify-center rounded-lg', isReply ? 'hover:bg-gray-50' : 'hover:bg-brand-light')} title="Insert link"><Link size={16} /></button>
        <div className="ml-auto flex min-w-0 items-center gap-2">{tools}</div>
        <span title={saveBlocked && value.trim() ? saveBlockedHint : undefined}>
        <PmButton size="sm" variant={canSave ? 'primary' : 'secondary'} disabled={!canSave} onClick={save}>{saveLabel ?? (isReply ? <>Send <Send size={14} /></> : 'Save note')}</PmButton>
        </span>
      </div>
    </div>
  )
}
