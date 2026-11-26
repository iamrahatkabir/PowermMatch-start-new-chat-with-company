'use client'
// Notes in inbox — version D, Manual note type v2: agent picks the type from four chips next to Save note. The prototype is parts/NotesInbox.tsx; the UI is in notes/.
import { NotesInbox } from './parts/NotesInbox'

export default function VariantD() {
  return <NotesInbox noteTypes="chips" />
}
