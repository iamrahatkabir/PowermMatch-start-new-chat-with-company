'use client'
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { PmInput } from '@/ds'

export type MenuShellProps = {
  value?: string
  onChange?: (query: string) => void
  placeholder?: string
  belowSearch?: ReactNode
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
  children?: ReactNode
}

// Popover frame shared by every menu variant: title, search field, scrollable body.
// value + onChange(query) = the search text · belowSearch = node under the search field · onKeyDown on the frame
export function MenuShell({ value = '', onChange, placeholder = 'Search contact persons, candidates, companies', belowSearch, onKeyDown, children }: MenuShellProps) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => root.current!.querySelector('input')?.focus(), [])
  return (
    <div ref={root} className="absolute inset-x-2 top-14 z-30 flex max-h-[min(640px,calc(100vh-140px))] flex-col rounded-2xl border border-gray-200 bg-white shadow-xl" onKeyDown={onKeyDown}>
      <div className="p-4 pb-2">
        <div className="mb-3 text-sm font-semibold text-gray-900">Start new conversation</div>
        <PmInput value={value} onChange={onChange} placeholder={placeholder} />
        {belowSearch}
      </div>
      <div className="overflow-y-auto px-2 pb-2">{children}</div>
    </div>
  )
}
