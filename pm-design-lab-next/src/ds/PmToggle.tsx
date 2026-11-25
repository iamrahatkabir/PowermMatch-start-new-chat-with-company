import { cx } from '@/lib/cx'

// On/off switch. Yellow when on. Controlled: checked + onChange(boolean). label = accessible name.
export function PmToggle({ checked = false, onChange, label }: { checked?: boolean; onChange?: (checked: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cx('relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:shadow-focus', checked ? 'bg-brand' : 'bg-gray-200')}
      onClick={() => onChange?.(!checked)}
    >
      <span className={cx('inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-150', checked ? 'translate-x-[18px]' : 'translate-x-0.5')} />
    </button>
  )
}
