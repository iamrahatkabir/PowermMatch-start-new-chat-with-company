import type { Agent, NoteReply, NoteType, ThreadItem } from './inbox-types'

const photo = (g: 'men' | 'women', n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`

// Colleagues that can be @mentioned in an internal note
export const noteColleagues: Agent[] = [
  { id: 'pk', name: 'Pranto Kumar Pashi', initials: 'PK', photo: photo('men', 22) },
  { id: 'pa', name: 'Patrick Andre', initials: 'PA', photo: photo('men', 41) },
  { id: 'rk', name: 'Rahat Kabir Ifty', initials: 'RK', photo: photo('men', 52) },
  { id: 'ls', name: 'Las Sabir', initials: 'LS', photo: photo('men', 75) },
  { id: 'aj', name: 'Adam James', initials: 'AJ', photo: photo('men', 64) },
  { id: 'mh', name: 'Maja Holm', initials: 'MH', photo: photo('women', 44) },
  { id: 'fk', name: 'Frederik Krogh', initials: 'FK', photo: photo('men', 12) },
  { id: 'co', name: 'Christoffer Østergaard-Andersen', initials: 'CØ', photo: photo('men', 33) }, // worst case: long name
]

// ── Worst-case examples (long name, long text, long link, many mentions, many replies) ──
const longAuthor = { author: 'Christoffer Østergaard-Andersen', authorPhoto: photo('men', 33) }
const longNoteText =
  '@Las Sabir @Pranto Kumar Pashi @Maja Holm Payroll for weeks 38–41 is still missing two timesheets and the holiday pay was calculated on the old hourly rate. ' +
  'I have checked the contract, the payslips and the agreement with the client, and the difference is 4.312,50 DKK. ' +
  'Details here: https://powermatch.dk/payroll/2026/week-38-41/timesheets/candidate-james-adam-missing-hours-and-holiday-pay-correction\n\n' +
  'Please confirm before Friday so we can correct it in the next pay run.'
const manyReplies = (id: string, n: number, lastMentionsMe: boolean): NoteReply[] => {
  const people = [
    { author: 'Pranto Kumar Pashi', authorPhoto: photo('men', 22) }, { author: 'Maja Holm', authorPhoto: photo('women', 44) },
    longAuthor, { author: 'Frederik Krogh', authorPhoto: photo('men', 12) },
  ]
  return Array.from({ length: n }, (_, i) => {
    const last = i === n - 1
    return {
      id: `${id}-r${i + 1}`, ...people[i % people.length],
      time: `23 Mar ${String(9 + Math.floor(i / 6)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
      text: last && lastMentionsMe ? '@Las Sabir the corrected payslip is uploaded, can you check it today?' : i % 5 === 2 ? 'Checked the timesheets again. Week 39 is approved by the client but week 40 is still waiting for the site manager, he is on holiday until Monday.' : 'Noted, thanks.',
      mentions: last && lastMentionsMe ? ['Las Sabir'] : undefined,
    }
  })
}

