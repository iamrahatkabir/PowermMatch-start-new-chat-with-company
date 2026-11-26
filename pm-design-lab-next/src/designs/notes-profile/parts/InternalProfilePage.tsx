'use client'
// Internal profile page used by Applicant/Candidate profile notes (Company profile notes has its own layout):
// PowerMatch app shell, a summary column on the left (shown in full, no scroll of its own), tabs and the Notes tab
// on the right, Thread panel at the far right. The whole content area scrolls as one; the Thread panel sticks.
import { useRef, useState, type ReactNode } from 'react'
import { PmAppShell } from '@/ds'
import { cx } from '@/lib/cx'
import type { ProfileNote } from '@/mock'
import type { NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'
import { ProfileNotesSection } from './ProfileNotesSection'

type Props = {
  /** PmAppShell nav key, e.g. 'candidates' or 'companies' */
  active: string
  summary: ReactNode
  tabs: { key: string; label: string }[]
  notes: ProfileNote[]
  noteTypes: NoteTypeMode
}

export function InternalProfilePage({ active, summary, tabs, notes, noteTypes }: Props) {
  const [tab, setTab] = useState('notes')
  const main = useRef<HTMLElement>(null)
  return (
    <PmAppShell active={active} flush navCollapsed>
      <ProfileNotesSection initial={notes} noteTypes={noteTypes} scrollTo={main} threadClassName="xl:sticky xl:top-0 xl:h-full xl:max-h-[calc(100vh-64px)] xl:self-start">
        {({ notes: notesNode, thread }) => (
          <div className="h-full overflow-y-auto">
            <div className="flex min-h-full">
              <aside className="w-[340px] shrink-0 border-r border-gray-200 bg-white">{summary}</aside>
              <main ref={main} className="min-w-0 flex-1 scroll-mt-4 px-8 py-6">
                <div className="flex gap-2 border-b border-gray-200">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={cx('-mb-px shrink-0 whitespace-nowrap border-b-2 px-2 pb-3 text-sm', t.key === tab ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900')}
                      onClick={() => setTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="pt-6">{tab === 'notes' ? notesNode : <p className="text-sm text-gray-500">Not part of this design</p>}</div>
              </main>
              {thread}
            </div>
          </div>
        )}
      </ProfileNotesSection>
    </PmAppShell>
  )
}
