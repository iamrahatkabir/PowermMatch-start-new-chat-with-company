import { PmIconTile } from './PmIconTile'

export function PmSectionHeader({ icon, title, subtitle, actions }) {
  return (
    <div className="flex items-center gap-3">
      {icon && <PmIconTile icon={icon} />}
      <div className="flex flex-col gap-0.5">
        <div className="text-base font-semibold text-gray-700">{title}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      <div className="ml-auto">{actions}</div>
    </div>
  )
}
