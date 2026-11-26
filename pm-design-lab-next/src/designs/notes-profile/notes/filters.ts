// Notes filters (type, author, date range): the filter shape, date presets, labels and applyFilters().
import type { NoteType } from '@/mock/inbox-types'

/** from / to are 'yyyy-mm-dd', both inclusive. preset is set when picked from the quick list. */
export type DateRange = { from: string; to: string; preset?: DatePreset }
export type NotesFilter = { types: NoteType[]; authors: string[]; date: DateRange | null }
export type DatePreset = 'today' | '7d' | '30d' | '3m' | 'year'

export const emptyFilter: NotesFilter = { types: [], authors: [], date: null }
export const isFiltered = (f: NotesFilter) => f.types.length > 0 || f.authors.length > 0 || f.date !== null

export const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '3m', label: 'Last 3 months' },
  { key: 'year', label: 'This year' },
]

/** Local date as 'yyyy-mm-dd' */
export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
/** 'yyyy-mm-dd' → local Date at midnight */
export const fromYmd = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }

export function presetRange(key: DatePreset, today = new Date()): DateRange {
  const start = new Date(today)
  if (key === '7d') start.setDate(start.getDate() - 6)
  if (key === '30d') start.setDate(start.getDate() - 29)
  if (key === '3m') start.setMonth(start.getMonth() - 3)
  if (key === 'year') start.setMonth(0, 1)
  return { from: ymd(start), to: ymd(today), preset: key }
}

/** dd.mm.yyyy (brand date format) */
const dmy = (s: string) => s.split('-').reverse().join('.')
export function dateLabel(r: DateRange): string {
  const preset = DATE_PRESETS.find((p) => p.key === r.preset)
  if (preset) return preset.label
  return r.from === r.to ? dmy(r.from) : `${dmy(r.from)} – ${dmy(r.to)}`
}

/** Notes need a type, an author and createdAt ('yyyy-mm-ddThh:mm' or ISO) */
export function applyFilters<T extends { noteType?: NoteType | null; author: string; createdAt: string }>(notes: T[], f: NotesFilter): T[] {
  return notes.filter((n) => {
    if (f.types.length && !(n.noteType && f.types.includes(n.noteType))) return false
    if (f.authors.length && !f.authors.includes(n.author)) return false
    if (f.date) {
      const day = ymd(new Date(n.createdAt))
      if (day < f.date.from || day > f.date.to) return false
    }
    return true
  })
}
