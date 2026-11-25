'use client'
/**
 * VERSION B — Filter tabs
 * One flat list with tabs: All · Companies · Candidates · Applicants. A "Contact persons" tab
 * appears only while searching. Companies expand in place to show their contact persons.
 *
 * Props:     companies, candidates, applicants   (shapes: see README.md)
 * Callbacks: onSelectContact(companyId, contactId), onSelectPerson(person, kind)
 */
import { Fragment, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { PmTabs } from '@/ds'
import { cx } from '@/lib/cx'
import { searchDirectory } from './search'
import { MenuShell } from './ui/MenuShell'
import { MenuRow } from './ui/MenuRow'

export function StartChatTabs({ companies, candidates, applicants, onSelectContact, onSelectPerson }) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [expandedCompanyId, setExpandedCompanyId] = useState(null)
  const results = searchDirectory(query, { companies, candidates, applicants })

  // Every result as one row type, so tabs can filter a single list
  const rows = [
    ...results.contacts.map((p) => ({ key: `ct-${p.id}`, kind: 'contact', label: 'Contact person', entity: { type: 'contact', name: p.name }, subtitle: `${p.role} • ${p.company}`, onClick: () => onSelectContact?.(p.companyId, p.id) })),
    ...results.companies.map((c) => ({ key: `co-${c.id}`, kind: 'company', label: 'Company', entity: { type: 'company', name: c.name, logo: c.logo }, subtitle: c.contractsLabel, company: c, onClick: () => setExpandedCompanyId(expandedCompanyId === c.id ? null : c.id) })),
    ...results.candidates.map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', label: 'Candidate', entity: p, subtitle: p.meta, onClick: () => onSelectPerson?.(p, 'candidate') })),
    ...results.applicants.map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', label: 'Applicant', entity: p, subtitle: p.meta, onClick: () => onSelectPerson?.(p, 'applicant') })),
  ]
  const count = (kind) => rows.filter((r) => kind === 'all' || r.kind === kind).length
  const tabs = [
    { key: 'all', label: 'All' },
    ...(results.contacts.length ? [{ key: 'contact', label: 'Contact persons' }] : []),
    { key: 'company', label: 'Companies' },
    { key: 'candidate', label: 'Candidates' },
    { key: 'applicant', label: 'Applicants' },
  ].map((t) => ({ ...t, count: count(t.key) }))
  // If the active tab disappears (e.g. search cleared), fall back to All
  if (!tabs.some((x) => x.key === tab)) setTab('all')
  const visibleRows = rows.filter((r) => tab === 'all' || r.kind === tab)

  return (
    <MenuShell
      value={query}
      onChange={setQuery}
      belowSearch={<div className="-mx-1 mt-2 [&>div>button]:text-[13px]"><PmTabs value={tab} onChange={setTab} tabs={tabs} /></div>}
    >
      {visibleRows.map((r) => (
        <Fragment key={r.key}>
          <MenuRow
            entity={r.entity}
            subtitle={r.subtitle}
            query={query}
            onClick={() => r.onClick()}
            end={
              <>
                {tab === 'all' && <span className="shrink-0 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">{r.label}</span>}
                {r.kind === 'company' && <ChevronDown size={16} className={cx('shrink-0 text-gray-400 transition-transform', expandedCompanyId === r.company.id && 'rotate-180')} />}
              </>
            }
          />
          {/* Expanded company: its contact persons */}
          {r.kind === 'company' && expandedCompanyId === r.company.id && (
            <div className="mb-1 ml-[27px] border-l border-gray-200 pl-3">
              {r.company.contacts.map((p) => (
                <MenuRow
                  key={p.id}
                  entity={{ type: 'contact', name: p.name }}
                  subtitle={p.role}
                  onClick={() => onSelectContact?.(r.company.id, p.id)}
                />
              ))}
            </div>
          )}
        </Fragment>
      ))}
      {!visibleRows.length && <p className="px-2 py-6 text-center text-sm text-gray-500">No results for “{query}”</p>}
    </MenuShell>
  )
}
