'use client'
/**
 * "You are now in DND mode" toast. Shows for 2 seconds after `show` turns true, then slides out to the right.
 * Positioned by the parent (DialerBar puts it above the bar's right edge).
 *
 * Props: show (Do not disturb just turned on)
 */
import { useEffect, useState } from 'react'
import { Moon } from 'lucide-react'
import { cx } from '@/lib/cx'

export function DndToast({ show }: { show?: boolean }) {
  // mounted: in the DOM · visible: slid in. Leaving slides out first, then unmounts.
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!show) {
      setVisible(false)
      return
    }
    setMounted(true)
    const enter = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    const leave = setTimeout(() => setVisible(false), 2000)
    return () => {
      cancelAnimationFrame(enter)
      clearTimeout(leave)
    }
  }, [show])

  if (!mounted) return null
  return (
    <div
      role="status"
      className={cx(
        'flex w-72 items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition duration-300',
        visible ? 'translate-x-0 opacity-100 ease-out' : 'translate-x-[calc(100%+1rem)] opacity-0 ease-in',
      )}
      onTransitionEnd={() => !visible && setMounted(false)}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-error-500 text-white"><Moon size={18} /></span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-900">You are now in DND mode</div>
        <div className="text-xs leading-5 text-gray-600">Disable DND to start receiving calls again</div>
      </div>
    </div>
  )
}
