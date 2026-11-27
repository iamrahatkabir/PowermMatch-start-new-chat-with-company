'use client'
// Test designs — version A: Applicant/Candidate profile notes (James Adam) with the AI summary card at the top of Notes.
// Page + notes logic in profile-notes/ (CandidatePage); B–F are the same page with other summary layouts.
import { CandidatePage } from './profile-notes/CandidatePage'

export default function VariantA() {
  return <CandidatePage summary="card" />
}
