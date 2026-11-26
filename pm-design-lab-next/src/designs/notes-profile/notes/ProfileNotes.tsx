'use client'
// Notes tab of the candidate profile: list of note cards (author, time, text, then a Reply link or a replies row:
// avatars · "5 replies" · "• Unread" (red) when you're @mentioned and haven't opened it; "N replies" and "Unread" both open the thread · "Last reply 14:31") and "Add a new note".
// Text shows 2 lines then "… See more". Note type badge via slots: headerBadge (next to the time) or cornerBadge
// (bottom right, on the replies / Reply row). composerTools + saveBlocked let a version add a type picker next to Send.
// Hover a note you wrote (canEdit) for edit + delete icons. Edit moves the text into the new-note box ("Save changes"),
// the card stays in place above a dark overlay together with the box; overlay click, X or Esc cancels.
// Reuses MentionText (via ClampedText), NoteComposer and EditingBar from the Notes in inbox design.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Pencil, Reply, Trash2 } from 'lucide-react'
import { PmAvatar } from '@/ds'
import type { Agent } from '@/mock/inbox-types'
import type { ProfileNote } from '@/mock/notes'
import type { NoteReply } from '@/mock/inbox-types'
import { cx } from '@/lib/cx'
import { ClampedText } from '@/designs/notes-inbox/notes/ClampedText'
import { NoteComposer } from '@/designs/notes-inbox/notes/NoteComposer'
import { EditingBar } from '@/designs/notes-inbox/notes/EditingBar'

type Props = {
  notes: ProfileNote[]
  colleagues: Agent[]
  draft: string
  onDraftChange: (v: string) => void
  onAddNote: (text: string, mentions: string[]) => void
  /** Reply link on a note without replies */
  onReply?: (note: ProfileNote) => void
  /** "N replies" on a note with replies */
  onOpenReplies?: (note: ProfileNote) => void
  /** Note whose thread is open (card gets a darker border) */
  openNoteId?: string | null
  /** Change this number to focus the new-note box */
  focusKey?: number
  /** Type badge in the card header, left of the time */
  headerBadge?: (note: ProfileNote) => ReactNode
  /** Type badge at the bottom right of the card */
  cornerBadge?: (note: ProfileNote) => ReactNode
  /** Extra controls next to Send (e.g. note type picker or chips) */
  composerTools?: ReactNode
  /** Keeps Send disabled (e.g. no type picked yet) */
  saveBlocked?: boolean
  saveBlockedHint?: string
  /** Whether the signed-in agent may edit / delete this note (its author) */
  canEdit?: (note: ProfileNote) => boolean
  /** Saves an edited note (mentions re-read from the text) */
  onEditNote?: (id: string, text: string, mentions: string[]) => void
  onDeleteNote?: (id: string) => void
}

