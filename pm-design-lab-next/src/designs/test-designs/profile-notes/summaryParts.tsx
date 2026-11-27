'use client'
// Small pieces every AI summary layout uses: title, type chips, Updated + refresh, loading lines, point meta.
import { RefreshCw } from 'lucide-react'
import { cx } from '@/lib/cx'
import { noteTypeLabel } from '@/designs/notes-inbox/notes/noteTypes'
import { AiMagicIcon } from './AiMagicIcon'
import type { NotesSummary, SummaryPoint } from './summary'

/** "AI Summary of latest 20 notes" (or "of 12 notes" when there are 20 or fewer) */
export const summaryTitle = (s: NotesSummary | null) =>
  `AI Summary${s ? ` of ${s.latestOnly ? 'latest ' : ''}${s.total} ${s.total === 1 ? 'note' : 'notes'}` : ''}`

/** AI icon + title */
export function SummaryTitle({ summary, className }: { summary: NotesSummary | null; className?: string }) {
  return (
    <span className={cx('flex shrink-0 items-center gap-2', className)}>
      <AiMagicIcon size={16} className="shrink-0 text-info-500" />
      <h3 className="text-sm font-semibold text-gray-900">{summaryTitle(summary)}</h3>
    </span>
  )
}

/** "Sales 7" "Payroll + CS 6" … (gray chips) */
export function TypeChips({ summary, className }: { summary: NotesSummary; className?: string }) {
  if (!summary.byType.length) return null
  return (
    <div className={cx('flex min-w-0 flex-wrap gap-1.5 text-xs', className)}>
      {summary.byType.map((t) => <span key={t.type} className="whitespace-nowrap rounded-md bg-gray-100 px-1.5 py-0.5 text-gray-700">{t.label} {t.count}</span>)}
    </div>
  )
}

/** "Updated just now" / "Updating…" + refresh icon button */
export function RefreshControl({ updating, ago, onRefresh, className }: { updating: boolean; ago: string; onRefresh: () => void; className?: string }) {
  return (
    <span className={cx('flex shrink-0 items-center gap-1', className)}>
      <span className="whitespace-nowrap text-xs text-gray-500" aria-live="polite">{updating ? 'Updating…' : `Updated ${ago}`}</span>
      <button
        type="button"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:text-gray-400"
        title="Refresh summary"
        aria-label="Refresh summary"
        disabled={updating}
        onClick={onRefresh}
      >
        <RefreshCw size={14} className={cx(updating && 'animate-spin')} />
      </button>
    </span>
  )
}

/** First summary still being made */
export function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
    </div>
  )
}

/** "Sales · Las Sabir, 27 Nov, 2026" (type left out with showType={false}) */
export function PointMeta({ p, showType = true, className }: { p: SummaryPoint; showType?: boolean; className?: string }) {
  return (
    <p className={cx('flex flex-wrap items-center gap-x-1.5 text-xs text-gray-500', className)}>
      {showType && p.type && <span>{noteTypeLabel(p.type)} ·</span>}
      <span className="min-w-0 truncate">{p.author}, {p.date}</span>
    </p>
  )
}
