// Shared mock data — every variant imports from here instead of inventing its own.
// English copy; Danish names and places, DKK, 24h time, dd.mm.yyyy dates.

export const STATUS = {
  matched: { tone: 'brand', label: 'Matched' },
  interview: { tone: 'info', label: 'Interview' },
  cv_ready: { tone: 'success', label: 'CV Ready' },
  pending: { tone: 'warning', label: 'Pending' },
  draft: { tone: 'neutral', label: 'Draft' },
  rejected: { tone: 'error', label: 'Rejected' },
  hired: { tone: 'success', label: 'Hired' },
}

export const candidates = [
  { id: 'anna', name: 'Anna Kristensen', role: 'Warehouse Worker', city: 'København NV', distanceKm: 4, age: 32, match: 92, status: 'matched', available: 'Mon · 24 Jun', experienceYears: 5, hourlyRate: 185 },
  { id: 'lars', name: 'Lars Pedersen', role: 'Truck Driver C+E', city: 'Roskilde', distanceKm: 31, age: 45, match: 88, status: 'interview', available: 'Wed · 26 Jun', experienceYears: 8, hourlyRate: 210 },
  { id: 'mads', name: 'Mads Holm', role: 'Carpenter', city: 'Aarhus', distanceKm: 12, age: 28, match: 85, status: 'matched', available: 'Mon · 24 Jun', experienceYears: 3, hourlyRate: 245 },
  { id: 'sofie', name: 'Sofie Lund', role: 'Warehouse Worker', city: 'Frederiksberg', distanceKm: 6, age: 24, match: 81, status: 'cv_ready', available: 'Now', experienceYears: 2, hourlyRate: 175 },
  { id: 'rikke', name: 'Rikke Mortensen', role: 'Bus Driver', city: 'Odense', distanceKm: 18, age: 39, match: 78, status: 'pending', available: 'Tue · 25 Jun', experienceYears: 4, hourlyRate: 205 },
  { id: 'jonas', name: 'Jonas Berg', role: 'Metalworker', city: 'Aalborg', distanceKm: 9, age: 36, match: 74, status: 'draft', available: 'Mon · 01 Jul', experienceYears: 6, hourlyRate: 260 },
  { id: 'ida', name: 'Ida Sørensen', role: 'Service Assistant', city: 'København K', distanceKm: 2, age: 22, match: 69, status: 'interview', available: 'Now', experienceYears: 1, hourlyRate: 165 },
  { id: 'peter', name: 'Peter Madsen', role: 'Painter', city: 'Esbjerg', distanceKm: 44, age: 51, match: 65, status: 'rejected', available: '—', experienceYears: 10, hourlyRate: 240 },
  { id: 'emil', name: 'Emil Nielsen', role: 'Electrician', city: 'Vejle', distanceKm: 15, age: 30, match: 83, status: 'hired', available: 'Now', experienceYears: 7, hourlyRate: 285 },
  { id: 'freja', name: 'Freja Andersen', role: 'Plumber', city: 'Køge', distanceKm: 22, age: 27, match: 79, status: 'cv_ready', available: 'Fri · 28 Jun', experienceYears: 4, hourlyRate: 270 },
]

export const jobs = [
  { id: 'j1', title: 'Warehouse Worker', company: 'Nordlys Logistik', city: 'Brøndby', status: 'active', applicants: 24, newApplicants: 5, positions: 3, start: '24.06.2026', hourlyRate: 180 },
  { id: 'j2', title: 'Truck Driver C+E', company: 'DanTrans A/S', city: 'Roskilde', status: 'active', applicants: 11, newApplicants: 2, positions: 2, start: '01.07.2026', hourlyRate: 215 },
  { id: 'j3', title: 'Carpenter', company: 'Byg & Bo ApS', city: 'Aarhus', status: 'paused', applicants: 8, newApplicants: 0, positions: 1, start: '15.07.2026', hourlyRate: 250 },
  { id: 'j4', title: 'Electrician', company: 'Volt Service', city: 'Vejle', status: 'filled', applicants: 17, newApplicants: 0, positions: 2, start: '10.06.2026', hourlyRate: 290 },
  { id: 'j5', title: 'Service Assistant', company: 'Hotel Havnen', city: 'København K', status: 'draft', applicants: 0, newApplicants: 0, positions: 4, start: '05.08.2026', hourlyRate: 165 },
]

export const JOB_STATUS = {
  active: { tone: 'success', label: 'Active' },
  paused: { tone: 'warning', label: 'Paused' },
  filled: { tone: 'info', label: 'Filled' },
  draft: { tone: 'neutral', label: 'Draft' },
}

export const kpis = [
  { label: 'Active Jobs', value: 12, delta: '+2' },
  { label: 'New Candidates', value: 48, delta: '+11' },
  { label: 'Interviews This Week', value: 9, delta: '-1' },
  { label: 'Revenue (DKK)', value: '184,500', delta: '+8%' },
]

