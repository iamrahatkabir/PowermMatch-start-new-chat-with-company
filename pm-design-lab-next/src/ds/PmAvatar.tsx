import { cx } from '@/lib/cx'

const palettes = [
  'bg-gradient-to-br from-brand-light to-brand text-brand-text',
  'bg-gray-100 text-gray-700',
  'bg-success-50 text-success-700',
  'bg-info-50 text-info-700',
]

// Photo when `src` is set, otherwise initials on a palette picked from the name (or `palette` 0–3).
type Props = { name?: string; src?: string; size?: number; palette?: number; className?: string }

export function PmAvatar({ name, src, size = 40, palette, className }: Props) {
  if (src) {
    return <img src={src} width={size} height={size} alt="" className={cx('shrink-0 rounded-full object-cover', className)} style={{ width: size, height: size }} />
  }
  const initials = (name || '?').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const tone = palettes[palette ?? [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % palettes.length]
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full font-semibold', tone, className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >{initials}</span>
  )
}
