// Notes filters (type, author, date range): the filter shape, date label and applyFilters().
import type { NoteType } from '@/mock/inbox-types'

/** from / to are 'yyyy-mm-dd', both inclusive (picked on the range calendar; no quick presets) */
export type DateRange = { from: string; to: string }
export type NotesFilter = { types: NoteType[]; authors: string[]; date: DateRange | null }

export const emptyFilter: NotesFilter = { types: [], authors: [], date: null }
export const isFiltered = (f: NotesFilter) => f.types.length > 0 || f.authors.length > 0 || f.date !== null

/** Local date as 'yyyy-mm-dd' */
export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
/** 'yyyy-mm-dd' → local Date at midnight */
export const fromYmd = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }

/** dd.mm.yyyy (brand date format) */
const dmy = (s: string) => s.split('-').reverse().join('.')
export function dateLabel(r: DateRange): string {
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
