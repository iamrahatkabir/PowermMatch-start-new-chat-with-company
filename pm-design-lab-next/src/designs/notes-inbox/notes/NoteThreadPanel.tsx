'use client'
// "Thread" side panel for a note: the note on top, "N replies", the replies (hover shows Reply, plus edit/delete on your own),
// and a Reply box at the bottom. Reply on a reply shows "Replying to …" above the box; the sent reply quotes it. Replaces the contact panel while open.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NotepadText, Pencil, Reply, Trash2, X } from 'lucide-react'
import { PmAvatar } from '@/ds'
import { cx } from '@/lib/cx'
import type { Agent, NoteReply, NoteReplyQuote } from '@/mock/inbox-types'
import { EditBox } from './EditBox'
import { MentionText } from './MentionText'
import { NoteComposer } from './NoteComposer'
import { withoutMentions } from './mentions'

type Props = {
  note: { text: string; mentions?: string[]; author?: string; authorPhoto?: string; time?: string }
  replies: NoteReply[]
  colleagues: Agent[]
  onClose: () => void
  /** quote = the reply being answered, if any */
  onSendReply: (text: string, mentions: string[], quote?: NoteReplyQuote) => void
  /** Change this number to focus the Reply box (e.g. when opened from a Reply link) */
  focusKey?: number
  /** Name of the signed-in agent: their own replies get edit + delete on hover */
  currentUser?: string
  onEditReply?: (id: string, text: string) => void
  onDeleteReply?: (id: string) => void
  /** Shown at the end of the note's author/time line (e.g. the note type badge). Replies have none. */
  noteMeta?: ReactNode
  /** Shown inside the note block at the bottom right (version B puts the type badge here) */
  noteCorner?: ReactNode
}

export function NoteThreadPanel({ note, replies, colleagues, onClose, onSendReply, focusKey, currentUser, onEditReply, onDeleteReply, noteMeta, noteCorner }: Props) {
  const [draft, setDraft] = useState('')
  const [quote, setQuote] = useState<NoteReplyQuote | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [focus, setFocus] = useState(focusKey)
  useEffect(() => setFocus(focusKey), [focusKey])
  const list = useRef<HTMLDivElement>(null)

  // New reply → scroll to the bottom
  const count = useRef(replies.length)
  useEffect(() => {
    if (replies.length > count.current) list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
    count.current = replies.length
  }, [replies.length])

  function replyTo(r: NoteReply) {
    setQuote({ replyId: r.id, author: r.author, text: withoutMentions(r.text, r.mentions) })
    setFocus((k) => (k ?? 0) + 1)
  }

  // Below xl it covers the screen (no room for a side column); from xl it is a 300px column
  return (
    <aside className="fixed inset-0 z-40 flex w-full flex-col bg-white xl:static xl:z-auto xl:w-[300px] xl:shrink-0 xl:border-l xl:border-gray-200">
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-4">
        <span className="text-base font-semibold text-gray-900">Thread</span>
        <button type="button" className="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title="Close thread" onClick={onClose}><X size={18} /></button>
      </div>

      <div ref={list} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="whitespace-pre-line rounded-2xl bg-brand-bg px-3 py-2.5 text-sm leading-6 text-gray-900 [overflow-wrap:anywhere]">
          <MentionText text={note.text} mentions={note.mentions} />
          {noteCorner && <div className="mt-1.5 flex justify-end whitespace-normal">{noteCorner}</div>}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-500">
          <NotepadText size={12} className="shrink-0" />
          {note.authorPhoto && <span className="shrink-0"><PmAvatar name={note.author} src={note.authorPhoto} size={14} /></span>}
          {/* Author • time gets cut with "…" so a long type badge never breaks */}
          <span className="min-w-0 truncate">{note.author} • {note.time}</span>
          {noteMeta && <span className="ml-auto shrink-0 pl-1">{noteMeta}</span>}
        </div>

        {replies.length === 0 && <p className="mt-6 text-center text-xs text-gray-500">No replies yet</p>}
        {replies.length > 0 && (
          <div className="my-4 flex items-center gap-2 text-[11px] text-gray-500">
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            <span className="h-px flex-1 bg-gray-200" />
          </div>
        )}

        <div className="flex flex-col gap-4">
          {replies.map((r) => {
            const mine = !!currentUser && r.author === currentUser
            const editing = editingId === r.id
            return (
            <div key={r.id} className="group relative flex gap-2.5">
              <PmAvatar name={r.author} src={r.authorPhoto} size={24} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-gray-900">
                  {r.author} <span className="text-gray-500">• {r.time}</span>
                </div>
                {r.quote && <Quote quote={r.quote} className="mt-1.5 bg-gray-50" />}
                {editing ? (
                  <div className="mt-1.5">
                    <EditBox initial={r.text} onCancel={() => setEditingId(null)} onSave={(t) => { onEditReply?.(r.id, t); setEditingId(null) }} />
                  </div>
                ) : (
                  <p className={cx(r.quote ? 'mt-2' : 'mt-0.5', 'whitespace-pre-line text-sm leading-6 text-gray-600 [overflow-wrap:anywhere]')}>
                    <MentionText text={r.text} mentions={r.mentions} />
                  </p>
                )}
              </div>
              {!editing && (
                <div className="absolute -top-2 right-0 hidden items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm group-hover:flex">
                  {mine && onEditReply && (
                    <button type="button" className="flex size-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700" title="Edit reply" onClick={() => setEditingId(r.id)}><Pencil size={13} /></button>
                  )}
                  {mine && onDeleteReply && (
                    <button type="button" className="flex size-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-error-500" title="Delete reply" onClick={() => onDeleteReply(r.id)}><Trash2 size={13} /></button>
                  )}
                  <button type="button" className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50" onClick={() => replyTo(r)}>
                    <Reply size={12} />Reply
                  </button>
                </div>
              )}
            </div>
            )
          })}
        </div>
      </div>

      <div className={cx('shrink-0 p-4', quote && 'border-t border-gray-200')}>
        {quote && (
          <div className="relative mb-3">
            <Quote quote={quote} label={`Replying to ${quote.author}`} className="bg-info-25 pr-7" />
            <button type="button" className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded text-gray-500 hover:bg-gray-100" title="Cancel reply" onClick={() => setQuote(null)}><X size={12} /></button>
          </div>
        )}
        <NoteComposer
          variant="reply"
          value={draft}
          onChange={setDraft}
          colleagues={colleagues}
          focusKey={focus}
          onSave={(text, mentions) => { onSendReply(text, mentions, quote ?? undefined); setDraft(''); setQuote(null) }}
        />
      </div>
    </aside>
  )
}

// Quoted reply: blue left line, blue name (or label), one line of text
function Quote({ quote, label, className }: { quote: NoteReplyQuote; label?: string; className?: string }) {
  return (
    <div className={cx('rounded-r-lg border-l-2 border-info-500 px-2.5 py-1.5 text-xs leading-5', className)}>
      <div className="truncate text-info-500">{label ?? quote.author}</div>
      <div className="truncate text-gray-700">{quote.text}</div>
    </div>
  )
}
