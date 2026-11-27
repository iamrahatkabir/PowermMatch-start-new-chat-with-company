'use client'
// Test designs — version C: copy of Notes in inbox C, Manual note type: agent picks the type from a dropdown before saving. Copy lives in notes-inbox/ (parts + notes); changes here don't touch the real design.
import { NotesInbox } from './notes-inbox/parts/NotesInbox'

export default function VariantC() {
  return <NotesInbox noteTypes="manual" />
}
