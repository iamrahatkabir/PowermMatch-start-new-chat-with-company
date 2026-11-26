// Top of the internal company profile: breadcrumb (Team icon › Company › name), logo, name and source.
// Long names wrap; the logo falls back to a building icon.
import { Building2, ChevronRight, Users } from 'lucide-react'
import type { CompanyHeader as Header } from '@/mock/notes'

type Props = { company: Header; onBack?: () => void }

export function CompanyHeader({ company: c, onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <nav className="flex items-center gap-2 text-sm text-gray-600" aria-label="Breadcrumb">
        <Users size={18} className="shrink-0 text-gray-500" />
        <ChevronRight size={14} className="shrink-0 text-gray-400" />
        <button type="button" className="rounded-md px-1.5 py-1 hover:bg-gray-50 hover:text-gray-900" onClick={onBack}>Company</button>
        <ChevronRight size={14} className="shrink-0 text-gray-400" />
        <span className="min-w-0 truncate rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-700">{c.name}</span>
      </nav>
      <div className="flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-warning-50">
          {c.logo ? <img src={c.logo} alt="" className="size-9" /> : <Building2 size={28} className="text-gray-600" />}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-gray-900 [overflow-wrap:anywhere]">{c.name}</h1>
          <p className="mt-0.5 text-sm text-gray-600">Source: {c.source}</p>
        </div>
      </div>
    </div>
  )
}
