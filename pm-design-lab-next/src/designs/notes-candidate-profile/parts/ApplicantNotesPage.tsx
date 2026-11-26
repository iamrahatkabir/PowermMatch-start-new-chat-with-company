'use client'
// Applicant/Candidate profile notes prototype: shared ProfileNotesPage with the applicant header (status can be
// changed) and the applicant tabs.
import { useState } from 'react'
import { notesPerson, personNotes, PERSON_STATUSES } from '@/mock'
import type { NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'
import { ProfileNotesPage } from '@/designs/notes-profile/parts/ProfileNotesPage'
import { ApplicantHeader } from '../profile/ApplicantHeader'

const tabs = [
  { key: 'details', label: 'Profile Details' },
  { key: 'todo', label: 'Todo', count: notesPerson.counts.todo },
  { key: 'notes', label: 'Notes' },
  { key: 'activity', label: 'Activity' },
]

export function ApplicantNotesPage({ noteTypes }: { noteTypes: NoteTypeMode }) {
  const [status, setStatus] = useState(notesPerson.status)
  return (
    <ProfileNotesPage
      active="candidates"
      header={<ApplicantHeader person={{ ...notesPerson, status }} statuses={PERSON_STATUSES} onStatusChange={setStatus} />}
      tabs={tabs}
      notes={personNotes}
      noteTypes={noteTypes}
    />
  )
}
