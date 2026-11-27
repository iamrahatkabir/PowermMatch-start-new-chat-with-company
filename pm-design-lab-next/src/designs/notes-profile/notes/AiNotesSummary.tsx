'use client'
// AI summary at the top of a profile's Notes (Notes in profile, Applicant/Candidate profile notes, Company profile notes).
// Chosen from Test designs (version B "Collapsible", 27.11.2026):
//   one line: AI icon + "AI Summary of latest 20 notes" + notes-per-type chips … "Updated just now" + refresh + fold arrow
//   below: all key points (up to 6), bulleted, 16px apart; each point is whole sentences (~150 characters, ends within
//   2 lines, no "…") in a fixed 580px column, with type · author, date at the right.
// Regenerates ("Updating…") when the active notes change (add, edit, delete, archive, type change) and on refresh; not
// shown when the profile has no active notes. State: useAiSummary; the fake AI: aiSummary.ts.
import { useState } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import type { ProfileNote } from '@/mock'
import { cx } from '@/lib/cx'
import { noteTypeLabel } from '@/designs/notes-inbox/notes/noteTypes'
import { AiMagicIcon } from './AiMagicIcon'
import { useAiSummary } from './useAiSummary'
import type { NotesSummary } from './aiSummary'

/** "AI Summary of latest 20 notes" (or "of 12 notes" when there are 20 or fewer) */
const title = (s: NotesSummary | null) =>
  `AI Summary${s ? ` of ${s.latestOnly ? 'latest ' : ''}${s.total} ${s.total === 1 ? 'note' : 'notes'}` : ''}`

export function AiNotesSummary({ notes, subject }: { notes: ProfileNote[]; subject: string }) {
  const { summary, updating, ago, regenerate, show } = useAiSummary(notes)
  const [open, setOpen] = useState(true)
  if (!show) return null
  const dim = cx('transition-opacity', updating && 'opacity-50')
  return (
    <section aria-label={`AI summary of the notes on ${subject}`} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <AiMagicIcon size={16} className="shrink-0 text-info-500" />
        <h3 className="shrink-0 text-sm font-semibold text-gray-900">{title(summary)}</h3>
        {summary && summary.byType.length > 0 && (
          <div className={cx('flex min-w-0 flex-wrap gap-1.5 text-xs', dim)}>
            {summary.byType.map((t) => <span key={t.type} className="whitespace-nowrap rounded-md bg-gray-100 px-1.5 py-0.5 text-gray-700">{t.label} {t.count}</span>)}
          </div>
        )}
        <span className="ml-auto whitespace-nowrap text-xs text-gray-500" aria-live="polite">{updating ? 'Updating…' : `Updated ${ago}`}</span>
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:text-gray-400"
          title="Refresh summary"
          aria-label="Refresh summary"
          disabled={updating}
          onClick={regenerate}
        >
          <RefreshCw size={14} className={cx(updating && 'animate-spin')} />
        </button>
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          aria-expanded={open}
          title={open ? 'Hide summary' : 'Show summary'}
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown size={16} className={cx('transition-transform', open && 'rotate-180')} />
        </button>
      </div>

      {open && (
        <div className={cx('mt-3', dim)}>
          {!summary ? (
            // First summary still being made (e.g. the first note was just added)
            <div className="flex flex-col gap-2" aria-hidden>
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          ) : (
            <ul className="flex flex-col gap-4" aria-label="Key points">
              {summary.points.map((p) => (
                <li key={p.id} className="flex items-baseline gap-3 text-sm">
                  <span className="size-1 shrink-0 -translate-y-0.5 rounded-full bg-gray-400" aria-hidden />
                  <span className="w-[580px] min-w-0 shrink text-gray-700 [overflow-wrap:anywhere]">{p.longText}</span>
                  <p className="ml-auto flex shrink-0 items-center gap-x-1.5 whitespace-nowrap text-xs text-gray-500">
                    {p.type && <span>{noteTypeLabel(p.type)} ·</span>}
                    <span>{p.author}, {p.date}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
