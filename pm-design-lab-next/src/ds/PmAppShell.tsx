'use client'
import { useState, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { PmAppHeader } from './PmAppHeader'
import { PmSidebar } from './PmSidebar'
import { PmTopBar } from './PmTopBar'

// Product chrome: top header + grouped left nav + main area.
// `title` adds a page title bar (`actions` = nodes on its right); `flush` removes main padding for
// full-height screens (inbox, chat); `navCollapsed` starts the nav as icons only.
// onNav(key): a nav item was clicked. `className` is added to the outer element (e.g. to change its height).
type Props = {
  title?: string
  subtitle?: string
  actions?: ReactNode
  active?: string
  flush?: boolean
  navCollapsed?: boolean
  onNav?: (key: string) => void
  className?: string
  children?: ReactNode
}

export function PmAppShell({ title, subtitle, actions, active, flush, navCollapsed = false, onNav, className, children }: Props) {
  const [collapsed, setCollapsed] = useState(navCollapsed)
  return (
    <div className={cx('flex h-screen flex-col bg-white', className)}>
      <PmAppHeader collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div className="flex min-h-0 flex-1">
        <PmSidebar active={active} collapsed={collapsed} onSelect={onNav} onExpand={() => setCollapsed(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-gray-50">
          {title && <PmTopBar title={title} subtitle={subtitle} actions={actions} />}
          <main className={cx('min-h-0 flex-1', !flush && 'p-4 sm:p-8')}>{children}</main>
        </div>
      </div>
    </div>
  )
}
