'use client'
// Notes in profile — version C, Manual note type: dropdown next to Send. The prototype is parts/NotesProfile.tsx; the UI is in profile/ and notes/.
import { NotesProfile } from './parts/NotesProfile'

export default function VariantC() {
  return <NotesProfile noteTypes="manual" />
}
