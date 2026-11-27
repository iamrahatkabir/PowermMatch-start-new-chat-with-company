'use client'
// Notes in profile prototype (all versions): yellow top bar, candidate profile column, tabs and the Notes tab.
// The notes themselves (state, filters, paging, thread…) live in parts/ProfileNotesSection.tsx.
// The whole page scrolls (no inner scroll in the profile column); the Thread panel sticks to the screen.
import { useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { profileCandidate, profileNotes } from '@/mock'
import { CandidateProfile } from '../profile/CandidateProfile'
import { ProfileNotesSection } from './ProfileNotesSection'
import type { NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'

const tabs = [
  { key: 'details', label: 'Profile details' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'notes', label: 'Notes' },
]

type Props = { noteTypes: NoteTypeMode }

export function NotesProfile({ noteTypes }: Props) {
  const [tab, setTab] = useState('notes')
  const main = useRef<HTMLElement>(null)
  return (
    <ProfileNotesSection initial={profileNotes} noteTypes={noteTypes} self={profileCandidate.name} scrollTo={main} threadClassName="xl:sticky xl:top-0 xl:h-screen xl:self-start">
      {({ notes, thread }) => (
        <div className="flex min-h-screen flex-col bg-gray-50">
          <header className="flex h-16 shrink-0 items-center bg-brand px-8">
            <img src="/brand/logo-mark.svg" alt="PowerMatch" className="h-6 w-auto brightness-0" />
          </header>
          <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
            <aside className="shrink-0 border-b border-gray-200 bg-white lg:w-[480px] lg:border-b-0 lg:border-r">
              <CandidateProfile candidate={profileCandidate} />
            </aside>
            <main ref={main} className="min-w-0 flex-1 scroll-mt-4 px-4 py-8 sm:px-10">
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
              <div className="pt-10">{tab === 'notes' ? notes : <p className="text-sm text-gray-500">Not part of this design</p>}</div>
            </main>
            {thread}
          </div>
        </div>
      )}
    </ProfileNotesSection>
  )
}
