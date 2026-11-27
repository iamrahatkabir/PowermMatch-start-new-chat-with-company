'use client'
// AI summary card at the top of a profile's Notes (Test designs A): AI icon + "AI Summary of latest 20 notes" + type
// chips on one line, Updated + refresh on the right, then the key points. Regenerates ("Updating…") when the active
// notes change and on refresh; not shown when the profile has no active notes. State: useAiSummary; fake AI: summary.ts.
import type { ProfileNote } from '@/mock'
import { cx } from '@/lib/cx'
import { useAiSummary } from './useAiSummary'
import { PointMeta, RefreshControl, SummarySkeleton, SummaryTitle, TypeChips } from './summaryParts'

export function AiNotesSummary({ notes, subject }: { notes: ProfileNote[]; subject: string }) {
  const { summary, updating, ago, regenerate, show } = useAiSummary(notes)
  if (!show) return null
  return (
    <section aria-label={`AI summary of the notes on ${subject}`} className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <SummaryTitle summary={summary} />
        {summary && <TypeChips summary={summary} className={cx('transition-opacity', updating && 'opacity-50')} />}
        <RefreshControl updating={updating} ago={ago} onRefresh={regenerate} className="ml-auto" />
      </div>
      <div className={cx('mt-3 transition-opacity', updating && 'opacity-50')}>
        {!summary ? <SummarySkeleton /> : (
          <ul className="flex flex-col gap-4" aria-label="Key points">
            {summary.points.map((p) => (
              <li key={p.id} className="flex gap-2 text-sm text-gray-700">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-gray-400" />
                <div className="min-w-0">
                  <p className="[overflow-wrap:anywhere]">{p.text}</p>
                  <PointMeta p={p} className="mt-0.5" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
