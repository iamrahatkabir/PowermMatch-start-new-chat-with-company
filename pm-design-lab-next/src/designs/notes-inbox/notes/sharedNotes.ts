'use client'
// Tagged notes shared between the notes designs (prototype stand-in for the backend): a note saved in Notes in inbox
// or on a profile page that tags someone is stored here, so it also shows on that profile / conversation in the other
// designs. Kept in sessionStorage so it survives moving between designs and reloads in this tab.
import { useSyncExternalStore } from 'react'
import type { ThreadItem } from '@/mock/inbox-types'

/** A note with its tags (tags, originId) and a sortable ISO createdAt */
export type SharedNote = ThreadItem & { createdAt: string }

const KEY = 'pm-lab-shared-tagged-notes'
const EMPTY: SharedNote[] = []
let notes: SharedNote[] | null = null
const subs = new Set<() => void>()

function load(): SharedNote[] {
  if (notes) return notes
  try { notes = JSON.parse(sessionStorage.getItem(KEY) ?? '[]') as SharedNote[] } catch { notes = [] }
  return notes
}
function save(next: SharedNote[]) {
  notes = next
  try { sessionStorage.setItem(KEY, JSON.stringify(next)) } catch { /* storage off: still works until reload */ }
  subs.forEach((fn) => fn())
}

export const sharedNotes = {
  get: (): SharedNote[] => (typeof window === 'undefined' ? EMPTY : load()),
  has: (id: string) => sharedNotes.get().some((n) => n.id === id),
  subscribe(fn: () => void) { subs.add(fn); return () => { subs.delete(fn) } },
  /** Add or replace a note (a copy is stored) */
  upsert(n: SharedNote) { save([...load().filter((x) => x.id !== n.id), structuredClone(n)]) },
  remove(id: string) { if (sharedNotes.has(id)) save(load().filter((x) => x.id !== id)) },
}

export function useSharedNotes(): SharedNote[] {
  return useSyncExternalStore(sharedNotes.subscribe, sharedNotes.get, () => EMPTY)
}

/** Unique note id (counters reset on reload, stored notes don't) */
export const newNoteId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
