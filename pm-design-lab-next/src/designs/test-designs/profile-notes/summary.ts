// Fake "AI" summary of the newest 20 active notes on a profile (prototype stand-in for the real AI). Covers every note type in them: how many notes
// in all and per type, and up to 6 key points (the newest note of each type, then pinned notes), newest first.
import type { NoteType, ProfileNote } from '@/mock'
import { NOTE_TYPES } from '@/designs/notes-inbox/notes/noteTypes'

export type SummaryPoint = {
  id: string
  /** First sentence (max 140 characters) */
  text: string
  /** Longer point: whole sentences up to LONG_MAX characters, so it ends within 2 lines at 580px (Test designs B) */
  longText: string
  type: NoteType | null; pinned: boolean; author: string; date: string
}
export type NotesSummary = {
  /** Notes summarized: the newest LATEST active notes (title "AI Summary of latest 20 notes") */
  total: number
  /** More active notes exist than were summarized (title says "latest") */
  latestOnly: boolean
  /** Notes per type, most first (types with no notes left out) */
  byType: { type: NoteType; label: string; count: number }[]
  points: SummaryPoint[]
}

const MAX_POINTS = 6
/** How many of the newest active notes the summary reads */
export const LATEST = 20
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** '2026-11-27…' → '27 Nov, 2026' */
const dmy = (iso: string) => { const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return `${d} ${MONTHS[m - 1]}, ${y}` }
/** Whole note without colleague @mentions at the start ("@Las Sabir @Maja Holm Payroll…" → "Payroll…") or @ signs */
function cleanText(n: ProfileNote): string {
  // Only colleagues (who the note is addressed to); a tagged company / candidate at the start is the subject and stays
  const names = [...(n.mentions ?? [])].sort((a, b) => b.length - a.length)
  let text = n.text.replace(/\s+/g, ' ').trim()
  for (let lead = names.find((m) => text.startsWith(`@${m}`)); lead; lead = names.find((m) => text.startsWith(`@${m}`))) {
    const rest = text.slice(lead.length + 1).trim()
    if (!rest) break // the note is only mentions: keep them
    text = rest
  }
  return text.replace(/@/g, '')
}
/** Longer point: as many whole sentences as fit in LONG_MAX characters (always at least the first sentence) */
const LONG_MAX = 150
function longGist(n: ProfileNote): string {
  const sentences = cleanText(n).split(/(?<=[.!?])\s(?=[A-ZÆØÅ])/)
  let out = sentences[0]
  for (const s of sentences.slice(1)) {
    if (out.length + 1 + s.length > LONG_MAX) break
    out = `${out} ${s}`
  }
  return out
}
/** First sentence of cleanText, cut at 140 characters */
function gist(n: ProfileNote): string {
  const clean = cleanText(n)
  // A sentence ends at . ! ? followed by a capital letter (so "Reno Power ApS. asked…" isn't cut after ApS.)
  const first = clean.split(/(?<=[.!?])\s(?=[A-ZÆØÅ])/)[0]
  return first.length > 140 ? `${first.slice(0, 139).trimEnd()}…` : first
}

/** null when there are no active (not archived) notes: no summary is shown then */
export function summarizeNotes(all: ProfileNote[]): NotesSummary | null {
  const active = all.filter((n) => !n.archived).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (active.length === 0) return null
  // Only the newest LATEST notes are summarized
  const notes = active.slice(0, LATEST)

  const byType = NOTE_TYPES
    .map((t) => ({ type: t.key, label: t.label, count: notes.filter((n) => n.noteType === t.key).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)

  // Key points: the newest note of every type first (so all types are covered), then pinned notes, then the newest of
  // the rest; no repeated texts. Shown newest first.
  const picked: ProfileNote[] = []
  const seen = new Set<string>()
  const add = (n?: ProfileNote) => {
    if (!n || picked.length >= MAX_POINTS) return
    const key = gist(n).toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    picked.push(n)
  }
  byType.forEach((t) => add(notes.find((n) => n.noteType === t.type && !seen.has(gist(n).toLowerCase()))))
  notes.filter((n) => n.pinned).forEach(add)
  notes.forEach(add)
  picked.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return {
    total: notes.length,
    latestOnly: active.length > notes.length,
    byType,
    points: picked.map((n) => ({ id: n.id, text: gist(n), longText: longGist(n), type: n.noteType ?? null, pinned: !!n.pinned, author: n.author, date: dmy(n.createdAt) })),
  }
}
