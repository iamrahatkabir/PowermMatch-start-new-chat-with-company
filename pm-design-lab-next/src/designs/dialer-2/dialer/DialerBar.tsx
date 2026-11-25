'use client'
/**
 * Dialer 2.0: the call bar fixed to the bottom of every page.
 * Left: status pill (Available, or Do not disturb while DND is on). Centre: call timer and call controls (only active during a call) around the big
 * Call / Hang up button. Right: missed calls (with a count), call queue, Do not disturb and audio devices.
 *
 * Props:     inCall, seconds (call length), muted, held (call on hold),
 *            missed (missed calls count), dnd (Do not disturb on: the status pill turns red "Do not disturb",
 *            the moon button turns red, and a toast shows for 2 seconds)
 * Callbacks: onCall() · onHangUp() · onMute() · onHold() · onKeypad() · onTransfer() ·
 *            onHistory() · onQueue() · onDnd() · onDevices()
 */
import { Clock, Grip, Headphones, List, Mic, MicOff, Moon, Pause, Phone, PhoneOff, Play, Shuffle } from 'lucide-react'
import { cx } from '@/lib/cx'
import { formatDuration, STATUS } from './dialer'
import { DndToast } from './DndToast'

const round = 'flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white'
const control = `${round} text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-white`

export type DialerBarProps = {
  inCall?: boolean
  seconds?: number
  muted?: boolean
  held?: boolean
  missed?: number
  dnd?: boolean
  onCall?: () => void
  onHangUp?: () => void
  onMute?: () => void
  onHold?: () => void
  onKeypad?: () => void
  onTransfer?: () => void
  onHistory?: () => void
  onQueue?: () => void
  onDnd?: () => void
  onDevices?: () => void
}

export function DialerBar({
  inCall, seconds = 0, muted, held, missed = 0, dnd,
  onCall, onHangUp, onMute, onHold, onKeypad, onTransfer, onHistory, onQueue, onDnd, onDevices,
}: DialerBarProps) {
  const s = dnd ? STATUS.dnd : STATUS.available
  return (
    <div className="relative flex h-16 shrink-0 items-center border-t border-gray-200 bg-white px-4">
      {/* DND toast, above the bar's right edge */}
      <div className="pointer-events-none absolute bottom-full right-0 overflow-hidden px-4 pb-3 pt-6"><DndToast show={dnd} /></div>

      {/* Status */}
      <div className={cx('flex h-11 items-center gap-2 rounded-full border py-1 pl-1 pr-4', s.pill)}>
        <span className={cx('flex size-8 items-center justify-center rounded-full text-white', s.dot)}>{dnd ? <PhoneOff size={16} /> : <Phone size={16} />}</span>
        <span className={cx('text-sm font-medium', s.text)}>{s.label}</span>
      </div>

      {/* Call controls */}
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        <span className={cx('flex h-10 min-w-16 items-center justify-center rounded-full px-3 text-sm tabular-nums', inCall ? 'border border-gray-200 bg-white font-medium text-gray-900' : 'bg-gray-50 text-gray-400')}>
          {formatDuration(seconds)}
        </span>
        <button type="button" className={control} disabled={!inCall} title={muted ? 'Unmute' : 'Mute'} onClick={() => onMute?.()}>
          {muted ? <MicOff size={18} className="text-error-500" /> : <Mic size={18} />}
        </button>
        <button type="button" className={control} disabled={!inCall} title={held ? 'Resume' : 'Hold'} onClick={() => onHold?.()}>
          {held ? <Play size={18} /> : <Pause size={18} />}
        </button>
        <button
          type="button"
          className={cx('mx-1 flex size-12 items-center justify-center rounded-full text-white', inCall ? 'bg-error-500 hover:bg-error-700' : 'bg-success-500 hover:bg-success-700')}
          title={inCall ? 'Hang up' : 'Call'}
          onClick={() => (inCall ? onHangUp?.() : onCall?.())}
        >
          {inCall ? <PhoneOff size={20} /> : <Phone size={20} />}
        </button>
        <button type="button" className={control} disabled={!inCall} title="Keypad" onClick={() => onKeypad?.()}><Grip size={18} /></button>
        <button type="button" className={control} disabled={!inCall} title="Transfer" onClick={() => onTransfer?.()}><Shuffle size={18} /></button>
      </div>

      {/* Tools */}
      <div className="ml-auto flex items-center gap-2">
        <button type="button" className={cx(control, 'relative')} title="Missed calls" onClick={() => onHistory?.()}>
          <Clock size={18} />
          {missed > 0 && <span className="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-error-500 text-[11px] font-semibold text-white">{missed}</span>}
        </button>
        <button type="button" className={control} title="Call queue" onClick={() => onQueue?.()}><List size={18} /></button>
        <button
          type="button"
          className={cx(control, dnd && '!border-error-500 !bg-error-500 !text-white hover:!bg-error-700')}
          title={dnd ? 'Turn off Do not disturb' : 'Do not disturb'}
          onClick={() => onDnd?.()}
        ><Moon size={18} /></button>
        <button type="button" className={control} title="Audio devices" onClick={() => onDevices?.()}><Headphones size={18} /></button>
      </div>
    </div>
  )
}
