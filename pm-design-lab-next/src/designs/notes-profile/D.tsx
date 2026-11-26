'use client'
// Notes in profile — version D, Manual note type v2: four type chips next to Send. The prototype is parts/NotesProfile.tsx; the UI is in profile/ and notes/.
import { NotesProfile } from './parts/NotesProfile'

export default function VariantD() {
  return <NotesProfile noteTypes="chips" />
}
