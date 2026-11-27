'use client'
// Five alternative AI summary layouts (Test designs B–F), same information as the card (A): AI icon + "AI Summary of
// latest 20 notes", notes per type, up to 6 key points (type, author, date), Updated + refresh, "Updating…" when notes
// change, hidden with no notes. All use useAiSummary + summaryParts.
//   B collapsible — card with all key points (longer, up to 2 lines each), folds away to the title line
//   C by-type     — key points grouped in one box per note type (2 columns)
//   D callout     — light yellow brand callout, numbered points
//   E timeline    — points on a timeline, date on the left
//   F split       — left: title, refresh and a bar per type; right: the points
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ProfileNote } from '@/mock'
import { cx } from '@/lib/cx'
import { AiNotesSummary } from './AiNotesSummary'
import { useAiSummary } from './useAiSummary'
import { PointMeta, RefreshControl, SummarySkeleton, SummaryTitle, TypeChips } from './summaryParts'

export type SummaryVariant = 'card' | 'collapsible' | 'by-type' | 'callout' | 'timeline' | 'split'
type P = { notes: ProfileNote[]; subject: string }

/** Picks the layout */
export function AiSummary({ variant = 'card', ...p }: P & { variant?: SummaryVariant }) {
  if (variant === 'collapsible') return <CollapsibleSummary {...p} />
  if (variant === 'by-type') return <ByTypeSummary {...p} />
  if (variant === 'callout') return <CalloutSummary {...p} />
  if (variant === 'timeline') return <TimelineSummary {...p} />
  if (variant === 'split') return <SplitSummary {...p} />
  return <AiNotesSummary {...p} />
}

const dim = (updating: boolean) => cx('transition-opacity', updating && 'opacity-50')

// B — Collapsible: all key points (up to 6, no Show more); the chevron folds the card to its title line
function CollapsibleSummary({ notes, subject }: P) {
  const s = useAiSummary(notes)
  const [open, setOpen] = useState(true)
  if (!s.show) return null
  const shown = s.summary?.points ?? []
  return (
    <section aria-label={`AI summary of the notes on ${subject}`} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <SummaryTitle summary={s.summary} />
        {s.summary && <TypeChips summary={s.summary} className={dim(s.updating)} />}
        <RefreshControl updating={s.updating} ago={s.ago} onRefresh={s.regenerate} className="ml-auto" />
        <button type="button" className="flex size-7 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900" aria-expanded={open} title={open ? 'Hide summary' : 'Show summary'} onClick={() => setOpen((o) => !o)}>
          <ChevronDown size={16} className={cx('transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      {open && (
        <div className={cx('mt-3', dim(s.updating))}>
          {!s.summary ? <SummarySkeleton /> : (
              <ul className="flex flex-col gap-4" aria-label="Key points">
                {shown.map((p) => (
                  <li key={p.id} className="flex items-baseline gap-3 text-sm">
                    <span className="size-1 shrink-0 -translate-y-0.5 rounded-full bg-gray-400" aria-hidden />
                    {/* Longer points here: whole sentences (summary.ts longGist) in a fixed 580px column, ending within 2 lines; no "…" */}
                    <span className="w-[580px] min-w-0 shrink text-gray-700 [overflow-wrap:anywhere]">{p.longText}</span>
                    <PointMeta p={p} className="ml-auto shrink-0 flex-nowrap" />
                  </li>
                ))}
              </ul>
          )}
        </div>
      )}
    </section>
  )
}

