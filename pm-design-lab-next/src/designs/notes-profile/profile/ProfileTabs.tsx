'use client'
// Tabs under the company header: label + optional count chip; the active tab has a dark underline.
import { cx } from '@/lib/cx'

export type ProfileTab = { key: string; label: string; count?: number }
type Props = { tabs: ProfileTab[]; value: string; onChange: (key: string) => void }

export function ProfileTabs({ tabs, value, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gray-200 px-5">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          className={cx('-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 pb-3 pt-1 text-base', t.key === value ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900')}
          onClick={() => onChange(t.key)}
        >
          {t.label}
          {t.count !== undefined && <span className="rounded-full border border-gray-200 bg-white px-1.5 text-xs font-medium tabular-nums text-gray-700">{t.count > 99 ? '99+' : t.count}</span>}
        </button>
      ))}
    </div>
  )
}
