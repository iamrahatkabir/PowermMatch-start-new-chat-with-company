'use client'
// Test designs copy of notes-inbox/notes/sharedNotes.ts with its own storage key, so the Test designs profile (A–F) never mixes
// with the real designs. The first read in a browser tab fills it with SEED_NOTES (dummy notes).
import { useSyncExternalStore } from 'react'
import type { ThreadItem } from '@/mock/inbox-types'
import { SEED_NOTES } from './seedNotes'

/** A note with its tags (tags, originId) and a sortable ISO createdAt */
export type SharedNote = ThreadItem & { createdAt: string }

// v3: the dummy note texts changed (27.11.2026); a new key loads them again in tabs that had the old ones
const KEY = 'pm-lab-test-designs-notes-v3'
const EMPTY: SharedNote[] = []
let notes: SharedNote[] | null = null
const subs = new Set<() => void>()

function load(): SharedNote[] {
  if (notes) return notes
  try {
    const raw = sessionStorage.getItem(KEY)
    notes = raw === null ? structuredClone(SEED_NOTES) : (JSON.parse(raw) as SharedNote[])
    if (raw === null) sessionStorage.setItem(KEY, JSON.stringify(notes))
  } catch { notes = structuredClone(SEED_NOTES) }
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