// James Adam's conversation in the Notes in inbox design: a voicemail and a note that mentions a colleague
export const notesThread: ThreadItem[] = [
  {
    id: 'n1', type: 'voicemail', title: 'Voicemail', duration: '05:22', position: '02:52', progress: 0.76, time: '22 Mar 11:05',
    summary: 'Mikkel is open to the Skanska carpenter role but is on holiday until week 30. Pay expectation ~215 DKK/hr. Agreed to call back after his holiday to arrange an interview.',
  },
  {
    id: 'n2', type: 'message', dir: 'out', channel: 'note', author: 'Patrick Andre', authorPhoto: photo('men', 41), time: '22 Mar 11:05',
    text: '@Pranto Kumar Pashi This candidate needs your attention.', mentions: ['Pranto Kumar Pashi'],
    noteType: 'screening', noteTypeBy: 'ai', unread: true,
    noteReplies: [
      { id: 'r1', author: 'Pranto Kumar Pashi', authorPhoto: photo('men', 22), time: '22 Mar 13:55', text: 'All good @Las Sabir I’m taking over this chat.', mentions: ['Las Sabir'] },
      { id: 'r2', author: 'Pranto Kumar Pashi', authorPhoto: photo('men', 22), time: '22 Mar 13:55', text: '@Rahat Kabir Ifty I’ve talked with the applicant. Onboard him from the next month for Renow Power APS.', mentions: ['Rahat Kabir Ifty'] },
      { id: 'r3', author: 'Maja Holm', authorPhoto: photo('women', 44), time: '22 Mar 14:02', text: 'He also applied for the Dewalt job last week.' },
      { id: 'r3b', author: 'Frederik Krogh', authorPhoto: photo('men', 12), time: '22 Mar 14:18', text: 'Skanska wants an answer before Friday.' },
      { id: 'r4', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '22 Mar 14:31', text: 'Let’s not move forward with this applicant. Renow Power APS is not hiring anymore.', quote: { replyId: 'r2', author: 'Pranto Kumar Pashi', text: 'I’ve talked with the applicant. Onboard him from the next month for Renow Power APS.' } },
    ],
  },
  {
    id: 'n3', type: 'message', dir: 'out', channel: 'note', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '22 Mar 14:20',
    text: 'Spoke with James. He prefers calls before 10:00 and has his own tools. Follow up after week 30.',
    noteType: 'sales', noteTypeBy: 'ai',
  },
  {
    // Worst case: long name, long text + link, 3 mentions, 24 replies, unread, longest type
    id: 'n4', type: 'message', dir: 'out', channel: 'note', ...longAuthor, time: '23 Mar 09:12',
    text: longNoteText, mentions: ['Las Sabir', 'Pranto Kumar Pashi', 'Maja Holm'],
    noteType: 'payroll-cs', noteTypeBy: 'ai', unread: true, noteReplies: manyReplies('n4', 24, true),
  },
]

// ── Notes in profile ─────────────────────────────────────────────
export type MatchFactor = { label: string; score: number; text: string }
export type Requirement = { icon: 'wage' | 'start' | 'commute' | 'hours' | 'tools'; label: string; value?: string; detail?: string }
export type ProfileCandidate = {
  name: string; photo: string; age: number; city: string; experienceYears: number
  match: number; factors: MatchFactor[]; requirements: Requirement[]
}
export type ProfileNote = {
  id: string; author: string; authorPhoto?: string; time: string; text: string; mentions?: string[]
  /** ISO date-time, used to sort newest first (time is the label) */
  createdAt: string
  /** Thread replies, oldest first (time 'dd Mon HH:MM') */
  replies?: NoteReply[]
  /** You are @mentioned in this note or its replies and haven't opened it yet */
  unread?: boolean
  /** Note category; null/missing = not set yet (AI still working) */
  noteType?: NoteType | null
  noteTypeBy?: 'ai' | 'agent'
  /** Pinned notes show first in Active */
  pinned?: boolean
  /** Archived notes only show in the Archived tab */
  archived?: boolean
}

export const profileCandidate: ProfileCandidate = {
  name: 'Jonas', photo: photo('men', 86), age: 23, city: 'Copenhagen', experienceYears: 3,
  match: 67,
  factors: [
    { label: 'Role Fit', score: 92, text: 'The candidate matches 11/12 main tasks and 4/6 secondary tasks' },
    { label: 'Experience Level', score: 65, text: 'The candidate has 3 years of experience, and you require 5 years' },
    { label: 'Commute Suitability', score: 44, text: 'The candidate has a 55 minute drive to the workplace' },
  ],
  requirements: [
    { icon: 'wage', label: 'Hourly Wage', value: '120-130 DKK' },
    { icon: 'start', label: 'Start Date', value: '2 Weeks' },
    { icon: 'commute', label: 'Commute Options', detail: 'Carpooling from day one, wants a company car within a year' },
    { icon: 'hours', label: 'Work Hours', value: '37 h/week' },
    { icon: 'tools', label: 'Own Tools', value: 'Yes' },
  ],
}

