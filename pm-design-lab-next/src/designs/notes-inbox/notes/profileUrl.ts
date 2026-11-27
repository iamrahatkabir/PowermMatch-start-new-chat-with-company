// Where a tagged company / candidate / applicant name opens: the profile notes designs
// (company → Company profile notes, candidate / applicant → Applicant/Candidate profile notes).
import type { NoteTag } from '@/mock/inbox-types'

export const profileUrl = (kind: NoteTag['kind']) => (kind === 'company' ? '/d/notes-company-profile?v=A' : '/d/notes-candidate-profile?v=A')
