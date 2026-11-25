'use client'
// PROTOTYPE ONLY: an empty product page with the Dialer 2.0 call bar at the bottom, plus fake call state
// (Call starts a timer, Hang up stops it; mute / hold / Do not disturb toggle).
import { useEffect, useState } from 'react'
import { PmAppShell } from '@/ds'
import { DialerBar } from '../dialer/DialerBar'

export function DialerPage() {
  const [inCall, setInCall] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [held, setHeld] = useState(false)
  const [dnd, setDnd] = useState(false)

  // The timer runs during a call and pauses while the call is on hold
  useEffect(() => {
    if (!inCall || held) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [inCall, held])

  function call() {
    setSeconds(0)
    setInCall(true)
  }
  function hangUp() {
    setInCall(false)
    setMuted(false)
    setHeld(false)
    setSeconds(0)
  }

  return (
    // The bar spans the full width under the nav; the app shell fills the space above it
    <div className="flex h-screen flex-col bg-white">
      <PmAppShell active="" flush className="!h-auto min-h-0 flex-1"><div className="h-full bg-white" /></PmAppShell>
      <DialerBar
        inCall={inCall}
        seconds={seconds}
        muted={muted}
        held={held}
        missed={2}
        dnd={dnd}
        onCall={call}
        onHangUp={hangUp}
        onMute={() => setMuted((m) => !m)}
        onHold={() => setHeld((h) => !h)}
        onDnd={() => setDnd((d) => !d)}
      />
    </div>
  )
}
