import { Building2 } from 'lucide-react'
import { PmAvatar } from '@/ds'
import { cx } from '@/lib/cx'

// type: company | contact | person (default)
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export function EntityAvatar({ type = 'person', name, photo, logo, size = 40, className }) {
  if (type === 'company') {
    return (
      <span
        className={cx('flex shrink-0 items-center justify-center rounded-full', logo === 'poly' ? 'bg-success-500 text-white' : 'border border-gray-200 bg-gray-50 text-gray-600', className)}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Building2 size={Math.round(size * 0.45)} />
      </span>
    )
  }
  if (type === 'contact') {
    return (
      <span
        className={cx('flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white font-medium text-gray-600', className)}
        style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.36)}px` }}
      >{initials(name)}</span>
    )
  }
  return <PmAvatar name={name} src={photo} size={size} className={className} />
}
