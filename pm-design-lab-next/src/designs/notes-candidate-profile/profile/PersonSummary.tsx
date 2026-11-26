// Left column of the internal applicant/candidate profile: photo, name, Applicant/Candidate pill, trade,
// status, contact details, what they applied for and their recruiter. Long values truncate or wrap.
import { Briefcase, Hammer, Mail, MapPin, Phone, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PmAvatar, PmStatusPill } from '@/ds'
import type { PersonProfile } from '@/mock/notes'

type Props = { person: PersonProfile }

export function PersonSummary({ person: p }: Props) {
  const rows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Phone, label: 'Phone', value: p.phone },
    { icon: Mail, label: 'Email', value: p.email },
    { icon: MapPin, label: 'Address', value: p.address },
  ]
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-1 border-b border-gray-200 px-6 py-6 text-center">
        <PmAvatar name={p.name} src={p.photo} size={72} className="mb-2" />
        <h1 className="max-w-full text-lg font-semibold text-gray-900 [overflow-wrap:anywhere]">{p.name}</h1>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-gray-600">
          <span className="flex items-center gap-1"><Hammer size={14} />{p.trade}</span>
          <span>• {p.experienceYears} years • {p.age} years old</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <PmStatusPill tone="neutral" dot={false} bordered>{p.kind === 'applicant' ? 'Applicant' : 'Candidate'}</PmStatusPill>
          <PmStatusPill tone="success" bordered>{p.status}</PmStatusPill>
        </div>
      </div>

      <section className="border-b border-gray-200 px-6 py-5">
        <h3 className="mb-3 text-[13px] font-medium text-gray-600">Personal Info</h3>
        <dl className="flex flex-col gap-3 text-[13px]">
          {rows.map((r) => (
            <div key={r.label} className="flex gap-3">
              <dt className="flex w-20 shrink-0 items-center gap-1.5 self-start text-gray-600"><r.icon size={14} />{r.label}</dt>
              <dd className="min-w-0 text-gray-900 [overflow-wrap:anywhere]">{r.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-6 py-5">
        <h3 className="mb-3 text-[13px] font-medium text-gray-600">Recruitment</h3>
        <dl className="flex flex-col gap-3 text-[13px]">
          {p.appliedFor && (
            <div className="flex gap-3">
              <dt className="flex w-20 shrink-0 items-center gap-1.5 self-start text-gray-600"><Briefcase size={14} />Applied</dt>
              <dd className="min-w-0 text-gray-900">{p.appliedFor}</dd>
            </div>
          )}
          <div className="flex gap-3">
            <dt className="flex w-20 shrink-0 items-center gap-1.5 text-gray-600"><User size={14} />Recruiter</dt>
            <dd className="min-w-0 truncate text-gray-900">{p.recruiter}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
