'use client'
// Company profile notes — version A: internal company profile (breadcrumb, header, tabs with counts) with the
// latest profile notes design (AI note type, badge at the bottom right of the card). The UI is in profile/ and
// notes-profile/notes/; the prototype is parts/CompanyNotesPage.tsx.
import { CompanyNotesPage } from './parts/CompanyNotesPage'

export default function VariantA() {
  return <CompanyNotesPage noteTypes="ai-top" />
}
