'use client'
/**
 * VERSION D — Search window with preview
 * A centered window: results on the left, a preview of the highlighted result on the right
 * (phone, the company the chat opens under, colleagues). ↑ ↓ to move, Enter to start, Esc closes.
 *
 * Props:     companies, candidates, applicants   (shapes: see README.md)
 * Callbacks: onSelectContact(companyId, contactId), onSelectPerson(person, kind), onClose()
 * Choosing a company without picking a contact uses its first contact person.
 */
import { Fragment, useEffect, useRef, useState } from 'react'
import { MessageCircle, Phone, Search, X } from 'lucide-react'
import { PmButton } from '@/ds'
import { searchDirectory } from './search'
import { MenuSection } from './ui/MenuSection'
import { MenuRow } from './ui/MenuRow'
import { EntityAvatar } from './ui/EntityAvatar'

const avatarOf = (r) => ({ type: r.kind === 'contact' ? 'contact' : r.kind === 'company' ? 'company' : 'person', name: r.name, photo: r.photo, logo: r.logo })

export function StartChatSearchWindow({ companies, candidates, applicants, onSelectContact, onSelectPerson, onClose }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const input = useRef(null)
  useEffect(() => input.current?.focus(), [])

  const results = searchDirectory(query, { companies, candidates, applicants })
  const sections = [
    { title: 'Contact person', rows: results.contacts.map((p) => ({ key: `ct-${p.id}`, kind: 'contact', name: p.name, subtitle: `${p.role} • ${p.company}`, contact: p })) },
    { title: 'Company', rows: results.companies.map((c) => ({ key: `co-${c.id}`, kind: 'company', name: c.name, logo: c.logo, subtitle: c.contractsLabel, company: c })) },
    { title: 'Candidate', rows: results.candidates.map((p) => ({ key: `ca-${p.id}`, kind: 'candidate', name: p.name, photo: p.photo, subtitle: p.meta, person: p })) },
    { title: 'Applicant', rows: results.applicants.map((p) => ({ key: `ap-${p.id}`, kind: 'applicant', name: p.name, photo: p.photo, subtitle: p.meta, person: p })) },
  ].filter((s) => s.rows.length)
  const allRows = sections.flatMap((s) => s.rows)
  const active = allRows[activeIndex]
  // A new query starts at the first result
  const onQuery = (v) => {
    setQuery(v)
    setActiveIndex(0)
  }

  const companyOf = (contact) => companies.find((c) => c.id === contact.companyId)

  function start(row = active, contactId) {
    if (!row) return
    if (row.kind === 'contact') onSelectContact?.(row.contact.companyId, row.contact.id)
    else if (row.kind === 'company') onSelectContact?.(row.company.id, contactId ?? row.company.contacts[0].id)
    else onSelectPerson?.(row.person, row.kind)
  }
  function onKeyDown(e) {
    if (e.key === 'ArrowDown') setActiveIndex(Math.min(activeIndex + 1, allRows.length - 1))
    else if (e.key === 'ArrowUp') setActiveIndex(Math.max(activeIndex - 1, 0))
    else if (e.key === 'Enter') start()
    else return
    e.preventDefault()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-gray-900/40 px-4 pt-[12vh]" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="flex h-[min(520px,76vh)] w-[760px] max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <Search size={18} className="text-gray-500" />
          <input ref={input} value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Start new conversation — search contact persons, candidates, companies" className="input-text flex-1 bg-transparent text-sm text-gray-900 outline-none" />
          <button type="button" className="flex size-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100" title="Close (Esc)" onClick={() => onClose?.()}><X size={16} /></button>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Results */}
          <div className="w-[340px] shrink-0 overflow-y-auto border-r border-gray-200 px-2 pb-2">
            {sections.map((s) => (
              <Fragment key={s.title}>
                <MenuSection title={s.title} count={s.rows.length} />
                {s.rows.map((r) => (
                  <MenuRow
                    key={r.key}
                    entity={avatarOf(r)}
                    subtitle={r.subtitle}
                    query={query}
                    active={active?.key === r.key}
                    onMouseEnter={() => setActiveIndex(allRows.indexOf(r))}
                    onClick={() => start(r)}
                  />
                ))}
              </Fragment>
            ))}
            {!allRows.length && <p className="px-2 py-6 text-center text-sm text-gray-500">No results for “{query}”</p>}
          </div>

          {/* Preview of the highlighted result */}
          {active && (
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
              <div className="flex items-center gap-4">
                <EntityAvatar {...avatarOf(active)} size={56} />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold text-gray-900">{active.name}</div>
                  <div className="text-sm text-gray-500">{active.kind === 'contact' ? `Contact person • ${active.contact.role}` : active.subtitle}</div>
                </div>
              </div>

              {active.kind === 'contact' ? (
                // Contact person: phone, the company the chat opens under, colleagues
                <>
                  <div className="mt-5 flex items-center gap-2 text-sm text-gray-600"><Phone size={15} />{active.contact.phone}</div>
                  <div className="mt-5 rounded-xl border border-gray-200 p-4">
                    <div className="mb-3 text-xs font-medium text-gray-500">Chat opens under</div>
                    <div className="flex items-center gap-3">
                      <EntityAvatar type="company" logo={active.contact.companyLogo} size={36} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{active.contact.company}</div>
                        <div className="text-xs text-gray-500">{companyOf(active.contact).contractsLabel}</div>
                      </div>
                    </div>
                    {companyOf(active.contact).contacts.length > 1 && (
                      <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                        Other contact persons:{' '}
                        <span className="text-gray-700">{companyOf(active.contact).contacts.filter((p) => p.id !== active.contact.id).map((p) => p.name).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : active.kind === 'company' ? (
                // Company: choose who to talk to
                <div className="mt-5">
                  <div className="mb-2 text-xs font-medium text-gray-500">Contact persons</div>
                  <div className="flex flex-col gap-2">
                    {active.company.contacts.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                        <EntityAvatar type="contact" name={p.name} size={32} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.role}</div>
                        </div>
                        <PmButton size="sm" variant="secondary" onClick={() => start(active, p.id)}><MessageCircle size={14} />Chat</PmButton>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-auto flex items-center gap-3 pt-6">
                <PmButton onClick={() => start()}>
                  <MessageCircle size={16} />
                  {active.kind === 'company' ? 'Start chat' : `Start chat with ${active.name.split(' ')[0]}`}
                </PmButton>
                <span className="text-xs text-gray-400">↑ ↓ to move · Enter to start</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
