'use client'
// Test designs — copy of Notes in inbox version A, AI note type: AI sets the type after posting; the author can change it. Copy lives in notes-inbox/ (parts + notes); changes here don't touch the real design.
import { NotesInbox } from './notes-inbox/parts/NotesInbox'

export default function VariantA() {
  return <NotesInbox noteTypes="ai" />
}
