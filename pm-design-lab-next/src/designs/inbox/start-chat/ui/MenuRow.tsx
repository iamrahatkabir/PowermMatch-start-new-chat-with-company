import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { EntityAvatar, type Entity } from './EntityAvatar'
import { Highlight } from './Highlight'

// One result row. `entity` = { type, name, photo?, logo? }; `subtitle` is highlighted too.
export type MenuRowProps = {
  entity: Entity
  subtitle?: string
  query?: string
  chevron?: boolean
  active?: boolean
  avatar?: ReactNode
  end?: ReactNode
  className?: string
  onClick?: () => void
  onMouseEnter?: () => void
}

// `avatar` replaces the avatar, `end` is shown before the chevron (nodes).
export function MenuRow({ entity, subtitle, query = '', chevron, active, avatar, end, className, onClick, onMouseEnter }: MenuRowProps) {
  return (
    <button type="button" className={cx('flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-50', active && 'bg-gray-50', className)} onClick={onClick} onMouseEnter={onMouseEnter}>
      {avatar ?? <EntityAvatar {...entity} size={36} />}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-900"><Highlight text={entity.name} query={query} /></span>
        {subtitle && <span className="block truncate text-xs text-gray-500"><Highlight text={subtitle} query={query} /></span>}
      </span>
      {end}
      {chevron && <ChevronRight size={16} className="shrink-0 text-gray-400" />}
    </button>
  )
}
