'use client'
/**
 * VERSION C — Best match card
 * Default list is the same as version A. While searching, the top result becomes a card with
 * role, company and phone, plus a "Start chat" button. Enter starts the top result.
 *
 * Props:     companies, candidates, applicants   (shapes: see README.md)
 * Callbacks: onSelectContact(companyId, contactId), onSelectPerson(person, kind)
 */
import { useState } from 'react'
import { ArrowLeft, CornerDownLeft, Phone } from 'lucide-react'
import { PmButton } from '@/ds'
import { byNameRelevance, searchDirectory } from './search'
import { MenuShell } from './ui/MenuShell'
import { MenuSection } from './ui/MenuSection'
import { MenuRow } from './ui/MenuRow'
import { EntityAvatar } from './ui/EntityAvatar'
import { Highlight } from './ui/Highlight'

const avatarOf = (r) => ({ type: r.kind === 'contact' ? 'contact' : r.kind === 'company' ? 'company' : 'person', name: r.name, photo: r.photo, logo: r.logo })

export function StartChatBestMatch({ companies, candidates, applicants, onSelectContact, onSelectPerson }) {
  const [query, setQuery] = useState('')
  const [openCompany, setOpenCompany] = useState(null)
  const results = searchDirectory(query, { companies, candidates, applicants })

  // All results ranked by name relevance; the first one is shown as the card
  const ranked = !results.searching
    ? []
    : [
        ...results.contacts.map((p) => ({ key: `ct-${p.id}`, kind: 'contact', label: 'Contact person', name: p.name, subtitle: `${p.role} • ${p.company}`, contact: p, onSelect: () => onSelectContact?.(p.companyId, p.id) })),
        ...results.companies.map((c) => ({ key: `co-${c.id}`, kind: 'company', label: 'Company', name: c.name, logo: c.logo, subtitle: c.contractsLabel, onSelect: () => setOpenCompany(c) })),
        ...results.candidates.map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', label: 'Candidate', name: p.name, photo: p.photo, subtitle: p.meta, onSelect: () => onSelectPerson?.(p, 'candidate') })),
        ...results.applicants.map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', label: 'Applicant', name: p.name, photo: p.photo, subtitle: p.meta, onSelect: () => onSelectPerson?.(p, 'applicant') })),
      ].sort(byNameRelevance(query))
  const top = ranked[0]

  function onKeyDown(e) {
    if (e.key !== 'Enter' || !top) return
    e.preventDefault()
    top.onSelect()
  }

  return (
    <MenuShell value={query} onChange={setQuery} onKeyDown={onKeyDown}>
      {openCompany ? (
        // A company was opened: pick one of its contact persons
        <>
          <button type="button" className="flex items-center gap-2 px-2 pt-2 text-sm text-gray-700 hover:text-gray-900" onClick={() => setOpenCompany(null)}><ArrowLeft size={18} />Back</button>
          <MenuSection title={`Contact persons at ${openCompany.name}`} />
          {openCompany.contacts.map((p) => <MenuRow key={p.id} entity={{ type: 'contact', name: p.name }} subtitle={p.role} onClick={() => onSelectContact?.(openCompany.id, p.id)} />)}
        </>
      ) : results.searching ? (
        // Searching: best match card + other results
        <>
          {top && (
            <div className="m-1 mt-2 rounded-xl border border-gray-200 bg-gray-25 p-4">
              <div className="flex items-start gap-3">
                <EntityAvatar {...avatarOf(top)} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-gray-900"><Highlight text={top.name} query={query} /></span>
                    <span className="shrink-0 rounded-md border border-gray-200 bg-white px-1.5 text-[11px] leading-[18px] text-gray-600">{top.label}</span>
                  </div>
                  <div className="truncate text-xs text-gray-500">{top.kind === 'contact' ? top.contact.role : top.subtitle}</div>
                </div>
              </div>
              {top.kind === 'contact' && (
                <div className="mt-3 flex flex-col gap-1.5 text-xs text-gray-600">
                  <span className="flex items-center gap-2"><EntityAvatar type="company" logo={top.contact.companyLogo} size={18} /><Highlight text={top.contact.company} query={query} /></span>
                  <span className="flex items-center gap-2 pl-0.5"><Phone size={14} />{top.contact.phone}</span>
                </div>
              )}
              <PmButton block className="mt-4" onClick={() => top.onSelect()}>
                {top.kind === 'company' ? 'Show contact persons' : `Start chat with ${top.name.split(' ')[0]}`}
                <CornerDownLeft size={14} className="opacity-50" />
              </PmButton>
              {top.kind === 'contact' && <p className="mt-2 text-center text-[11px] text-gray-500">Opens in the {top.contact.company} conversation</p>}
            </div>
          )}

          {ranked.length > 1 && (
            <>
              <MenuSection title="Other results" count={ranked.length - 1} />
              {ranked.slice(1).map((r) => (
                <MenuRow
                  key={r.key}
                  entity={avatarOf(r)}
                  subtitle={r.subtitle}
                  query={query}
                  chevron={r.kind === 'company'}
                  onClick={() => r.onSelect()}
                  end={<span className="shrink-0 rounded-md border border-gray-200 px-1.5 text-[11px] leading-[18px] text-gray-600">{r.label}</span>}
                />
              ))}
            </>
          )}
          {!top && <p className="px-2 py-6 text-center text-sm text-gray-500">No results for “{query}”</p>}
        </>
      ) : (
        // Not searching: same sections as version A
        <>
          <MenuSection title="Company" count={results.companies.length} />
          {results.companies.map((c) => <MenuRow key={c.id} entity={{ type: 'company', name: c.name, logo: c.logo }} subtitle={c.contractsLabel} chevron onClick={() => setOpenCompany(c)} />)}
          <MenuSection title="Candidate" count={results.candidates.length} />
          {results.candidates.map((p) => <MenuRow key={p.id} entity={p} subtitle={p.meta} onClick={() => onSelectPerson?.(p, 'candidate')} />)}
          <MenuSection title="Applicant" count={results.applicants.length} />
          {results.applicants.map((p) => <MenuRow key={p.id} entity={p} subtitle={p.meta} onClick={() => onSelectPerson?.(p, 'applicant')} />)}
        </>
      )}
    </MenuShell>
  )
}
