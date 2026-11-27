'use client'
// Test designs — copy of Notes in inbox version D, Manual note type v2: agent picks the type from four chips next to Save note. Copy lives in notes-inbox/ (parts + notes); changes here don't touch the real design.
import { NotesInbox } from './notes-inbox/parts/NotesInbox'

export default function VariantD() {
  return <NotesInbox noteTypes="chips" />
}
