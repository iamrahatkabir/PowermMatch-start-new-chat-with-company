'use client'
// Company profile notes prototype: app shell (Companies active), breadcrumb + header, tabs with counts,
// full-width Notes tab (shared profile notes), Thread panel on the right. The content area scrolls as one;
// the Thread panel sticks.
import { useRef, useState } from 'react'
import { PmAppShell } from '@/ds'
import { companyProfileNotes, notesCompany } from '@/mock'
import type { NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'
import { ProfileNotesSection } from '@/designs/notes-profile/parts/ProfileNotesSection'
import { CompanyHeader } from '../profile/CompanyHeader'
import { ProfileTabs } from '../profile/ProfileTabs'

type Props = { noteTypes: NoteTypeMode }

export function CompanyNotesPage({ noteTypes }: Props) {
  const [tab, setTab] = useState('notes')
  const main = useRef<HTMLElement>(null)
  const activeNotes = companyProfileNotes.filter((n) => !n.archived).length
  const tabs = [
    { key: 'details', label: 'Company Details' },
    { key: 'tasks', label: 'Tasks', count: notesCompany.counts.tasks },
    { key: 'notes', label: 'Notes', count: activeNotes },
    { key: 'jobs', label: 'Jobs', count: notesCompany.counts.jobs },
    { key: 'employees', label: 'Employees' },
    { key: 'matches', label: 'Matches' },
    { key: 'settings', label: 'Settings' },
    { key: 'payment', label: 'Payment' },
  ]
  return (
    <PmAppShell active="companies" flush>
      <ProfileNotesSection initial={companyProfileNotes} noteTypes={noteTypes} scrollTo={main} threadClassName="xl:sticky xl:top-0 xl:h-full xl:max-h-[calc(100vh-64px)] xl:self-start">
        {({ notes, thread }) => (
          <div className="h-full overflow-y-auto bg-white">
            <div className="flex min-h-full">
              <div className="min-w-0 flex-1">
                <div className="px-8 pt-6"><CompanyHeader company={notesCompany} /></div>
                <div className="mt-6"><ProfileTabs tabs={tabs} value={tab} onChange={setTab} /></div>
                <main ref={main} className="scroll-mt-4 px-8 py-6">
                  {tab === 'notes' ? notes : <p className="text-sm text-gray-500">Not part of this design</p>}
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
