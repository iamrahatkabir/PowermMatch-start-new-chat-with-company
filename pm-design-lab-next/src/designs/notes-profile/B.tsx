'use client'
// Notes in profile — version B, AI note type v2: same, badge at the bottom right of the note card. The prototype is parts/NotesProfile.tsx; the UI is in profile/ and notes/.
import { NotesProfile } from './parts/NotesProfile'

export default function VariantB() {
  return <NotesProfile noteTypes="ai-top" />
}
