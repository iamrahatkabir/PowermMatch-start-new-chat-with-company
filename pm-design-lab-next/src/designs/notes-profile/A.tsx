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

const me = agents.find((a) => a.id === 'ls')!
const tabs = [
  { key: 'details', label: 'Profile details' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'notes', label: 'Notes' },
]
let noteId = 0

export default function VariantA() {
  const [tab, setTab] = useState('notes')
  const [notes, setNotes] = useState<ProfileNote[]>(profileNotes)
  const [draft, setDraft] = useState('')
  const [focusKey, setFocusKey] = useState<number | undefined>(undefined)

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
                onReply={(n) => { setDraft(`@${n.author} `); setFocusKey((k) => (k ?? 0) + 1) }}
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
      </div>
    </div>
  )
}
