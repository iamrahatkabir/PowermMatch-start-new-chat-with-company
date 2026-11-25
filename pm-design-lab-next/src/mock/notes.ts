import type { Agent, ThreadItem } from './inbox-types'

const photo = (g: 'men' | 'women', n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`

// Colleagues that can be @mentioned in an internal note
export const noteColleagues: Agent[] = [
  { id: 'pk', name: 'Pranto Kumar Pashi', initials: 'PK', photo: photo('men', 22) },
  { id: 'pa', name: 'Patrick Andre', initials: 'PA', photo: photo('men', 41) },
  { id: 'ls', name: 'Las Sabir', initials: 'LS', photo: photo('men', 75) },
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
  },
]
