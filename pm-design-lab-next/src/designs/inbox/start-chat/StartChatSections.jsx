'use client'
/**
 * VERSION A — Sections
 * Default list: Company, Candidate, Applicant. While searching, a "Contact person" section
 * is added (name + "Role • Company"). Companies can still be opened to pick a contact.
 *
 * Props:     companies, candidates, applicants   (shapes: see README.md)
 * Callbacks: onSelectContact(companyId, contactId)   → open the company chat with this contact as current
 *            onSelectPerson(person, kind)            → kind is 'candidate' | 'applicant'
 */
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { searchDirectory } from './search'
import { MenuShell } from './ui/MenuShell'
import { MenuSection } from './ui/MenuSection'
import { MenuRow } from './ui/MenuRow'

export function StartChatSections({ companies, candidates, applicants, onSelectContact, onSelectPerson }) {
  const [query, setQuery] = useState('')
  const [openCompany, setOpenCompany] = useState(null)
  const results = searchDirectory(query, { companies, candidates, applicants })
  const empty = !Object.values(results).some((v) => v.length)

  return (
    <MenuShell value={query} onChange={setQuery}>
      {openCompany ? (
        // A company was opened: pick one of its contact persons
        <>
          <button type="button" className="flex items-center gap-2 px-2 pt-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpenCompany(null)}>
            <ArrowLeft size={18} />All
          </button>
          <MenuSection title="Company" />
          <MenuRow entity={{ type: 'company', name: openCompany.name, logo: openCompany.logo }} subtitle={openCompany.contractsLabel} className="pointer-events-none" />
          <MenuSection title="Contact person" />
          {openCompany.contacts.map((p) => (
            <MenuRow
              key={p.id}
              entity={{ type: 'contact', name: p.name }}
              subtitle={p.role}
              onClick={() => onSelectContact?.(openCompany.id, p.id)}
            />
          ))}
        </>
      ) : (
        <>
          {results.companies.length > 0 && (
            <>
              <MenuSection title="Company" count={results.companies.length} />
              {results.companies.map((c) => (
                <MenuRow
                  key={c.id}
                  entity={{ type: 'company', name: c.name, logo: c.logo }}
                  subtitle={c.contractsLabel}
                  query={query}
                  chevron
                  onClick={() => setOpenCompany(c)}
                />
              ))}
            </>
          )}
          {results.contacts.length > 0 && (
            <>
              <MenuSection title="Contact person" count={results.contacts.length} />
              {results.contacts.map((p) => (
                <MenuRow
                  key={p.id}
                  entity={{ type: 'contact', name: p.name }}
                  subtitle={`${p.role} • ${p.company}`}
                  query={query}
                  onClick={() => onSelectContact?.(p.companyId, p.id)}
                />
              ))}
            </>
          )}
          {results.candidates.length > 0 && (
            <>
              <MenuSection title="Candidate" count={results.candidates.length} />
              {results.candidates.map((p) => <MenuRow key={p.id} entity={p} subtitle={p.meta} query={query} onClick={() => onSelectPerson?.(p, 'candidate')} />)}
            </>
          )}
          {results.applicants.length > 0 && (
            <>
              <MenuSection title="Applicant" count={results.applicants.length} />
              {results.applicants.map((p) => <MenuRow key={p.id} entity={p} subtitle={p.meta} query={query} onClick={() => onSelectPerson?.(p, 'applicant')} />)}
            </>
          )}
          {empty && <p className="px-2 py-6 text-center text-sm text-gray-500">No results for “{query}”</p>}
        </>
      )}
    </MenuShell>
  )
}
