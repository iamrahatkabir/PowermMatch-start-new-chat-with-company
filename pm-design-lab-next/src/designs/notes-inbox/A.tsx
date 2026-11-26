'use client'
// Notes in inbox — version A, AI note type: AI sets the type after posting; the author can change it. The prototype is parts/NotesInbox.tsx; the UI is in notes/.
import { NotesInbox } from './parts/NotesInbox'

export default function VariantA() {
  return <NotesInbox noteTypes="ai" />
}
