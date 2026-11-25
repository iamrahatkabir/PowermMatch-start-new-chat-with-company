import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

// Borders are always present — no shadow-only cards.
export function PmCard({ padding = 'p-5', className, children }: { padding?: string; className?: string; children?: ReactNode }) {
  return <div className={cx('rounded-2xl border border-gray-200 bg-white', padding, className)}>{children}</div>
}
