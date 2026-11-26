'use client'
// Notes in profile — version A preview. The UI lives in profile/CandidateProfile.tsx (left column)
// and notes/ProfileNotes.tsx (Notes tab); this file holds the fake state.
import { useState } from 'react'
import { cx } from '@/lib/cx'
import { agents, noteColleagues, profileCandidate, profileNotes } from '@/mock'
import type { ProfileNote } from '@/mock'
import { CandidateProfile } from './profile/CandidateProfile'
import { ProfileNotes } from './notes/ProfileNotes'
import { profileNoteTime } from './notes/time'
import { NoteThreadPanel } from '@/designs/notes-inbox/notes/NoteThreadPanel'
import { mentionsIn, noteTime } from '@/designs/notes-inbox/notes/mentions'

const me = agents.find((a) => a.id === 'ls')!
const tabs = [
  { key: 'details', label: 'Profile details' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'notes', label: 'Notes' },
]
let noteId = 0
let replyId = 0

export default function VariantA() {
  const [tab, setTab] = useState('notes')
  const [notes, setNotes] = useState<ProfileNote[]>(profileNotes)
  const [draft, setDraft] = useState('')
  const [focusKey, setFocusKey] = useState<number | undefined>(undefined)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [threadFocus, setThreadFocus] = useState(0)
  const thread = notes.find((n) => n.id === threadId)

  const patch = (id: string, fn: (n: ProfileNote) => ProfileNote) => setNotes((ns) => ns.map((n) => (n.id === id ? fn(n) : n)))
  // Opening the thread marks it read
  function openThread(n: ProfileNote, focus: boolean) {
    setThreadId(n.id)
    patch(n.id, (x) => ({ ...x, unread: false }))
    if (focus) setThreadFocus((k) => k + 1)
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex h-16 shrink-0 items-center bg-brand px-8">
        <img src="/brand/logo-mark.svg" alt="PowerMatch" className="h-6 w-auto brightness-0" />
      </header>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 overflow-y-auto border-gray-200 bg-white lg:w-[480px] lg:border-r">
          <CandidateProfile candidate={profileCandidate} />
        </aside>
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-8 sm:px-10">
          <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={cx('-mb-px border-b-2 px-2 pb-3 text-base', t.key === tab ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900')}
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
                onAddNote={(text, mentions) => {
                  setNotes((ns) => [...ns, { id: `new-${++noteId}`, author: me.name, authorPhoto: me.photo, time: profileNoteTime(), text, mentions }])
                  setDraft('')
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
