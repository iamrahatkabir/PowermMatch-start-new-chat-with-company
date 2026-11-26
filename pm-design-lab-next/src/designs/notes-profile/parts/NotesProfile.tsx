'use client'
// Prototype for every Notes in profile version: profile column, tabs, Notes tab and Thread panel with fake state.
// noteTypes (same as Notes in inbox): 'ai' (A: AI sets the type after posting, badge next to the time),
// 'ai-top' (B: same, badge at the bottom right of the card), 'manual' (C: dropdown next to Send),
// 'chips' (D: four chips next to Send). Only the note's author can change the type from the badge.
import { useState } from 'react'
import { cx } from '@/lib/cx'
import { agents, noteColleagues, profileCandidate, profileNotes } from '@/mock'
import type { NoteType, ProfileNote } from '@/mock'
import { CandidateProfile } from '../profile/CandidateProfile'
import { ProfileNotes } from '../notes/ProfileNotes'
import { profileNoteTime } from '../notes/time'
import { NoteThreadPanel } from '@/designs/notes-inbox/notes/NoteThreadPanel'
import { mentionsIn, noteTime } from '@/designs/notes-inbox/notes/mentions'
import { NoteTypeTag } from '@/designs/notes-inbox/notes/NoteTypeTag'
import { NoteTypePicker } from '@/designs/notes-inbox/notes/NoteTypePicker'
import { NoteTypeChips } from '@/designs/notes-inbox/notes/NoteTypeChips'
import { guessNoteType, type NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'

const me = agents.find((a) => a.id === 'ls')!
const tabs = [
  { key: 'details', label: 'Profile details' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'notes', label: 'Notes' },
]
let noteId = 0
let replyId = 0

type Props = { noteTypes: NoteTypeMode }

export function NotesProfile({ noteTypes }: Props) {
  const [tab, setTab] = useState('notes')
  const [notes, setNotes] = useState<ProfileNote[]>(profileNotes)
  const [draft, setDraft] = useState('')
  const [draftType, setDraftType] = useState<NoteType | null>(null) // C, D: type picked before sending
  const ai = noteTypes === 'ai' || noteTypes === 'ai-top'
  const picks = noteTypes === 'manual' || noteTypes === 'chips'
  const [focusKey, setFocusKey] = useState<number | undefined>(undefined)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [threadFocus, setThreadFocus] = useState(0)
  const thread = notes.find((n) => n.id === threadId)

  const patch = (id: string, fn: (n: ProfileNote) => ProfileNote) => setNotes((ns) => ns.map((n) => (n.id === id ? fn(n) : n)))
  // Opening the thread marks it read
  // Type badge; only the note's author can change it (e.g. to fix an AI mistake)
  const typeBadge = (n: ProfileNote) => (
    <NoteTypeTag
      type={n.noteType}
      detecting={ai && n.noteTypeBy === 'ai' && !n.noteType}
      onChange={n.author !== me.name ? undefined : (t) => patch(n.id, (x) => ({ ...x, noteType: t, noteTypeBy: 'agent' }))}
    />
  )

  function openThread(n: ProfileNote, focus: boolean) {
    setThreadId(n.id)
    patch(n.id, (x) => ({ ...x, unread: false }))
    if (focus) setThreadFocus((k) => k + 1)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:h-screen">
      <header className="flex h-16 shrink-0 items-center bg-brand px-8">
        <img src="/brand/logo-mark.svg" alt="PowerMatch" className="h-6 w-auto brightness-0" />
      </header>
      {/* Phones: one page scroll, profile then notes. lg+: the columns scroll on their own */}
      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        <aside className="shrink-0 border-b border-gray-200 bg-white lg:w-[480px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <CandidateProfile candidate={profileCandidate} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-10 lg:overflow-y-auto">
          <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={cx('-mb-px shrink-0 whitespace-nowrap border-b-2 px-2 pb-3 text-base', t.key === tab ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900')}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="pt-10">
            {tab === 'notes' ? (
              <ProfileNotes
                notes={notes}
                colleagues={noteColleagues}
                draft={draft}
                onDraftChange={setDraft}
                focusKey={focusKey}
                openNoteId={threadId}
                onReply={(n) => openThread(n, true)}
                onOpenReplies={(n) => openThread(n, false)}
                headerBadge={noteTypes !== 'ai-top' ? typeBadge : undefined}
                cornerBadge={noteTypes === 'ai-top' ? typeBadge : undefined}
                composerTools={
                  noteTypes === 'manual' ? <NoteTypePicker value={draftType} onChange={setDraftType} />
                  : noteTypes === 'chips' ? <NoteTypeChips value={draftType} onChange={setDraftType} />
                  : undefined
                }
                saveBlocked={picks && !draftType}
                saveBlockedHint="Choose a note type first"
                canEdit={(n) => n.author === me.name}
                onEditNote={(id, text, mentions) => patch(id, (x) => ({ ...x, text, mentions }))}
                onDeleteNote={(id) => { setNotes((ns) => ns.filter((x) => x.id !== id)); if (threadId === id) setThreadId(null) }}
                onAddNote={(text, mentions) => {
                  const id = `new-${++noteId}`
                  const base = { id, author: me.name, authorPhoto: me.photo, time: profileNoteTime(), text, mentions }
                  if (picks) setNotes((ns) => [...ns, { ...base, noteType: draftType, noteTypeBy: 'agent' }])
                  else {
                    setNotes((ns) => [...ns, { ...base, noteType: null, noteTypeBy: 'ai' }])
                    // Fake AI: the type appears a moment after posting
                    setTimeout(() => patch(id, (x) => (x.noteType ? x : { ...x, noteType: guessNoteType(text) })), 1500)
                  }
                  setDraft('')
                  setDraftType(null)
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">Not part of this design</p>
            )}
          </div>
        </main>
        {thread && (
          <NoteThreadPanel
            key={thread.id}
            note={thread}
            replies={thread.replies ?? []}
            colleagues={noteColleagues}
            currentUser={me.name}
            noteMeta={noteTypes !== 'ai-top' ? typeBadge(thread) : undefined}
            noteCorner={noteTypes === 'ai-top' ? typeBadge(thread) : undefined}
            focusKey={threadFocus}
            onClose={() => setThreadId(null)}
            onSendReply={(text, mentions, quote) => patch(thread.id, (n) => ({
              ...n,
              replies: [...(n.replies ?? []), { id: `pr-${++replyId}`, author: me.name, authorPhoto: me.photo, time: noteTime(), text, mentions, quote }],
            }))}
            onEditReply={(id, text) => patch(thread.id, (n) => ({ ...n, replies: n.replies?.map((r) => (r.id === id ? { ...r, text, mentions: mentionsIn(text, noteColleagues.map((c) => c.name)) } : r)) }))}
            onDeleteReply={(id) => patch(thread.id, (n) => ({ ...n, replies: n.replies?.filter((r) => r.id !== id) }))}
          />
        )}
      </div>
    </div>
  )
}