export function ProfileNotes({ notes, colleagues, draft, onDraftChange, onAddNote, onReply, onOpenReplies, openNoteId, focusKey, headerBadge, cornerBadge, composerTools, saveBlocked, saveBlockedHint, canEdit, onEditNote, onDeleteNote }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editFocus, setEditFocus] = useState(0)
  const list = useRef<HTMLDivElement>(null)
  const cancelEdit = () => { setEditingId(null); setEditText('') }
  function startEdit(n: ProfileNote) {
    setEditingId(n.id)
    setEditText(n.text)
    setEditFocus((k) => k + 1)
  }
  // Bring the note being edited into view
  useEffect(() => {
    if (!editingId) return
    const t = setTimeout(() => list.current?.querySelector(`[data-note-id="${editingId}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 120)
    return () => clearTimeout(t)
  }, [editingId])

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
      <div ref={list} className="mt-3 flex flex-col gap-3">
        {notes.length === 0 && <p className="text-sm text-gray-500">No notes yet</p>}
        {notes.map((n) => (
          <div key={n.id} data-note-id={n.id} className={cx('group relative scroll-my-6 rounded-xl border bg-white p-4', n.id === openNoteId ? 'border-gray-400' : 'border-gray-200', n.id === editingId && 'pointer-events-none z-50')}>
            {!editingId && canEdit?.(n) && (onEditNote || onDeleteNote) && (
              <div className="absolute -top-3 right-3 hidden items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm group-hover:flex">
                {onEditNote && (
                  <button type="button" className="flex size-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700" title="Edit note" onClick={() => startEdit(n)}><Pencil size={13} /></button>
                )}
                {onDeleteNote && (
                  <button type="button" className="flex size-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-error-500" title="Delete note" onClick={() => onDeleteNote(n.id)}><Trash2 size={13} /></button>
                )}
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <PmAvatar name={n.author} src={n.authorPhoto} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="min-w-0 truncate text-sm text-gray-900">{n.author}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-2">
                    {headerBadge?.(n)}
                    <span className="whitespace-nowrap text-xs text-gray-700">{n.time}</span>
                  </span>
                </div>
                <div className="mt-0.5 max-w-[480px]">
                  <ClampedText text={n.text} mentions={n.mentions} linkSize="text-xs" className="whitespace-pre-line text-xs leading-[18px] text-gray-600 [overflow-wrap:anywhere]" />
                </div>
              </div>
            </div>
            {/* Bottom row: replies row or Reply on the left, corner badge on the right (never wraps) */}
            <div className="mt-2 flex items-end gap-3">
              <div className="min-w-0 flex-1">
                {n.replies?.length ? (
                  <RepliesRow replies={n.replies} unread={n.unread} onOpen={() => onOpenReplies?.(n)} />
                ) : onReply && (
                  <button type="button" className="flex items-center gap-1 text-xs font-medium text-info-500 hover:text-info-700" onClick={() => onReply(n)}>
                    <Reply size={13} />Reply
                  </button>
                )}
              </div>
              {cornerBadge && <div className="ml-auto shrink-0">{cornerBadge(n)}</div>}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-gray-900">Add a new note</h2>
      <div className="mt-3">
        {/* Edit mode: overlay (portaled to <body>) over everything except the note being edited and this box */}
        {editingId && createPortal(<div className="fixed inset-0 z-40 bg-gray-900/70" onClick={cancelEdit} />, document.body)}
        <div className={editingId ? 'relative z-50 overflow-hidden rounded-2xl bg-white' : undefined}>
        <NoteComposer
          variant="reply"
          placeholder="Use @ to mention your colleagues"
          value={editingId ? editText : draft}
          onChange={editingId ? setEditText : onDraftChange}
          colleagues={colleagues}
          focusKey={editingId ? editFocus : focusKey}
          header={editingId && <EditingBar onCancel={cancelEdit} />}
          saveLabel={editingId ? 'Save changes' : undefined}
          onEscape={editingId ? cancelEdit : undefined}
          tools={editingId ? undefined : composerTools}
          saveBlocked={!editingId && saveBlocked}
          saveBlockedHint={saveBlockedHint}
          onSave={(text, mentions) => {
            if (editingId) { onEditNote?.(editingId, text, mentions); cancelEdit(); return }
            onAddNote(text, mentions)
          }}
        />
        </div>
      </div>
    </div>
  )
}

// Up to 2 repliers' photos (different people), "+N", count, red "• Unread", last reply time
function RepliesRow({ replies, unread, onOpen }: { replies: NoteReply[]; unread?: boolean; onOpen: () => void }) {
  const shown = replies.filter((r, i) => replies.findIndex((x) => x.author === r.author) === i).slice(0, 2)
  const more = replies.length - shown.length
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 whitespace-nowrap text-xs">
      <div className="flex items-center gap-1">
        {shown.map((r) => <PmAvatar key={r.id} name={r.author} src={r.authorPhoto} size={16} />)}
        {more > 0 && <span className="flex size-4 items-center justify-center rounded-full border border-gray-200 bg-white text-[8px] font-medium text-gray-700">+{more}</span>}
      </div>
      <button type="button" className="ml-0.5 font-medium text-info-500 hover:text-info-700" onClick={onOpen}>
        {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
      </button>
      {unread && <button type="button" className="font-medium text-error-500 hover:text-error-700" onClick={onOpen}>• Unread</button>}
      <span className="text-gray-700">Last reply {replies[replies.length - 1].time.slice(-5)}</span>
    </div>
  )
}
