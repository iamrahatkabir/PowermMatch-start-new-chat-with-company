// Plays a short preview of a notification sound with the Web Audio API (no audio files needed).
// In production, replace with the real sound files.
const PATTERNS = {
  classic: { type: 'sine', notes: [[880, 0, 0.25], [660, 0.3, 0.25], [880, 0.6, 0.25], [660, 0.9, 0.25]] },
  chime: { type: 'sine', notes: [[1046, 0, 0.5], [1318, 0.15, 0.6]] },
  digital: { type: 'square', notes: [[1200, 0, 0.08], [1200, 0.15, 0.08], [1200, 0.3, 0.08]] },
  marimba: { type: 'triangle', notes: [[523, 0, 0.2], [659, 0.15, 0.2], [784, 0.3, 0.35]] },
  dog: { type: 'sawtooth', notes: [[420, 0, 0.12], [360, 0.18, 0.15], [440, 0.6, 0.12], [370, 0.78, 0.15]] },
}

let ctx
export function playTone(sound) {
  const pattern = PATTERNS[sound]
  if (!pattern) return
  ctx ??= new (window.AudioContext || window.webkitAudioContext)()
  const now = ctx.currentTime
  for (const [freq, start, length] of pattern.notes) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = pattern.type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, now + start)
    gain.gain.exponentialRampToValueAtTime(0.15, now + start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + length)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now + start)
    osc.stop(now + start + length + 0.05)
  }
}
