'use client'
// Test designs — version A: copy of Notes in inbox A, AI note type: AI sets the type after posting; the author can change it. Copy lives in notes-inbox/ (parts + notes); changes here don't touch the real design.
import { NotesInbox } from './notes-inbox/parts/NotesInbox'

export default function VariantA() {
  return <NotesInbox noteTypes="ai" />
}
