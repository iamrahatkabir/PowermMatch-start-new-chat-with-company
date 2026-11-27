'use client'
// Test designs — copy of Notes in inbox version B, AI note type v2: AI sets the type after posting (nothing to set while writing); the badge sits inside the note at the bottom right. Copy lives in notes-inbox/ (parts + notes); changes here don't touch the real design.
import { NotesInbox } from './notes-inbox/parts/NotesInbox'

export default function VariantB() {
  return <NotesInbox noteTypes="ai-top" />
}
