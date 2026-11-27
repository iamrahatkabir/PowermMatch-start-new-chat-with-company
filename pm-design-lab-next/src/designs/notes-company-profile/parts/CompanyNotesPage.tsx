'use client'
// Company profile notes prototype: shared ProfileNotesPage with the company header and company tabs.
import { companyProfileNotes, notesCompany } from '@/mock'
import type { NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'
import { ProfileNotesPage } from '@/designs/notes-profile/parts/ProfileNotesPage'
import { CompanyHeader } from '../profile/CompanyHeader'

const tabs = [
  { key: 'details', label: 'Company Details' },
  { key: 'tasks', label: 'Tasks', count: notesCompany.counts.tasks },
  { key: 'notes', label: 'Notes' },
  { key: 'jobs', label: 'Jobs', count: notesCompany.counts.jobs },
  { key: 'employees', label: 'Employees' },
  { key: 'matches', label: 'Matches' },
  { key: 'settings', label: 'Settings' },
  { key: 'payment', label: 'Payment' },
]

export function CompanyNotesPage({ noteTypes }: { noteTypes: NoteTypeMode }) {
  return <ProfileNotesPage active="companies" header={<CompanyHeader company={notesCompany} />} tabs={tabs} notes={companyProfileNotes} noteTypes={noteTypes} self={notesCompany.name} />
}
