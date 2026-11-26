'use client'
// Notes tab of the candidate profile: list of note cards (author, time, text, then a Reply link or a replies row:
// avatars · "5 replies" · "• Unread" (red) when you're @mentioned and haven't opened it; "N replies" and "Unread" both open the thread · "Last reply 14:31") and "Add a new note".
// Reuses MentionText + NoteComposer from the Notes in inbox design.
import { Reply } from 'lucide-react'
import { PmAvatar } from '@/ds'
import type { Agent } from '@/mock/inbox-types'
import type { ProfileNote } from '@/mock/notes'
import type { NoteReply } from '@/mock/inbox-types'
import { cx } from '@/lib/cx'
import { MentionText } from '@/designs/notes-inbox/notes/MentionText'
import { NoteComposer } from '@/designs/notes-inbox/notes/NoteComposer'

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
}

export function ProfileNotes({ notes, colleagues, draft, onDraftChange, onAddNote, onReply, onOpenReplies, openNoteId, focusKey }: Props) {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
      <div className="mt-3 flex flex-col gap-3">
        {notes.length === 0 && <p className="text-sm text-gray-500">No notes yet</p>}
        {notes.map((n) => (
          <div key={n.id} className={cx('rounded-xl border bg-white p-4', n.id === openNoteId ? 'border-gray-400' : 'border-gray-200')}>
            <div className="flex items-start gap-2.5">
              <PmAvatar name={n.author} src={n.authorPhoto} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                  <span className="min-w-0 truncate text-sm text-gray-900">{n.author}</span>
                  <span className="ml-auto shrink-0 text-xs text-gray-700">{n.time}</span>
                </div>
                <p className="mt-0.5 max-w-[480px] whitespace-pre-line text-xs leading-[18px] text-gray-600 [overflow-wrap:anywhere]">
                  <MentionText text={n.text} mentions={n.mentions} />
                </p>
              </div>
            </div>
            {n.replies?.length ? (
              <RepliesRow replies={n.replies} unread={n.unread} onOpen={() => onOpenReplies?.(n)} />
            ) : onReply && (
              <button type="button" className="mt-2 flex items-center gap-1 text-xs font-medium text-info-500 hover:text-info-700" onClick={() => onReply(n)}>
                <Reply size={13} />Reply
              </button>
            )}
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-gray-900">Add a new note</h2>
      <div className="mt-3">
        <NoteComposer
          variant="reply"
          placeholder="Use @ to mention your colleagues"
          value={draft}
          onChange={onDraftChange}
          colleagues={colleagues}
          focusKey={focusKey}
          onSave={onAddNote}
        />
      </div>
    </div>
  )
}

// Up to 2 repliers' photos (different people), "+N", count, red "• Unread", last reply time
function RepliesRow({ replies, unread, onOpen }: { replies: NoteReply[]; unread?: boolean; onOpen: () => void }) {
  const shown = replies.filter((r, i) => replies.findIndex((x) => x.author === r.author) === i).slice(0, 2)
  const more = replies.length - shown.length
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 whitespace-nowrap text-xs">
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
