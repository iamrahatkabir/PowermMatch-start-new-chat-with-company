'use client'
// State of an AI notes summary, shared by every summary layout (card A, alternatives B–E): the summary of the latest 20 active
// notes, "Updating…" while the fake AI works, regenerating when the notes change and on refresh, "Updated N min ago".
import { useEffect, useRef, useState } from 'react'
import type { ProfileNote } from '@/mock'
import { summarizeNotes, type NotesSummary } from './summary'

const THINK_MS = 1200 // how long the fake AI takes

export type AiSummaryState = {
  summary: NotesSummary | null
  updating: boolean
  /** "just now", "3 min ago", "2 h ago" */
  ago: string
  regenerate: () => void
  /** false when the profile has no active notes: show nothing */
  show: boolean
}

export function useAiSummary(notes: ProfileNote[]): AiSummaryState {
  // Only what the summary reads; a change here means "regenerate"
  const key = notes.filter((n) => !n.archived).map((n) => `${n.id}|${n.text}|${n.noteType ?? ''}|${n.pinned ? 1 : 0}|${n.unread ? 1 : 0}`).join('~')
  const [summary, setSummary] = useState<NotesSummary | null>(() => summarizeNotes(notes))
  const [updatedAt, setUpdatedAt] = useState(() => Date.now())
  const [updating, setUpdating] = useState(false)
  const [, tick] = useState(0)
  const latest = useRef(notes)
  latest.current = notes
  const first = useRef(true)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  function regenerate() {
    clearTimeout(timer.current)
    setUpdating(true)
    timer.current = setTimeout(() => {
      setSummary(summarizeNotes(latest.current))
      setUpdatedAt(Date.now())
      setUpdating(false)
    }, THINK_MS)
  }
  useEffect(() => {
    if (first.current) { first.current = false; return }
    regenerate()
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(timer.current), [])
  // Keeps "Updated 2 min ago" current
  useEffect(() => { const t = setInterval(() => tick((k) => k + 1), 30_000); return () => clearInterval(t) }, [])

  const mins = Math.floor((Date.now() - updatedAt) / 60_000)
  const ago = mins < 1 ? 'just now' : mins < 60 ? `${mins} min ago` : `${Math.floor(mins / 60)} h ago`
  const show = notes.some((n) => !n.archived) && (!!summary || updating)
  return { summary, updating, ago, regenerate, show }
}
