'use client'
// Company profile notes — version A: internal company profile (app shell), company summary on the left,
// Notes tab with the shared profile notes (AI note type, badge at the bottom right of the card).
import { clientCompanies, companyProfileNotes } from '@/mock'
import { InternalProfilePage } from '@/designs/notes-profile/parts/InternalProfilePage'
import { CompanySummary } from './profile/CompanySummary'

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'contracts', label: 'Contracts' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'notes', label: 'Notes' },
]

export default function VariantA() {
  return <InternalProfilePage active="companies" summary={<CompanySummary company={clientCompanies[0]} />} tabs={tabs} notes={companyProfileNotes} noteTypes="ai-top" />
}
