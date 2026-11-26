// Note types (Payroll + CS, Sales form, Screening, Sales) and a fake "AI" classifier for the prototype.
import type { NoteType } from '@/mock/inbox-types'

export type { NoteType }

export const NOTE_TYPES: { key: NoteType; label: string }[] = [
  { key: 'payroll-cs', label: 'Payroll + CS' },
  { key: 'sales-form', label: 'Sales form' },
  { key: 'screening', label: 'Screening' },
  { key: 'sales', label: 'Sales' },
]

export const noteTypeLabel = (t: NoteType): string => NOTE_TYPES.find((x) => x.key === t)?.label ?? t

// Stand-in for the real AI: first keyword match wins, Screening otherwise
const keywords: [NoteType, RegExp][] = [
  ['payroll-cs', /payroll|salary|wage|payslip|timesheet|hours|invoice|holiday|sick|pay\b/i],
  ['sales-form', /\bform\b|signed|sign up|signup|registration/i],
  ['sales', /client|company|deal|price|offer|meeting|hiring|order|contract/i],
]
export function guessNoteType(text: string): NoteType {
  return keywords.find(([, re]) => re.test(text))?.[0] ?? 'screening'
}
