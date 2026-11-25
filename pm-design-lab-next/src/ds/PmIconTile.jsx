import { PmIcon } from './PmIcon'

export function PmIconTile({ icon, tone = 'brand', size = 40 }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${tone === 'brand' ? 'bg-brand-bg' : 'bg-gray-100'}`} style={{ width: size, height: size }}>
      <PmIcon name={icon} size={Math.round(size / 2)} />
    </span>
  )
}
