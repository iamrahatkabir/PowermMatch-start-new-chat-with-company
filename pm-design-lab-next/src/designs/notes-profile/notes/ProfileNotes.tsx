'use client'
// Notes tab of the candidate profile: list of note cards (author, time, text, Reply) and "Add a new note".
// Reuses MentionText + NoteComposer from the Notes in inbox design.
import { Reply } from 'lucide-react'
import { PmAvatar } from '@/ds'
import type { Agent } from '@/mock/inbox-types'
import type { ProfileNote } from '@/mock/notes'
import { MentionText } from '@/designs/notes-inbox/notes/MentionText'
import { NoteComposer } from '@/designs/notes-inbox/notes/NoteComposer'

type Props = {
  notes: ProfileNote[]
  colleagues: Agent[]
  draft: string
  onDraftChange: (v: string) => void
  onAddNote: (text: string, mentions: string[]) => void
  onReply?: (note: ProfileNote) => void
  /** Change this number to focus the new-note box */
  focusKey?: number
}

export function ProfileNotes({ notes, colleagues, draft, onDraftChange, onAddNote, onReply, focusKey }: Props) {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
      <div className="mt-3 flex flex-col gap-3">
        {notes.length === 0 && <p className="text-sm text-gray-500">No notes yet</p>}
        {notes.map((n) => (
          <div key={n.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-2.5">
              <PmAvatar name={n.author} src={n.authorPhoto} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-sm text-gray-900">{n.author}</span>
                  <span className="ml-auto shrink-0 text-xs text-gray-700">{n.time}</span>
                </div>
                <p className="max-w-[480px] whitespace-pre-line text-xs leading-[18px] text-gray-600">
                  <MentionText text={n.text} mentions={n.mentions} />
                </p>
              </div>
            </div>
            {onReply && (
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
