// Profile note time label: '8:30, 27 September, 2026'
export function profileNoteTime(d: Date = new Date()): string {
  const month = d.toLocaleString('en-GB', { month: 'long' })
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}, ${d.getDate()} ${month}, ${d.getFullYear()}`
}