// C — By type: one box per note type ("Sales · 7 notes") with that type's key points
function ByTypeSummary({ notes, subject }: P) {
  const s = useAiSummary(notes)
  if (!s.show) return null
  return (
    <section aria-label={`AI summary of the notes on ${subject}`} className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <SummaryTitle summary={s.summary} />
        <RefreshControl updating={s.updating} ago={s.ago} onRefresh={s.regenerate} className="ml-auto" />
      </div>
      <div className={cx('mt-3', dim(s.updating))}>
        {!s.summary ? <SummarySkeleton /> : (
          <div className="grid grid-cols-2 gap-3">
            {s.summary.byType.map((t) => {
              const pts = s.summary!.points.filter((p) => p.type === t.type)
              return (
                <div key={t.type} className="min-w-0 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-900">{t.label}</span>
                    <span className="whitespace-nowrap text-xs text-gray-500">{t.count} {t.count === 1 ? 'note' : 'notes'}</span>
                  </div>
                  {pts.length === 0 ? <p className="mt-2 text-xs text-gray-500">Nothing important in the latest notes</p> : (
                    <ul className="mt-2 flex flex-col gap-3">
                      {pts.map((p) => (
                        <li key={p.id} className="text-sm text-gray-700">
                          <p className="[overflow-wrap:anywhere]">{p.text}</p>
                          <PointMeta p={p} showType={false} className="mt-0.5" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// D — Callout: light yellow brand box, numbered points, meta on the right
function CalloutSummary({ notes, subject }: P) {
  const s = useAiSummary(notes)
  if (!s.show) return null
  return (
    <section aria-label={`AI summary of the notes on ${subject}`} className="rounded-xl border border-brand-light bg-brand-bg p-4">
      <div className="flex items-center gap-2">
        <SummaryTitle summary={s.summary} />
        <RefreshControl updating={s.updating} ago={s.ago} onRefresh={s.regenerate} className="ml-auto" />
      </div>
      {s.summary && <TypeChips summary={s.summary} className={cx('mt-2 [&>span]:bg-white', dim(s.updating))} />}
      <div className={cx('mt-3', dim(s.updating))}>
        {!s.summary ? <SummarySkeleton /> : (
          <ol className="flex flex-col divide-y divide-brand-light" aria-label="Key points">
            {s.summary.points.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
                <span className="w-4 shrink-0 text-xs font-semibold text-brand-text">{i + 1}</span>
                <span className="min-w-0 flex-1 text-gray-900 [overflow-wrap:anywhere]">{p.text}</span>
                <PointMeta p={p} className="shrink-0 flex-nowrap" />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

// E — Timeline: date column on the left, dot + line, point with type chip and author
function TimelineSummary({ notes, subject }: P) {
  const s = useAiSummary(notes)
  if (!s.show) return null
  return (
    <section aria-label={`AI summary of the notes on ${subject}`} className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <SummaryTitle summary={s.summary} />
        {s.summary && <TypeChips summary={s.summary} className={dim(s.updating)} />}
        <RefreshControl updating={s.updating} ago={s.ago} onRefresh={s.regenerate} className="ml-auto" />
      </div>
      <div className={cx('mt-4', dim(s.updating))}>
        {!s.summary ? <SummarySkeleton /> : (
          <ol aria-label="Key points">
            {s.summary.points.map((p, i, arr) => (
              <li key={p.id} className="grid grid-cols-[96px_16px_1fr] gap-x-2">
                <span className="whitespace-nowrap pt-px text-xs text-gray-500">{p.date}</span>
                <span className="relative flex justify-center">
                  <span className="relative z-10 mt-1.5 size-2 rounded-full bg-info-500 ring-4 ring-white" />
                  {i < arr.length - 1 && <span className="absolute bottom-0 top-2 w-px bg-gray-300" />}
                </span>
                <div className={cx('min-w-0', i < arr.length - 1 && 'pb-4')}>
                  <p className="text-sm text-gray-700 [overflow-wrap:anywhere]">{p.text}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                    {p.type && <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-gray-700">{s.summary!.byType.find((t) => t.type === p.type)?.label}</span>}
                    <span className="min-w-0 truncate">{p.author}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

// F — Split: left column (title, refresh, one bar per type), right column (key points with dividers)
function SplitSummary({ notes, subject }: P) {
  const s = useAiSummary(notes)
  if (!s.show) return null
  const max = Math.max(1, ...(s.summary?.byType.map((t) => t.count) ?? [1]))
  return (
    <section aria-label={`AI summary of the notes on ${subject}`} className="grid grid-cols-[240px_1fr] overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-4 border-r border-gray-200 bg-gray-50 p-4">
        <SummaryTitle summary={s.summary} className="items-start [&>h3]:leading-5" />
        {s.summary && (
          <ul className={cx('flex flex-col gap-2.5', dim(s.updating))} aria-label="Notes per type">
            {s.summary.byType.map((t) => (
              <li key={t.type} className="text-xs">
                <div className="flex justify-between gap-2"><span className="text-gray-700">{t.label}</span><span className="text-gray-500">{t.count}</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-info-500" style={{ width: `${(t.count / max) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        )}
        <RefreshControl updating={s.updating} ago={s.ago} onRefresh={s.regenerate} className="mt-auto -ml-0.5" />
      </div>
      <div className={cx('min-w-0 p-4', dim(s.updating))}>
        {!s.summary ? <SummarySkeleton /> : (
          <ul className="flex flex-col divide-y divide-gray-100" aria-label="Key points">
            {s.summary.points.map((p) => (
              <li key={p.id} className="py-2.5 first:pt-0 last:pb-0">
                <p className="text-sm text-gray-700 [overflow-wrap:anywhere]">{p.text}</p>
                <PointMeta p={p} className="mt-0.5" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
