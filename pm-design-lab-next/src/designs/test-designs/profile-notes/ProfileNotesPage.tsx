'use client'
// TEST COPY (Test designs A–F) of notes-profile/parts/ProfileNotesPage.tsx, using the copied ProfileNotesSection (AI summary).
// Internal profile page with notes (Applicant/Candidate profile notes, Company profile notes):
// app shell, a header (breadcrumb + identity + actions), tabs with counts, full-width Notes tab, Thread panel on
// the right. The content area scrolls as one; the Thread panel sticks.
import { useRef, useState, type ReactNode } from 'react'
import { PmAppShell } from '@/ds'
import type { ProfileNote } from '@/mock'
import type { NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'
import { ProfileNotesSection } from './ProfileNotesSection'
import type { SummaryVariant } from './AiSummaryVariants'
import { ProfileTabs, type ProfileTab } from '@/designs/notes-profile/profile/ProfileTabs'

type Props = {
  /** PmAppShell nav key, e.g. 'candidates' or 'companies' */
  active: string
  header: ReactNode
  /** The 'notes' tab gets the count of active (not archived) notes */
  tabs: ProfileTab[]
  notes: ProfileNote[]
  noteTypes: NoteTypeMode
  /** This profile's name (left out of the @ tag list) */
  self: string
  /** AI summary layout */
  summaryVariant?: SummaryVariant
}

export function ProfileNotesPage({ active, header, tabs, notes, noteTypes, self, summaryVariant }: Props) {
  const [tab, setTab] = useState('notes')
  const main = useRef<HTMLElement>(null)
  const activeCount = notes.filter((n) => !n.archived).length
  const shown = tabs.map((t) => (t.key === 'notes' ? { ...t, count: activeCount } : t))
  return (
    <PmAppShell active={active} flush>
      <ProfileNotesSection initial={notes} noteTypes={noteTypes} self={self} summaryVariant={summaryVariant} scrollTo={main} threadClassName="xl:sticky xl:top-0 xl:h-full xl:max-h-[calc(100vh-64px)] xl:self-start">
        {({ notes: notesNode, thread }) => (
          <div className="h-full overflow-y-auto bg-white">
            <div className="flex min-h-full">
              <div className="min-w-0 flex-1">
                <div className="px-8 pt-6">{header}</div>
                <div className="mt-6"><ProfileTabs tabs={shown} value={tab} onChange={setTab} /></div>
                <main ref={main} className="scroll-mt-4 px-8 py-6">
                  {tab === 'notes' ? notesNode : <p className="text-sm text-gray-500">Not part of this design</p>}
                </main>
              </div>
              {thread}
            </div>
          </div>
        )}
      </ProfileNotesSection>
    </PmAppShell>
  )
}
