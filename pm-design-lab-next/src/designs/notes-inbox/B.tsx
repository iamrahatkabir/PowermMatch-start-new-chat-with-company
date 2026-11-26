'use client'
// Notes in inbox — version B, AI note type v2: AI sets the type after posting (nothing to set while writing); the badge sits inside the note at the bottom right. The prototype is parts/NotesInbox.tsx; the UI is in notes/.
import { NotesInbox } from './parts/NotesInbox'

export default function VariantB() {
  return <NotesInbox noteTypes="ai-top" />
}
