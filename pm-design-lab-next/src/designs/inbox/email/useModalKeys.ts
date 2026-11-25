'use client'
import { useEffect, useRef } from 'react'

// Keyboard for email detail modals: Esc closes. Listens in the capture phase and stops ← → so the
// lab's version switcher doesn't react while a modal is open. While an image preview is open
// (isBusy() true), the preview handles the keys itself.
export function useModalKeys(close: () => void, isBusy: () => boolean = () => false) {
  // Latest callbacks, so the listener added on mount always sees current state
  const latest = useRef({ close, isBusy })
  latest.current = { close, isBusy }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (latest.current.isBusy()) return
      if (e.key === 'Escape') latest.current.close()
      else if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return
      e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])
}
