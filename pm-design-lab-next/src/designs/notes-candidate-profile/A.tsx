'use client'
// Applicant/Candidate profile notes — version A: internal applicant profile (breadcrumb, header with rating,
// status and Match Job, tabs with counts) with the latest profile notes design (AI note type, badge at the bottom
// right of the card). The UI is in profile/ and notes-profile/notes/; the prototype is parts/ApplicantNotesPage.tsx.
import { ApplicantNotesPage } from './parts/ApplicantNotesPage'

export default function VariantA() {
  return <ApplicantNotesPage noteTypes="ai-top" />
}
