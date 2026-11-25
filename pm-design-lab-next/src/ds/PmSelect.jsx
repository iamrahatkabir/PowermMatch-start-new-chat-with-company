// Controlled: value + onChange(value). options: [{ value, label }]
export function PmSelect({ value, onChange, label, options }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <span className="relative rounded-lg border border-gray-300 bg-white transition-shadow duration-150 focus-within:shadow-focus">
        <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className="input-text w-full appearance-none bg-transparent py-2.5 pl-3 pr-9 text-sm text-gray-900 outline-none">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  )
}
