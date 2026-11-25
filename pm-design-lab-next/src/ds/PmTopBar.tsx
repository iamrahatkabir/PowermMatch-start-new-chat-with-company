import type { ReactNode } from 'react'

export function PmTopBar({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
      <div className="ml-auto flex items-center gap-3">{actions}</div>
    </div>
  )
}
