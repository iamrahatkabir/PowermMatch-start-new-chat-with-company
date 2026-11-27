'use client'
// Notes tab of the candidate profile: list of note cards (author, time, text, then a Reply link or a replies row:
// avatars · "5 replies" · "• Unread" (red) when you're @mentioned and haven't opened it; "N replies" and "Unread" both open the thread · "Last reply 14:31") and "Add a new note".
// Text shows 2 lines then "… See more". Note type badge via slots: headerBadge (next to the time) or cornerBadge
// (bottom right, on the replies / Reply row). composerTools + saveBlocked let a version add a type picker next to Send.
// Hover a note you wrote (canEdit) for edit + delete icons. Edit moves the text into the new-note box ("Save changes"),
// the card stays in place above a dark overlay together with the box; overlay click, X or Esc cancels.
// Paging: pass one page of notes and a footer (the pager). Active / Archived tabs right of the title (view + onViewChange);
// hover toolbar: Pin + Archive for anyone, Edit + Delete for the author; pinned notes show "Pinned". Archived hides the new-note box.
// Reuses MentionText (via ClampedText), NoteComposer and EditingBar from the Notes in inbox design.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Archive, ArchiveRestore, ArrowUpRight, Pencil, Pin, PinOff, Reply, Tag, Trash2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PmAvatar } from '@/ds'
import type { Agent, NoteTag } from '@/mock/inbox-types'
import type { ProfileNote } from '@/mock/notes'
import type { NoteReply } from '@/mock/inbox-types'
import { cx } from '@/lib/cx'
import { ClampedText } from '@/designs/notes-inbox/notes/ClampedText'
import { NoteComposer } from '@/designs/notes-inbox/notes/NoteComposer'
import { EditingBar } from '@/designs/notes-inbox/notes/EditingBar'

type Props = {
  notes: ProfileNote[]
  colleagues: Agent[]
  /** Companies / candidates / applicants that can be tagged with @ (grouped in the same @ list as colleagues) */
  entities?: NoteTag[]
  /** Tagged names in a note that are links (name → open that profile) */
  noteLinks?: (note: ProfileNote) => Record<string, () => void>
  /** "Go to note" on a note tagged from another profile */
  onGoToOrigin?: (note: ProfileNote) => void
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
  /** Shown under the list, e.g. the pager */
  footer?: ReactNode
  /** Which list is shown: Active (with the new-note box) or Archived. Tabs sit right of the "Notes" title. */
  view?: NotesView
  onViewChange?: (v: NotesView) => void
  /** Pin / unpin (Active only; pinned notes come first). Anyone can pin. */
  onTogglePin?: (id: string) => void
  /** Archive (Active) / restore (Archived). Anyone can archive. */
  onToggleArchive?: (id: string) => void
  /** Shown under the title row, e.g. the filter bar */
  filters?: ReactNode
  /** Empty-list text (e.g. "No notes match these filters") and an optional action under it */
  emptyText?: string
  emptyAction?: ReactNode
}

export type NotesView = 'active' | 'archived'

const toolBtn = 'flex size-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700'

