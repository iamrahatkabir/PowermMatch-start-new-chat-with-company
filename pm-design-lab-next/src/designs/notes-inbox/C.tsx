'use client'
// Notes in inbox — version C, Manual note type: agent picks the type from a dropdown before saving. The prototype is parts/NotesInbox.tsx; the UI is in notes/.
import { NotesInbox } from './parts/NotesInbox'

export default function VariantC() {
  return <NotesInbox noteTypes="manual" />
}
