'use client'
// Notes in profile — version A, AI note type v2: AI sets the type after posting, badge at the bottom right of the note card. The prototype is parts/NotesProfile.tsx; the UI is in profile/ and notes/.
import { NotesProfile } from './parts/NotesProfile'

export default function VariantA() {
  return <NotesProfile noteTypes="ai-top" />
}