export function ProfileNotes({ notes, colleagues, entities, noteLinks, onGoToOrigin, draft, onDraftChange, onAddNote, onReply, onOpenReplies, openNoteId, focusKey, headerBadge, cornerBadge, composerTools, saveBlocked, saveBlockedHint, canEdit, onEditNote, onDeleteNote, footer, view = 'active', onViewChange, onTogglePin, onToggleArchive, filters, emptyText, emptyAction }: Props) {
  const archivedView = view === 'archived'
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
      {/* Filters on the left, Active / Archived tabs on the right, same row */}
      <div className="mt-3 flex items-start gap-4">
        <div className="min-w-0 flex-1">{filters}</div>
        {onViewChange && (
          <Tabs value={view} onValueChange={(v) => onViewChange(v === 'archived' ? 'archived' : 'active')} className="shrink-0">
            <TabsList className="bg-gray-100 group-data-horizontal/tabs:h-9">
              <TabsTrigger value="active" className="px-3 text-xs text-gray-600 data-active:text-gray-900 data-active:shadow-xs">Active</TabsTrigger>
              <TabsTrigger value="archived" className="px-3 text-xs text-gray-600 data-active:text-gray-900 data-active:shadow-xs">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      <div ref={list} className="mt-3 flex flex-col gap-3">
        {notes.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center">
            <p className="text-sm text-gray-500">{emptyText ?? (archivedView ? 'No archived notes' : 'No notes yet')}</p>
            {emptyAction}
          </div>
        )}
        {notes.map((n) => (
          <div key={n.id} data-note-id={n.id} className={cx('group relative scroll-my-6 rounded-xl border bg-white p-4', n.id === openNoteId ? 'border-gray-400' : 'border-gray-200', n.id === editingId && 'pointer-events-none z-50')}>
            {/* Hover toolbar: pin + archive for anyone; edit + delete for the author. Archived: restore (+ delete). */}
            {!editingId && (
              <div className="absolute -top-3 right-3 hidden items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm group-hover:flex">
                {!archivedView && onTogglePin && (
                  <button type="button" className={toolBtn} title={n.pinned ? 'Unpin' : 'Pin'} onClick={() => onTogglePin(n.id)}>{n.pinned ? <PinOff size={13} /> : <Pin size={13} />}</button>
                )}
                {onToggleArchive && (
                  <button type="button" className={toolBtn} title={archivedView ? 'Restore' : 'Archive'} onClick={() => onToggleArchive(n.id)}>{archivedView ? <ArchiveRestore size={13} /> : <Archive size={13} />}</button>
                )}
                {!archivedView && onEditNote && canEdit?.(n) && (
                  <button type="button" className={toolBtn} title="Edit note" onClick={() => startEdit(n)}><Pencil size={13} /></button>
                )}
                {onDeleteNote && canEdit?.(n) && (
                  <button type="button" className={cx(toolBtn, 'hover:text-error-500')} title="Delete note" onClick={() => onDeleteNote(n.id)}><Trash2 size={13} /></button>
                )}
              </div>
            )}
            {/* Written on another profile that tagged this one */}
            {n.taggedFrom && (
              <div className="mb-2 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                <Tag size={12} className="shrink-0" />
                <span className="min-w-0 truncate">Tagged from {n.taggedFrom.name}</span>
                {onGoToOrigin && (
                  <button type="button" className="flex shrink-0 items-center gap-0.5 whitespace-nowrap font-medium text-info-500 hover:text-info-700" onClick={() => onGoToOrigin(n)}>
                    Go to note<ArrowUpRight size={12} />
                  </button>
                )}
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <PmAvatar name={n.author} src={n.authorPhoto} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="min-w-0 truncate text-sm text-gray-900">{n.author}</span>
                  {n.pinned && !archivedView && (
                    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-gray-500"><Pin size={12} className="fill-gray-500" />Pinned</span>
                  )}
                  <span className="ml-auto flex shrink-0 items-center gap-2">
                    {headerBadge?.(n)}
                    <span className="whitespace-nowrap text-xs text-gray-700">{n.time}</span>
                  </span>
                </div>
                <div className="mt-0.5 max-w-[480px]">
                  <ClampedText text={n.text} mentions={[...(n.mentions ?? []), ...(n.tags ?? []).map((t) => t.name)]} links={noteLinks?.(n)} linkSize="text-xs" className="whitespace-pre-line text-xs leading-[18px] text-gray-700 [overflow-wrap:anywhere]" />
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

      {footer && <div className="mt-4">{footer}</div>}

      {!archivedView && (<>
      <h2 className="mt-10 text-lg font-semibold text-gray-900">Add a new note</h2>
      <div className="mt-3">
        {/* Edit mode: overlay (portaled to <body>) over everything except the note being edited and this box */}
        {editingId && createPortal(<div className="fixed inset-0 z-40 bg-gray-900/70" onClick={cancelEdit} />, document.body)}
        <div className={editingId ? 'relative z-50 overflow-hidden rounded-2xl bg-white' : undefined}>
        <NoteComposer
          variant="reply"
          placeholder={entities?.length ? 'Use @ to mention colleagues or tag a company / candidate' : 'Use @ to mention your colleagues'}
          value={editingId ? editText : draft}
          onChange={editingId ? setEditText : onDraftChange}
          colleagues={colleagues}
          entities={entities}
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
      </>)}
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
      {/* One button: "5 replies • Unread" (both parts darken together on hover) */}
      <button type="button" className="group/replies ml-0.5 flex items-center gap-1.5 whitespace-nowrap font-medium" onClick={onOpen}>
        <span className="text-info-500 group-hover/replies:text-info-700">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
        {unread && <span className="text-error-500 group-hover/replies:text-error-700">• Unread</span>}
      </button>
      <span className="text-gray-700">Last reply {replies[replies.length - 1].time.slice(-5)}</span>
    </div>
  )
}
