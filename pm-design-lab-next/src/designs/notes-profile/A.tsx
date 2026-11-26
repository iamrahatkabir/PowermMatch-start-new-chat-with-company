'use client'
// Notes in profile — version A, AI note type: AI sets the type after posting, badge next to the time. The prototype is parts/NotesProfile.tsx; the UI is in profile/ and notes/.
import { NotesProfile } from './parts/NotesProfile'

export default function VariantA() {
  return <NotesProfile noteTypes="ai" />
}
