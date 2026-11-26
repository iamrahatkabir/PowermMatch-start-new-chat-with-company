'use client'
// Applicant/Candidate profile notes — version A: internal profile (app shell), person summary on the left,
// Notes tab with the same notes as Notes in profile (AI note type, badge at the bottom right of the card).
import { notesPerson, personNotes } from '@/mock'
import { InternalProfilePage } from '@/designs/notes-profile/parts/InternalProfilePage'
import { PersonSummary } from './profile/PersonSummary'

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'applications', label: 'Applications' },
  { key: 'documents', label: 'Documents' },
  { key: 'notes', label: 'Notes' },
]

export default function VariantA() {
  return <InternalProfilePage active="candidates" summary={<PersonSummary person={notesPerson} />} tabs={tabs} notes={personNotes} noteTypes="ai-top" />
}
