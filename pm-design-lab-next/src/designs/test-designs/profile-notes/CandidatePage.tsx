'use client'
// Applicant/Candidate profile notes page (James Adam, AI note type v2) for Test designs A and B–F; `summary` picks the
// AI summary layout.
import { useState } from 'react'
import { notesPerson, personNotes, PERSON_STATUSES } from '@/mock'
import { ApplicantHeader } from '@/designs/notes-candidate-profile/profile/ApplicantHeader'
import { ProfileNotesPage } from './ProfileNotesPage'
import type { SummaryVariant } from './AiSummaryVariants'

const tabs = [
  { key: 'details', label: 'Profile Details' },
  { key: 'todo', label: 'Todo', count: notesPerson.counts.todo },
  { key: 'notes', label: 'Notes' },
  { key: 'activity', label: 'Activity' },
]

export function CandidatePage({ summary }: { summary: SummaryVariant }) {
  const [status, setStatus] = useState(notesPerson.status)
  return (
    <ProfileNotesPage
      active="candidates"
      header={<ApplicantHeader person={{ ...notesPerson, status }} statuses={PERSON_STATUSES} onStatusChange={setStatus} />}
      tabs={tabs}
      notes={personNotes}
      noteTypes="ai-top"
      self={notesPerson.name}
      summaryVariant={summary}
    />
  )
}
