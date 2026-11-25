import { cx } from '@/lib/cx'

// Controlled: value (active key) + onChange(key). tabs: [{ key, label, count? }]
export function PmTabs({ value, onChange, tabs }) {
  return (
    <div className="flex gap-6 overflow-x-auto border-b border-gray-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          className={cx('relative inline-flex items-center gap-1.5 whitespace-nowrap px-0.5 py-2.5 text-sm outline-none', t.key === value ? 'font-semibold text-gray-900' : 'font-medium text-gray-500 hover:text-gray-700')}
          onClick={() => onChange?.(t.key)}
        >
          {t.label}
          {t.count != null && (
            <span className={cx('rounded-full px-1.5 text-[11px] font-semibold leading-4', t.key === value ? 'bg-brand-bg text-brand-text' : 'bg-gray-100 text-gray-600')}>{t.count}</span>
          )}
          {t.key === value && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-brand" />}
        </button>
      ))}
    </div>
  )
}
