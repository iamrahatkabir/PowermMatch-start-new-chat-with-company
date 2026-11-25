import { cx } from '@/lib/cx'

// Controlled: value + onChange(value). prefix / suffix are nodes shown inside the field.
export function PmInput({ value, onChange, label, placeholder, type = 'text', error, hint, prefix, suffix }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <span className={cx('flex items-center gap-2 rounded-lg border bg-white px-3 transition-shadow duration-150 focus-within:shadow-focus', error ? 'border-error-500' : 'border-gray-300')}>
        {prefix}
        <input
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
          type={type}
          placeholder={placeholder}
          className="input-text min-w-0 flex-1 bg-transparent py-2.5 text-sm text-gray-900 outline-none"
        />
        {suffix}
      </span>
      {error ? <span className="text-xs text-error-700">{error}</span> : hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
    </label>
  )
}