// time format on profile notes: 'H:MM, D Month, YYYY'
const pk = { author: 'Pranto Kumar Pashi', authorPhoto: photo('men', 22) }
const profileReplies = (id: string, last: NoteReply): NoteReply[] => [
  { id: `${id}-r1`, ...pk, time: '22 Mar 13:55', text: 'All good @Las Sabir I’m taking over this chat.', mentions: ['Las Sabir'] },
  { id: `${id}-r2`, ...pk, time: '22 Mar 13:55', text: '@Rahat Kabir Ifty I’ve talked with the applicant. Onboard him from the next month for Renow Power APS.', mentions: ['Rahat Kabir Ifty'] },
  { id: `${id}-r3`, author: 'Maja Holm', authorPhoto: photo('women', 44), time: '22 Mar 14:02', text: 'He also applied for the Dewalt job last week.' },
  { id: `${id}-r4`, author: 'Frederik Krogh', authorPhoto: photo('men', 12), time: '22 Mar 14:18', text: 'Skanska wants an answer before Friday.' },
  last,
]

// ── Many older notes (worst case: a profile with 100+ notes, paged 5 at a time) ──
const profileLabel = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}, ${d.getDate()} ${d.toLocaleString('en-GB', { month: 'long' })}, ${d.getFullYear()}`
const olderTexts = [
  'Called Jonas about the Skanska site in Valby. He can start in two weeks.',
  'Sent the contract for signing.',
  'Jonas asked about overtime pay and weekend shifts. Explained the agreement with the client.',
  'Interview with Dewalt moved to Thursday 10:00.',
  'No answer on the phone, left a voicemail.',
  'Client feedback: good attitude on site, needs more experience with formwork. They want to keep him for another month and review again before Christmas.',
  'Timesheet for week 36 approved.',
  '@Maja Holm can you check his driving licence copy?',
  'Sales form filled in for Renow Power APS.',
  'Jonas prefers jobs within 45 minutes of Copenhagen.',
]
const olderAuthors = [
  { author: 'Las Sabir', authorPhoto: photo('men', 75) }, { author: 'Patrick Andre', authorPhoto: photo('men', 41) },
  { author: 'Maja Holm', authorPhoto: photo('women', 44) }, { author: 'Pranto Kumar Pashi', authorPhoto: photo('men', 22) },
  { author: 'Frederik Krogh', authorPhoto: photo('men', 12) },
]
const olderTypes: NoteType[] = ['screening', 'sales', 'payroll-cs', 'sales-form']
function olderProfileNotes(n: number, texts: string[] = olderTexts, prefix = 'po'): ProfileNote[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(2026, 8, 26, 16 - (i % 8), (i * 13) % 60)
    d.setDate(d.getDate() - Math.floor(i * 1.5))
    const text = texts[i % texts.length]
    return {
      id: `${prefix}${i + 1}`, ...olderAuthors[i % olderAuthors.length], time: profileLabel(d), createdAt: d.toISOString().slice(0, 16), text,
      mentions: text.startsWith('@Maja Holm') ? ['Maja Holm'] : undefined,
      noteType: olderTypes[i % olderTypes.length], noteTypeBy: 'ai' as const,
      replies: i % 7 === 3 ? manyReplies(`${prefix}${i + 1}`, 2 + (i % 4), false) : undefined,
      // A few old ones are archived (12 of 118); one old note is pinned so pinned notes come from different dates
      archived: i % 10 === 4 ? true : undefined,
      pinned: i === 40 ? true : undefined,
    }
  })
}

const profileNoteText = 'Candidate matched with and interested in the company, Company is willing to onboard this candidate from 01 January, 2026'
export const profileNotes: ProfileNote[] = [
  {
    id: 'pn1', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '8:30, 27 September, 2026', createdAt: '2026-09-27T08:30', text: profileNoteText, noteType: 'sales', noteTypeBy: 'ai',
    replies: profileReplies('pn1', { id: 'pn1-r5', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '22 Mar 14:31', text: 'Thanks, I’ll let the company know.' }),
  },
  {
    id: 'pn2', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '8:31, 27 September, 2026', createdAt: '2026-09-27T08:31', text: profileNoteText, noteType: 'sales-form', noteTypeBy: 'ai', unread: true,
    replies: profileReplies('pn2', { id: 'pn2-r5', author: 'Maja Holm', authorPhoto: photo('women', 44), time: '22 Mar 14:31', text: '@Las Sabir can you confirm the start date with Jonas?', mentions: ['Las Sabir'] }),
  },
  { id: 'pn3', author: 'Patrick Andre', authorPhoto: photo('men', 41), time: '9:15, 28 September, 2026', createdAt: '2026-09-28T09:15', text: 'Jonas has his own tools and a driving licence.', noteType: 'screening', noteTypeBy: 'ai', pinned: true },
  // Worst case: long name, long text + link, 3 mentions, 24 replies, unread
  { id: 'pn4', ...longAuthor, time: '23:59, 30 September, 2026', createdAt: '2026-09-30T23:59', text: longNoteText, noteType: 'payroll-cs', noteTypeBy: 'ai', mentions: ['Las Sabir', 'Pranto Kumar Pashi', 'Maja Holm'], unread: true, replies: manyReplies('pn4', 24, true) },
  ...olderProfileNotes(118),
]

// ── Applicant/Candidate profile notes (internal profile page) ──
export type PersonProfile = {
  name: string; photo: string; kind: 'applicant' | 'candidate'; trade: string; experienceYears: number; age: number
  city: string; phone: string; email: string; address: string; status: string; appliedFor?: string; recruiter: string
}
export const notesPerson: PersonProfile = {
  name: 'Jonas Østergaard Nielsen', photo: photo('men', 86), kind: 'candidate', trade: 'Carpenter', experienceYears: 3, age: 23,
  city: 'Copenhagen', phone: '+45 22 41 87 90', email: 'jonas.nielsen@gmail.com', address: 'Valby Langgade 112, 2500 Valby',
  status: 'Available', appliedFor: 'Carpenter for Skanska site in Valby', recruiter: 'Las Sabir',
}
// Same notes as the candidate profile (122, worst case)
export const personNotes: ProfileNote[] = profileNotes

// ── Company profile notes ──
const companyTexts = [
  'Called Jhon about the two open electrician jobs. They want people who can start in week 2.',
  'Contract renewal sent for signing.',
  'Invoice for January is overdue, reminded the HR manager by phone.',
  'Site visit in Valby on Thursday 10:00 with @Maja Holm.',
  'New contact person: Togu Mogu, Site Manager. Use him for anything on site.',
  'They are not happy with the last plumber, want a replacement before Friday. Agreed to send two profiles today and follow up tomorrow morning.',
  'Sales form filled in for the power plant job.',
  'Price agreed: 385 DKK/hour for electricians, 360 DKK/hour for plumbers.',
  'Asked for safety certificates for everyone on site.',
  'No answer, left a voicemail.',
]
export const companyProfileNotes: ProfileNote[] = [
  {
    id: 'cn1', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '10:05, 29 September, 2026', createdAt: '2026-09-29T10:05',
    text: 'Agreed with @Patrick Andre that we take over the payroll for their 6 temp workers from October.', mentions: ['Patrick Andre'],
    noteType: 'payroll-cs', noteTypeBy: 'ai', pinned: true,
  },
  {
    id: 'cn2', ...longAuthor, time: '23:59, 30 September, 2026', createdAt: '2026-09-30T23:59', text: longNoteText,
    mentions: ['Las Sabir', 'Pranto Kumar Pashi', 'Maja Holm'], noteType: 'payroll-cs', noteTypeBy: 'ai', unread: true, replies: manyReplies('cn2', 24, true),
  },
  ...olderProfileNotes(64, companyTexts, 'co'),
]
