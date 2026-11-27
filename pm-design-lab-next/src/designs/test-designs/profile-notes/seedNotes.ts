// Dummy notes for Test designs, as if written in the inbox (James Adam's and Reno Power ApS.'s chats, one in Poly
// Corporation's): the ones in James Adam's chat or tagging him show on the candidate profile (A–F), where the AI summary
// covers them. Loaded into the test note store the first time it's read in a browser tab (see sharedNotes.ts).
import { agents, noteColleagues } from '@/mock'
import type { NoteTag, NoteType } from '@/mock'
import type { SharedNote } from './sharedNotes'

const person = (name: string) => [...agents, ...noteColleagues].find((a) => a.name === name)
const james: NoteTag = { id: 'cv-james', name: 'James Adam', kind: 'candidate', photo: 'https://randomuser.me/api/portraits/men/32.jpg' }
const reno: NoteTag = { id: 'cv-ancorless', name: 'Reno Power ApS.', kind: 'company' }

/** createdAt 'yyyy-mm-ddThh:mm' → inbox label '25 Nov 14:32' */
const label = (iso: string) => {
  const d = new Date(iso)
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${iso.slice(11, 16)}`
}
let n = 0
function note(origin: string, author: string, createdAt: string, type: NoteType, text: string, mentions: string[] = [], tags: NoteTag[] = []): SharedNote {
  return {
    id: `td-seed-${++n}`, type: 'message', dir: 'out', channel: 'note', author, authorPhoto: person(author)?.photo,
    time: label(createdAt), createdAt, text, mentions, tags, originId: origin, noteType: type, noteTypeBy: 'ai',
  }
}

export const SEED_NOTES: SharedNote[] = [
  // James Adam's chat (show on A)
  note('cv-james', 'Las Sabir', '2026-11-20T09:12', 'screening', 'Phone screening done. James has 6 years as an electrician, his own tools and a B driving licence. Speaks Danish and English.'),
  note('cv-james', 'Maja Holm', '2026-11-21T13:40', 'payroll-cs', '@Las Sabir James is missing his tax card for November, payroll can’t run until he uploads it.', ['Las Sabir']),
  note('cv-james', 'Patrick Andre', '2026-11-24T10:05', 'sales', 'James wants at least 230 DKK/hour and prefers jobs in Copenhagen or Valby. Not available on weekends.'),
  note('cv-james', 'Las Sabir', '2026-11-26T16:20', 'sales-form', 'Contract and sales form signed by James for the Reno Power ApS. electrician job. He starts Monday 1 December at 07:00 on the power plant site.'),
  // Reno Power ApS.'s chat (the ones tagging James show on A–F; the rest wait for a company version)
  note('cv-ancorless', 'Las Sabir', '2026-11-19T11:00', 'sales', 'Reno Power ApS. needs 3 electricians for the power plant from week 49. Budget 385 DKK/hour, 6 month contract.'),
  note('cv-ancorless', 'Patrick Andre', '2026-11-22T14:30', 'sales', 'Sent @James Adam to Reno Power ApS. for the power plant job. Togu Mogu will meet him on site Monday 07:00.', [], [james]),
  note('cv-ancorless', 'Maja Holm', '2026-11-25T09:45', 'payroll-cs', 'Invoice for October is 12 days overdue. @Patrick Andre please call Jhon Bossman before we send a reminder.', ['Patrick Andre']),
  note('cv-ancorless', 'Las Sabir', '2026-11-27T08:15', 'screening', 'Togu Mogu says @James Adam did a great first week on site. They want to extend his contract until March and hire one more plumber from us.', [], [james]),
  // Poly Corporation's chat, tagging both (shows on A–F)
  note('cv-poly', 'Maja Holm', '2026-11-23T15:10', 'sales', 'Poly Corporation asked if they can borrow @James Adam for two days in week 50. Check with @Reno Power ApS. first.', [], [james, reno]),
]
