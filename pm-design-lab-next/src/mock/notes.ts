import type { Agent, NoteReply, ThreadItem } from './inbox-types'

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
]

// James Adam's conversation in the Notes in inbox design: a voicemail and a note that mentions a colleague
export const notesThread: ThreadItem[] = [
  {
    id: 'n1', type: 'voicemail', title: 'Voicemail', duration: '05:22', position: '02:52', progress: 0.76, time: '22 Mar 11:05',
    summary: 'Mikkel is open to the Skanska carpenter role but is on holiday until week 30. Pay expectation ~215 DKK/hr. Agreed to call back after his holiday to arrange an interview.',
  },
  {
    id: 'n2', type: 'message', dir: 'out', channel: 'note', author: 'Patrick Andre', authorPhoto: photo('men', 41), time: '22 Mar 11:05',
    text: '@Pranto Kumar Pashi This candidate needs your attention.', mentions: ['Pranto Kumar Pashi'],
    unread: true,
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
  /** Thread replies, oldest first (time 'dd Mon HH:MM') */
  replies?: NoteReply[]
  /** You are @mentioned in this note or its replies and haven't opened it yet */
  unread?: boolean
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

const profileNoteText = 'Candidate matched with and interested in the company, Company is willing to onboard this candidate from 01 January, 2026'
export const profileNotes: ProfileNote[] = [
  {
    id: 'pn1', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '8:30, 27 September, 2026', text: profileNoteText,
    replies: profileReplies('pn1', { id: 'pn1-r5', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '22 Mar 14:31', text: 'Thanks, I’ll let the company know.' }),
  },
  {
    id: 'pn2', author: 'Las Sabir', authorPhoto: photo('men', 75), time: '8:30, 27 September, 2026', text: profileNoteText, unread: true,
    replies: profileReplies('pn2', { id: 'pn2-r5', author: 'Maja Holm', authorPhoto: photo('women', 44), time: '22 Mar 14:31', text: '@Las Sabir can you confirm the start date with Jonas?', mentions: ['Las Sabir'] }),
  },
  { id: 'pn3', author: 'Patrick Andre', authorPhoto: photo('men', 41), time: '9:15, 28 September, 2026', text: 'Jonas has his own tools and a driving licence.' },
]
