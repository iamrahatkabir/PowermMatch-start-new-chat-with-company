import { Bell, ChevronDown, ChevronLeft } from 'lucide-react'
import { cx } from '@/lib/cx'
import { PmAvatar } from './PmAvatar'

// Top header. collapsed + onCollapsedChange(boolean) control the nav width toggle.
export function PmAppHeader({ collapsed = false, onCollapsedChange }: { collapsed?: boolean; onCollapsedChange?: (collapsed: boolean) => void }) {
  return (
    <header className="relative flex h-16 shrink-0 items-center border-b border-gray-200 bg-white pr-6">
      <div className={cx('flex h-full items-center px-5 transition-[width] duration-200 ease-pm', collapsed ? 'w-[72px]' : 'w-60')}>
        {collapsed
          ? <img src="/brand/logo-symbol.svg" alt="powermatch" className="h-6 w-auto" />
          : <img src="/brand/logo-mark.svg" alt="powermatch" className="h-5 w-auto" />}
      </div>
      <button
        type="button"
        className={cx('absolute top-1/2 hidden size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:text-gray-900 lg:flex', collapsed ? 'left-[72px]' : 'left-60')}
        title={collapsed ? 'Expand menu' : 'Collapse menu'}
        onClick={() => onCollapsedChange?.(!collapsed)}
      >
        <ChevronLeft size={16} className={cx(collapsed && 'rotate-180')} />
      </button>
      <div className="ml-auto flex items-center gap-5">
        <button type="button" className="text-gray-600 hover:text-gray-900" title="Notifications"><Bell size={20} /></button>
        <button type="button" className="flex items-center gap-2.5 text-sm text-gray-900">
          <PmAvatar name="Las Sabir" src="https://randomuser.me/api/portraits/men/75.jpg" size={32} />
          <span className="hidden sm:inline">Las Sabir</span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>
    </header>
  )
}
