// Test designs links: a candidate / applicant name opens version A (candidate profile + AI summary). There is no company
// version here yet (it moves to Company profile notes once the design is final), so a company name opens the real
// Company profile notes design.
import type { NoteTag } from '@/mock/inbox-types'

export const profileUrl = (kind: NoteTag['kind']) => (kind === 'company' ? '/d/notes-company-profile?v=A' : '/d/test-designs?v=A')
/** Conversations that have a profile version here: James Adam → A */
export const hasProfile = (id: string) => id === 'cv-james'
