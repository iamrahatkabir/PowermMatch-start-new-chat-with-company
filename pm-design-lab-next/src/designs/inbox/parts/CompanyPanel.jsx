'use client'
import { Briefcase, Mail, MapPin, PanelRight, Phone, Receipt } from 'lucide-react'
import { PmButton, PmStatusPill } from '@/ds'
import { PROFILE_STATUS } from '@/mock'
import { useInbox } from './useInbox'
import { EntityAvatar } from '../start-chat/ui/EntityAvatar'

// PmStatusPill has no className: `self-start` lives on a wrapper so the pill doesn't stretch
const Pill = ({ status }) => (
  <span className="flex self-start"><PmStatusPill tone={PROFILE_STATUS[status].tone} dot={false} bordered>{PROFILE_STATUS[status].label}</PmStatusPill></span>
)

// Company info: who we're currently talking to, and a quick switch to another contact person.
export function CompanyPanel() {
  const { selected, company, currentContact, switchContact } = useInbox()

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-l border-gray-200 xl:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-4">
        <span className="text-base font-semibold text-gray-900">Company info</span>
        <button type="button" className="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title="Hide panel"><PanelRight size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-1 border-b border-gray-200 px-4 py-6 text-center">
          <EntityAvatar type="company" logo={company.logo} size={64} className="mb-2" />
          <div className="text-base font-semibold text-gray-900">{company.name}</div>
          <div className="text-[13px] text-gray-600">{currentContact?.name}</div>
        </div>

        <section className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-[13px] font-medium text-gray-600">Company Info</h3>
          <dl className="flex flex-col gap-3 text-[13px]">
            <div className="flex gap-3"><dt className="flex w-20 shrink-0 items-center gap-1.5 text-gray-600"><Mail size={14} />Email</dt><dd className="min-w-0 break-words text-gray-900">{company.email}</dd></div>
            <div className="flex gap-3"><dt className="flex w-20 shrink-0 items-center gap-1.5 self-start text-gray-600"><MapPin size={14} />Address</dt><dd className="min-w-0 text-gray-900">{company.address}</dd></div>
          </dl>
        </section>

        <section className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-[13px] font-medium text-gray-600">Contact Person</h3>
          <div className="flex flex-col gap-3">
            {company.contacts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <EntityAvatar type="contact" name={p.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-gray-900">{p.name}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-600"><Phone size={12} />{p.phone}</div>
                </div>
                {p.id === currentContact?.id
                  ? <span className="px-2 text-[13px] font-medium text-gray-900">Current</span>
                  : <PmButton size="sm" variant="secondary" onClick={() => switchContact(selected, p.id)}>Switch</PmButton>}
              </div>
            ))}
          </div>
        </section>

        {company.jobs.length > 0 && (
          <section className="border-b border-gray-200 p-4">
            <h3 className="mb-3 text-[13px] font-medium text-gray-600">Jobs</h3>
            <div className="flex flex-col gap-2">
              {company.jobs.map((j) => (
                <div key={j.id} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                  <Briefcase size={16} className="mt-0.5 shrink-0 text-gray-600" />
                  <div className="min-w-0 flex-1 text-xs text-gray-600">
                    <div className="text-[13px] font-medium text-gray-900">{j.title}</div>
                    <div className="mt-0.5">{j.open} open jobs • {j.hired} hired</div>
                    <div>{j.city}</div>
                  </div>
                  <Pill status={j.status} />
                </div>
              ))}
            </div>
          </section>
        )}

        {company.invoices.length > 0 && (
          <section className="p-4">
            <h3 className="mb-3 text-[13px] font-medium text-gray-600">Invoices</h3>
            <div className="flex flex-col gap-2">
              {company.invoices.map((i) => (
                <div key={i.id} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                  <Receipt size={16} className="mt-0.5 shrink-0 text-gray-600" />
                  <div className="min-w-0 flex-1 text-xs text-gray-600">
                    <div className="text-[13px] font-medium text-gray-900">{i.amount}</div>
                    <div className="mt-0.5">{i.period}</div>
                    <div>{i.sent}</div>
                  </div>
                  <Pill status={i.status} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  )
}
