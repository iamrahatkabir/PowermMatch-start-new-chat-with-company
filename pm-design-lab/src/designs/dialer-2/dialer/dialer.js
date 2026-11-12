// Plain-JS helpers for Dialer 2.0 (no Vue).

// Status pill at the left of the call bar
export const STATUS = {
  available: { label: 'Available', dot: 'bg-success-500', text: 'text-success-700', pill: 'border-gray-200' },
  // Shown instead of the status while Do not disturb is on
  dnd: { label: 'Do not disturb', dot: 'bg-error-500', text: 'text-error-700', pill: 'border-error-200 bg-error-50' },
}

// 75 → "01:15", 3725 → "1:02:05"
export function formatDuration(total = 0) {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return h ? `${h}:${mmss}` : mmss
}
