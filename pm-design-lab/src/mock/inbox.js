// Inbox: conversations, threads, the "Start new conversation" directory and side-panel data.
const photo = (g, n) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`

export const agents = [
  { id: 'pa', name: 'Patrick Andre', initials: 'PA', photo: photo('men', 41) },
  { id: 'ls', name: 'Las Sabir', initials: 'LS', photo: photo('men', 75) },
]

// Companies we talk to through their contact persons. A company conversation always
// shows the company name; `currentContactId` on the conversation says who we're talking to.
export const clientCompanies = [
  {
    id: 'ancorless', name: 'Ancorless Bangladesh', contractsLabel: '2 contracts',
    email: 'info@ancorless.dk', address: 'Bredgade 33C, 3, 1260 København, Denmark',
    contacts: [
      { id: 'jhon', name: 'Jhon Bossman', role: 'HR Manager', phone: '+45 12 34 56 78' },
      { id: 'togu', name: 'Togu Mogu', role: 'Site Manager', phone: '+45 12 34 78 90' },
    ],
    jobs: [
      { id: 'aj1', title: 'Electrician for power plant', open: 2, hired: 1, city: 'Copenhagen, Denmark', status: 'hiring' },
      { id: 'aj2', title: 'Plumber', open: 2, hired: 1, city: 'Copenhagen, Denmark', status: 'hiring' },
    ],
    invoices: [{ id: 'ai1', amount: 'DKK 42,300', period: '1 Jan – 8 Feb 2026', sent: 'Sent 29 Dec 2025', status: 'due' }],
  },
  {
    id: 'poly', name: 'Poly Corporation', logo: 'poly', contractsLabel: '1 contract',
    email: 'hr@polycorp.dk', address: 'Vesterbrogade 12, 1620 København V, Denmark',
    contacts: [
      { id: 'maria', name: 'Maria Holm', role: 'Recruitment Lead', phone: '+45 22 41 08 19' },
      { id: 'anders', name: 'Anders Lund', role: 'Operations Manager', phone: '+45 31 77 52 60' },
      { id: 'sara', name: 'Sara Nygaard', role: 'Payroll', phone: '+45 40 18 93 27' },
    ],
    jobs: [{ id: 'pj1', title: 'Carpenter', open: 3, hired: 0, city: 'Aarhus, Denmark', status: 'hiring' }],
    invoices: [{ id: 'pi1', amount: 'DKK 18,950', period: '1 Feb – 28 Feb 2026', sent: 'Sent 2 Mar 2026', status: 'paid' }],
  },
  {
    id: 'nordlys', name: 'Nordlys Logistik', contractsLabel: '3 contracts',
    email: 'kontakt@nordlys.dk', address: 'Park Allé 290, 2605 Brøndby, Denmark',
    contacts: [
      { id: 'kasper', name: 'Kasper Dahl', role: 'Warehouse Manager', phone: '+45 28 63 11 04' },
      { id: 'tobias', name: 'Tobias Mogensen', role: 'CEO', phone: '+45 26 90 44 71' },
    ],
    jobs: [{ id: 'nj1', title: 'Warehouse Worker', open: 3, hired: 2, city: 'Brøndby, Denmark', status: 'hiring' }],
    invoices: [],
  },
  {
    id: 'probuild', name: 'ProBuild Christensen A/S', contractsLabel: '5 contracts',
    email: 'info@probuild.dk', address: 'Søndergade 4, 8000 Aarhus C, Denmark',
    contacts: [{ id: 'mette', name: 'Mette Christensen', role: 'Owner', phone: '+45 51 22 30 88' }],
    jobs: [{ id: 'bj1', title: 'Carpenter', open: 1, hired: 4, city: 'Aarhus, Denmark', status: 'filled' }],
    invoices: [],
  },
]

// "Start new conversation" — people
export const contactDirectory = {
  candidates: [
    { id: 'lars', name: 'Lars Mikkelsen', meta: 'Carpenter • ProBuild Christensen A/S', photo: photo('men', 52) },
    { id: 'puy', name: 'Puy Hawkins', meta: 'Carpenter • ProBuild Christensen A/S', photo: photo('men', 61) },
    { id: 'peslie', name: 'Peslie Alexander', meta: 'Carpenter • ProBuild Christensen A/S', photo: photo('men', 8) },
  ],
  applicants: [
    { id: 'pannette', name: 'Pannette Black', meta: 'Carpenter', photo: photo('men', 36) },
    { id: 'esther', name: 'Esther Howard', meta: 'Electrician', photo: photo('women', 26) },
    { id: 'cody', name: 'Cody Fisher', meta: 'Plumber', photo: photo('men', 14) },
  ],
}

// kind: candidate | applicant | company · channel: call | missed | email | chat | sms | voicemail
// state 'waiting' = incoming call shows "Waiting…" + Pick up
// callback = { missedAt } → missed call where the caller asked to be called back
export const conversations = [
  { id: 'cv-ancorless', kind: 'company', companyId: 'ancorless', currentContactId: 'togu', name: 'Ancorless Bangladesh', channel: 'chat', preview: 'Hi PowerMatch. We need qualified plumbers.', time: '1 d', unread: 0, assignedToMe: true },
  { id: 'cv-james', kind: 'candidate', name: 'James Adam', photo: photo('men', 32), channel: 'missed', preview: 'Missed call', time: '5 min', unread: 1, callback: { missedAt: '21:45, 19 Oct' } },
  { id: 'cv-jenny', kind: 'applicant', name: 'Jenny Wilson', photo: photo('women', 68), channel: 'chat', preview: "Hi! I'm looking for a carpentry job in Copenhagen", time: '5 min', unread: 2, starred: true },
  { id: 'cv-poly', kind: 'company', companyId: 'poly', currentContactId: 'maria', name: 'Poly Corporation', channel: 'chat', preview: 'Can you send two more carpenters?', time: '1 d', unread: 15, assignedToMe: true },
  { id: 'cv-marvin', kind: 'candidate', name: 'Marvin McKinney', photo: photo('men', 85), channel: 'call', preview: 'Incoming call • Sales', time: 'Now', unread: 1, state: 'waiting' },
  { id: 'cv-courtney', kind: 'applicant', name: 'Courtney Henry', photo: photo('men', 29), channel: 'call', preview: 'Replied: We have reviewed your application and will', time: '5 min', unread: 0 },
  { id: 'cv-eleanor', kind: 'candidate', name: 'Eleanor Pena', photo: photo('women', 47), channel: 'missed', preview: 'Missed call • Customer support', time: '5 min', unread: 2 },
  { id: 'cv-theresa', kind: 'candidate', name: 'Theresa Webb', photo: photo('women', 33), channel: 'call', preview: 'Incoming call • Sales', time: 'Now', unread: 1, state: 'waiting' },
  { id: 'cv-unknown', kind: 'unknown', name: '+45 12 34 56 78', channel: 'voicemail', preview: 'Voicemail', time: '5 min', unread: 2 },
  { id: 'cv-guy', kind: 'candidate', name: 'Guy Hawkins', photo: photo('men', 64), channel: 'sms', preview: 'Thanks, see you Monday', time: '5 min', unread: 0 },
]

export const CONVERSATION_KIND = {
  candidate: { label: 'Candidate' },
  applicant: { label: 'Applicant' },
  company: { label: 'Company' },
}

const summary = 'James is open to the Skanska carpenter role but is on holiday until week 30. Pay expectation ~215 DKK/hr. Agreed to call back after his holiday to arrange an interview.'

// Threads by conversation id. type: system | message | call | voicemail
// message: dir in|out, channel chat|email|sms, author (name), authorPhoto?, bySystem?
// Conversations without a thread get a one-message thread from their preview.
export const threads = {
  'cv-ancorless': [
    { id: 'a1', type: 'system', text: 'Conversation started with Jhon Bossman' },
    { id: 'a2', type: 'message', dir: 'out', channel: 'chat', bySystem: true, author: 'System', time: '22 Mar 11:05', text: 'Hi Ancorless Bangladesh, this is PowerMatch ApS. We help companies with qualified workers. Should I send you some resumes of qualified workers?' },
    { id: 'a3', type: 'message', dir: 'in', channel: 'chat', author: 'Jhon Bossman', time: '22 Mar 11:05', text: 'Hi PowerMatch! Thank you for reaching out. Please talk to Togu Mogu.' },
    { id: 'a4', type: 'system', text: 'Conversation switched to Togu Mogu' },
    { id: 'a5', type: 'message', dir: 'out', channel: 'chat', author: 'Patrick Andre', authorPhoto: photo('men', 41), time: '22 Mar 11:05', text: 'Hi Togu Mogu! Jhon Bossman referred you to contact regarding qualified workers.' },
    { id: 'a6', type: 'message', dir: 'in', channel: 'chat', author: 'Togu Mogu', time: '22 Mar 11:05', text: 'Hi PowerMatch. We need qualified plumbers. Could you please forward some profiles?' },
  ],
  'cv-poly': [
    { id: 'p1', type: 'system', text: 'Conversation started with Maria Holm' },
    { id: 'p2', type: 'message', dir: 'in', channel: 'chat', author: 'Maria Holm', time: '21 Mar 09:12', text: 'Can you send two more carpenters for the Aarhus site?' },
  ],
  'cv-james': [
    { id: 'j1', type: 'system', text: 'Profile created • Jobindex application' },
    { id: 'j2', type: 'call', title: 'Outbound call', duration: '05:22', position: '02:52', progress: 0.53, summary, author: 'Patrick Andre', authorPhoto: photo('men', 41), time: '22 Mar 11:05' },
    { id: 'j3', type: 'voicemail', title: 'Voicemail', duration: '05:22', position: '02:52', progress: 0.76, summary, time: '22 Mar 11:05' },
    { id: 'j4', type: 'system', text: 'This ticket has been assigned to Patrick Andre by the system' },
    { id: 'j5', type: 'missed', text: 'Missed call • Callback requested', time: '19 Oct 21:45' },
  ],
}

// Right-hand panel for people (candidate/applicant) conversations
export const candidateProfile = {
  type: 'Candidate',
  trade: 'Refrigeration tech',
  experience: '6 years',
  phone: '+45 12 34 56 78',
  email: 'james@powermatch.dk',
  address: 'Bredgade 33C, 3, 1260 København, Denmark',
  employer: 'Ancorless Bangladesh',
  interviews: [
    { id: 'pi1', mode: 'onsite', date: '24 Nov', time: '09:00', company: 'Paw Life ApS', status: 'scheduled' },
    { id: 'pi2', mode: 'video', date: '24 Nov', time: '09:00', company: 'Dewalt ApS', status: 'requested' },
  ],
  contracts: [
    { id: 'pc1', date: '24 Nov', time: '09:00', company: 'Ancorless Bangladesh Ltd', status: 'signed' },
    { id: 'pc2', date: '16 Jan', time: '13:20', company: 'Dewalt ApS', status: 'sent' },
  ],
}

export const PROFILE_STATUS = {
  scheduled: { tone: 'info', label: 'Scheduled' },
  requested: { tone: 'warning', label: 'Requested' },
  signed: { tone: 'success', label: 'Signed' },
  sent: { tone: 'warning', label: 'Sent' },
  hiring: { tone: 'error', label: 'Hiring' },
  filled: { tone: 'success', label: 'Filled' },
  due: { tone: 'error', label: 'Due' },
  paid: { tone: 'success', label: 'Paid' },
}