export const companies = [
  { id: 'c1', name: 'Nordlys Logistik', city: 'Brøndby', industry: 'Warehouse & Logistics', activeJobs: 3, employees: 42 },
  { id: 'c2', name: 'DanTrans A/S', city: 'Roskilde', industry: 'Transport', activeJobs: 2, employees: 18 },
  { id: 'c3', name: 'Byg & Bo ApS', city: 'Aarhus', industry: 'Construction', activeJobs: 1, employees: 11 },
  { id: 'c4', name: 'Volt Service', city: 'Vejle', industry: 'Electrical', activeJobs: 0, employees: 9 },
  { id: 'c5', name: 'Hotel Havnen', city: 'København K', industry: 'Hotel & Restaurant', activeJobs: 1, employees: 27 },
]

export const interviews = [
  { id: 'i1', candidateId: 'lars', jobId: 'j2', date: '26.06.2026', time: '09:00', duration: 30, type: 'Video', status: 'scheduled' },
  { id: 'i2', candidateId: 'ida', jobId: 'j5', date: '26.06.2026', time: '13:30', duration: 45, type: 'On-site', status: 'scheduled' },
  { id: 'i3', candidateId: 'anna', jobId: 'j1', date: '27.06.2026', time: '10:00', duration: 30, type: 'Phone', status: 'pending' },
  { id: 'i4', candidateId: 'mads', jobId: 'j3', date: '21.06.2026', time: '14:00', duration: 60, type: 'On-site', status: 'completed' },
  { id: 'i5', candidateId: 'peter', jobId: 'j3', date: '19.06.2026', time: '11:00', duration: 30, type: 'Video', status: 'cancelled' },
]

export const INTERVIEW_STATUS = {
  scheduled: { tone: 'info', label: 'Scheduled' },
  pending: { tone: 'warning', label: 'Pending' },
  completed: { tone: 'success', label: 'Completed' },
  cancelled: { tone: 'error', label: 'Cancelled' },
}

export const contracts = [
  { id: 'k1', candidateId: 'emil', jobId: 'j4', start: '10.06.2026', end: '10.12.2026', hourlyRate: 285, hoursPerWeek: 37, status: 'signed' },
  { id: 'k2', candidateId: 'anna', jobId: 'j1', start: '24.06.2026', end: '24.09.2026', hourlyRate: 185, hoursPerWeek: 37, status: 'sent' },
  { id: 'k3', candidateId: 'sofie', jobId: 'j1', start: '24.06.2026', end: '—', hourlyRate: 175, hoursPerWeek: 25, status: 'draft' },
  { id: 'k4', candidateId: 'lars', jobId: 'j2', start: '01.07.2026', end: '01.01.2027', hourlyRate: 215, hoursPerWeek: 37, status: 'expired' },
]

export const CONTRACT_STATUS = {
  signed: { tone: 'success', label: 'Signed' },
  sent: { tone: 'info', label: 'Sent' },
  draft: { tone: 'neutral', label: 'Draft' },
  expired: { tone: 'error', label: 'Expired' },
}

// Time tracking — one week of hours
export const timesheets = [
  { id: 't1', candidateId: 'emil', date: '17.06.2026', day: 'Mon', start: '07:00', end: '15:30', breakMin: 30, hours: 8, status: 'approved' },
  { id: 't2', candidateId: 'emil', date: '18.06.2026', day: 'Tue', start: '07:00', end: '15:30', breakMin: 30, hours: 8, status: 'approved' },
  { id: 't3', candidateId: 'emil', date: '19.06.2026', day: 'Wed', start: '07:00', end: '17:00', breakMin: 30, hours: 9.5, status: 'pending' },
  { id: 't4', candidateId: 'anna', date: '19.06.2026', day: 'Wed', start: '06:00', end: '14:00', breakMin: 30, hours: 7.5, status: 'pending' },
  { id: 't5', candidateId: 'anna', date: '20.06.2026', day: 'Thu', start: '06:00', end: '12:00', breakMin: 0, hours: 6, status: 'rejected' },
]

export const TIMESHEET_STATUS = {
  approved: { tone: 'success', label: 'Approved' },
  pending: { tone: 'warning', label: 'Pending' },
  rejected: { tone: 'error', label: 'Rejected' },
}

export const notifications = [
  { id: 'n1', type: 'Jobs', text: 'Anna Kristensen applied to Warehouse Worker', time: '10 min', unread: true },
  { id: 'n2', type: 'Hours', text: 'Emil Nielsen submitted 9.5 hours for approval', time: '1 h', unread: true },
  { id: 'n3', type: 'Interview', text: 'Interview with Lars Pedersen tomorrow at 09:00', time: '3 h', unread: true },
  { id: 'n4', type: 'Contract', text: 'Contract for Emil Nielsen was signed', time: 'Yesterday', unread: false },
  { id: 'n5', type: 'Invoice', text: 'Invoice #2026-114 is overdue', time: '2 days', unread: false },
]

export const todos = [
  { id: 'd1', title: 'Call Nordlys about start date', due: '24.06.2026', done: false, tag: 'Task @Project' },
  { id: 'd2', title: 'Approve hours for week 25', due: '25.06.2026', done: false, tag: 'Weekly Task @Project' },
  { id: 'd3', title: 'Send contract to Sofie Lund', due: '21.06.2026', done: true, tag: 'Task @Project' },
]

// Lookups for joining by id
export const candidateById = (id) => candidates.find((c) => c.id === id)
export const jobById = (id) => jobs.find((j) => j.id === id)

export const currentUser = { name: 'Mette Jensen', role: 'Recruiter', company: 'PowerMatch' }

export const dkk = (n) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(n)

export * from './inbox.js'
