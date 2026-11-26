// Left column of the internal company profile: logo, name, contracts, company info, contact persons and open jobs.
// Long names truncate; lists show everything (the page scrolls as a whole).
import { Briefcase, Mail, MapPin, Phone } from 'lucide-react'
import { PmAvatar, PmStatusPill } from '@/ds'
import type { Company } from '@/mock/inbox-types'
import { EntityAvatar } from '@/designs/inbox/start-chat/ui/EntityAvatar'

type Props = { company: Company }

export function CompanySummary({ company: c }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-1 border-b border-gray-200 px-6 py-6 text-center">
        <EntityAvatar type="company" logo={c.logo} size={72} className="mb-2" />
        <h1 className="max-w-full text-lg font-semibold text-gray-900 [overflow-wrap:anywhere]">{c.name}</h1>
        <div className="mt-1"><PmStatusPill tone="neutral" dot={false} bordered>{c.contractsLabel}</PmStatusPill></div>
      </div>

      <section className="border-b border-gray-200 px-6 py-5">
        <h3 className="mb-3 text-[13px] font-medium text-gray-600">Company Info</h3>
        <dl className="flex flex-col gap-3 text-[13px]">
          <div className="flex gap-3"><dt className="flex w-20 shrink-0 items-center gap-1.5 text-gray-600"><Mail size={14} />Email</dt><dd className="min-w-0 text-gray-900 [overflow-wrap:anywhere]">{c.email}</dd></div>
          <div className="flex gap-3"><dt className="flex w-20 shrink-0 items-center gap-1.5 self-start text-gray-600"><MapPin size={14} />Address</dt><dd className="min-w-0 text-gray-900">{c.address}</dd></div>
        </dl>
      </section>

      <section className="border-b border-gray-200 px-6 py-5">
        <h3 className="mb-3 text-[13px] font-medium text-gray-600">Contact Persons</h3>
        <ul className="flex flex-col gap-3">
          {c.contacts.map((p) => (
            <li key={p.id} className="flex items-center gap-2.5">
              <span className="shrink-0"><PmAvatar name={p.name} size={32} /></span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-gray-900">{p.name}</div>
                <div className="truncate text-xs text-gray-600">{p.role}</div>
              </div>
              {p.phone && <a href={`tel:${p.phone}`} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title={p.phone}><Phone size={15} /></a>}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 py-5">
        <h3 className="mb-3 text-[13px] font-medium text-gray-600">Open Jobs</h3>
        <ul className="flex flex-col gap-3">
          {c.jobs.map((j) => (
            <li key={j.id} className="flex items-start gap-2.5 text-[13px]">
              <Briefcase size={15} className="mt-0.5 shrink-0 text-gray-500" />
              <div className="min-w-0 flex-1">
                <div className="text-gray-900">{j.title}</div>
                <div className="text-xs text-gray-600">{j.open} open • {j.hired} hired • {j.city}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
