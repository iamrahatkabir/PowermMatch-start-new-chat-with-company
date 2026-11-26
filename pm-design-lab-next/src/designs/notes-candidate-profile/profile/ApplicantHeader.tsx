'use client'
// Top of the internal applicant/candidate profile: breadcrumb (Jobs icon › Applicants/Candidates › name), photo,
// name, star rating, email; on the right a status dropdown and the "Match Job" button.
// Long names wrap; the actions never shrink.
import { BriefcaseBusiness, Check, ChevronDown, ChevronRight, Star } from 'lucide-react'
import { PmAvatar } from '@/ds'
import { cx } from '@/lib/cx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { PersonProfile } from '@/mock/notes'

type Props = {
  person: PersonProfile
  statuses: string[]
  onStatusChange?: (status: string) => void
  onMatchJob?: () => void
  onBack?: () => void
}

export function ApplicantHeader({ person: p, statuses, onStatusChange, onMatchJob, onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <nav className="flex items-center gap-2 text-sm text-gray-600" aria-label="Breadcrumb">
        <BriefcaseBusiness size={18} className="shrink-0 text-gray-500" />
        <ChevronRight size={14} className="shrink-0 text-gray-400" />
        <button type="button" className="rounded-md px-1.5 py-1 hover:bg-gray-50 hover:text-gray-900" onClick={onBack}>{p.kind === 'applicant' ? 'Applicants' : 'Candidates'}</button>
        <ChevronRight size={14} className="shrink-0 text-gray-400" />
        <span className="min-w-0 truncate rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-700">{p.name}</span>
      </nav>

      <div className="flex items-center gap-4">
        <span className="shrink-0"><PmAvatar name={p.name} src={p.photo} size={64} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-semibold text-gray-900 [overflow-wrap:anywhere]">{p.name}</h1>
            <span className="flex shrink-0 items-center gap-0.5" aria-label={`${p.rating} of 5 stars`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} className={i <= p.rating ? 'fill-warning-500 text-warning-500' : 'fill-gray-200 text-gray-200'} />
              ))}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-gray-600">{p.email}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 focus-visible:shadow-focus">
                {p.status}<ChevronDown size={16} className="text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {statuses.map((s) => (
                <DropdownMenuItem key={s} className="text-sm text-gray-900" onSelect={() => onStatusChange?.(s)}>
                  {s}{s === p.status && <Check size={14} className="ml-auto text-gray-700" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button type="button" className={cx('flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-brand px-4 text-sm font-medium text-gray-900 shadow-xs hover:bg-brand-dark')} onClick={onMatchJob}>
            <BriefcaseBusiness size={16} />Match Job
          </button>
        </div>
      </div>
    </div>
  )
}
