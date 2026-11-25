'use client'
import { Building, FileText, Mail, MapPin, PanelRight, Phone, Video } from 'lucide-react'
import { PmAvatar, PmStatusPill } from '@/ds'
import { candidateProfile as p, PROFILE_STATUS } from '@/mock'
import { useInbox } from './useInbox'

const info = [
  { label: 'Phone', value: p.phone, icon: Phone },
  { label: 'Email', value: p.email, icon: Mail },
  { label: 'Address', value: p.address, icon: MapPin },
  { label: 'Employer', value: p.employer, icon: Building },
]

// PmStatusPill has no className: `self-start` lives on a wrapper so the pill doesn't stretch
const Pill = ({ status }) => (
  <span className="flex self-start"><PmStatusPill tone={PROFILE_STATUS[status].tone} dot={false} bordered>{PROFILE_STATUS[status].label}</PmStatusPill></span>
)

export function CandidatePanel() {
  const { selected } = useInbox()

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-l border-gray-200 xl:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-4">
        <span className="text-base font-semibold text-gray-900">Candidate info</span>
        <button type="button" className="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50" title="Hide panel"><PanelRight size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-1 border-b border-gray-200 px-4 py-6 text-center">
          <PmAvatar name={selected.name} src={selected.photo} size={64} className="mb-2" />
          <div className="text-base font-semibold text-gray-900">{selected.name}</div>
          <div className="text-[13px] text-gray-600">{selected.kind === 'applicant' ? 'Applicant' : p.type} • {p.trade} • {p.experience}</div>
        </div>

        <section className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-[13px] font-medium text-gray-600">Personal Info</h3>
          <dl className="flex flex-col gap-3 text-[13px]">
            {info.map((r) => (
              <div key={r.label} className="flex gap-3">
                <dt className="flex w-20 shrink-0 items-center gap-1.5 self-start text-gray-600"><r.icon size={14} />{r.label}</dt>
                <dd className="min-w-0 break-words text-gray-900">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-[13px] font-medium text-gray-600">Interviews</h3>
          <div className="flex flex-col gap-2">
            {p.interviews.map((i) => {
              const ModeIcon = i.mode === 'video' ? Video : MapPin
              return (
                <div key={i.id} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                  <ModeIcon size={16} className="mt-0.5 shrink-0 text-gray-600" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-gray-900">{i.date} • {i.time}</div>
                    <div className="text-xs text-gray-600">{i.company}</div>
                  </div>
                  <Pill status={i.status} />
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-b border-gray-200 p-4">
          <h3 className="mb-3 text-[13px] font-medium text-gray-600">Contracts</h3>
          <div className="flex flex-col gap-2">
            {p.contracts.map((c) => (
              <div key={c.id} className="flex gap-3 rounded-xl bg-gray-50 p-3">
                <FileText size={16} className="mt-0.5 shrink-0 text-gray-600" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-gray-900">{c.date} • {c.time}</div>
                  <div className="truncate text-xs text-gray-600">{c.company}</div>
                </div>
                <Pill status={c.status} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </aside>
  )
}
