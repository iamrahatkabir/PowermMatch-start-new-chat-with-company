'use client'
import { Fragment, useState } from 'react'
import {
  Archive, Bell, Briefcase, Building2, CalendarDays, ChevronDown, CircleDollarSign, Clock, Contact, FilePen, Globe, Inbox, LayoutGrid,
  ListChecks, MessagesSquare, Network, PhoneForwarded, Receipt, Settings, Ticket, User, UserPlus, Users, Workflow,
} from 'lucide-react'
import { cx } from '@/lib/cx'

// `active` is any item key below (e.g. 'inbox-all', 'candidates', 'journeys').
// Clicking any item calls onSelect(key) so a design can switch what it shows.
// onExpand: a group was clicked while the nav is collapsed.
const nav = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  {
    key: 'inbox', label: 'Inbox', icon: Inbox, badge: 43, children: [
      { key: 'inbox-all', label: 'All', icon: MessagesSquare, badge: 10 },
      { key: 'inbox-support', label: 'Support', icon: Ticket },
      { key: 'inbox-upcoming', label: 'Upcoming', icon: CalendarDays },
      { key: 'inbox-communication', label: 'Communication', icon: Contact },
      { key: 'inbox-archive', label: 'Archive', icon: Archive },
      { key: 'inbox-notifications', label: 'Notification settings', icon: Bell },
    ],
  },
  { key: 'interviews', label: 'Job Interviews', icon: CalendarDays },
  { key: 'time', label: 'Time Tracking', icon: Clock },
  { key: 'payroll', label: 'Payroll', icon: CircleDollarSign },
  { key: 'contracts', label: 'Contracts', icon: FilePen },
  { key: 'invoicing', label: 'Invoicing', icon: Receipt },
  {
    key: 'team', label: 'Team', icon: Users, children: [
      { key: 'candidates', label: 'Candidates', icon: User },
      { key: 'companies', label: 'Companies', icon: Building2 },
    ],
  },
  {
    key: 'jobs', label: 'Jobs', icon: Briefcase, children: [
      { key: 'jobs-all', label: 'All Jobs', icon: ListChecks },
      { key: 'jobs-applicants', label: 'Applicants', icon: UserPlus },
    ],
  },
  {
    key: 'power-journey', label: 'Power journey', icon: Network, children: [
      { key: 'journeys', label: 'Journeys', icon: Workflow },
      { key: 'numbers', label: 'Numbers', icon: PhoneForwarded },
    ],
  },
  { key: 'career-page', label: 'Career page', icon: Globe },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export function PmSidebar({ active, collapsed, onSelect, onExpand }) {
  // Inbox and Power journey start open (as in the product), plus whichever group holds the active page.
  const [open, setOpen] = useState(() => {
    const o = { inbox: true, 'power-journey': true }
    for (const g of nav) if (g.children?.some((c) => c.key === active)) o[g.key] = true
    return o
  })
  const toggle = (key, value) => setOpen((o) => ({ ...o, [key]: value ?? !o[key] }))

  function click(item) {
    if (!item.children) onSelect?.(item.key)
    else if (collapsed) (toggle(item.key, true), onExpand?.())
    else toggle(item.key)
  }

  return (
    <aside className={cx('hidden shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white px-3 py-4 transition-[width] duration-200 ease-pm lg:flex', collapsed ? 'w-[72px]' : 'w-60')}>
      {nav.map((item) => {
        const Icon = item.icon
        return (
          <Fragment key={item.key}>
            <button
              type="button"
              className={cx('relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50', item.key === active && 'bg-gray-100 text-gray-900', collapsed && 'justify-center')}
              title={collapsed ? item.label : undefined}
              onClick={() => click(item)}
            >
              <Icon size={20} className="shrink-0 text-gray-600" />
              {!collapsed ? (
                <>
                  <span>{item.label}</span>
                  {item.children && <ChevronDown size={16} className={cx('shrink-0 text-gray-500 transition-transform', open[item.key] && 'rotate-180')} />}
                  {item.badge && <span className="ml-auto rounded-full bg-error-50 px-2 text-xs font-medium leading-5 text-error-500">{item.badge}</span>}
                </>
              ) : item.badge ? <span className="absolute right-2 top-2 size-2 rounded-full bg-error-500" /> : null}
            </button>
            {item.children && open[item.key] && !collapsed && (
              <div className="mb-1 ml-5 flex flex-col gap-0.5 border-l border-gray-200 pl-2">
                {item.children.map((c) => {
                  const CIcon = c.icon
                  return (
                    <button
                      key={c.key}
                      type="button"
                      className={cx('flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50', c.key === active && 'bg-gray-100 text-gray-900')}
                      onClick={() => onSelect?.(c.key)}
                    >
                      <CIcon size={18} className="shrink-0 text-gray-600" />
                      <span className="truncate">{c.label}</span>
                      {c.badge && <span className="ml-auto rounded-full bg-error-50 px-2 text-xs font-medium leading-5 text-error-500">{c.badge}</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </Fragment>
        )
      })}
    </aside>
  )
}
