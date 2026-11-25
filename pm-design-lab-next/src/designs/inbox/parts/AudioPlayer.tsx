'use client'
import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { cx } from '@/lib/cx'

// Deterministic pseudo-waveform
const bars = Array.from({ length: 56 }, (_, i) => 30 + Math.round(Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) * 70))

export function AudioPlayer({ position, duration, progress, playing }: { position?: string; duration?: string; progress?: number; playing?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(!!playing)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
      <button type="button" className="flex size-7 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="flex h-7 min-w-0 flex-1 items-center gap-[2px] overflow-hidden">
        {bars.map((h, i) => (
          <span
            key={i}
            className={cx('w-[2px] shrink-0 rounded-full', i / bars.length < progress! ? 'bg-success-500' : 'bg-gray-300')}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <span className="shrink-0 text-xs tabular-nums text-gray-700">{position} / {duration}</span>
    </div>
  )
}
