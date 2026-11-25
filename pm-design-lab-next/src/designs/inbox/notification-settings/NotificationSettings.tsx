'use client'
/**
 * Inbox notification settings — the page content (no app chrome).
 *
 * value + onChange(settings):
 *             settings object { inboundRingtone, inboundBrowserNotification, outboundRingtone,
 *             messageSound, messageBrowserNotification }  (edited locally until Save)
 * Props:      sounds       [{ value, label }]
 *             permission   browser notification permission: 'granted' | 'denied' | 'default' | 'unsupported'
 * Callbacks:  onTestSound(soundValue)   play a preview
 *             onFixPermission()         ask the browser for permission
 *             onSave(settings)          also calls onChange
 */
import { useEffect, useState } from 'react'
import { BellOff, BellRing, Check, Play } from 'lucide-react'
import { PmButton, PmSelect, PmToggle } from '@/ds'
import type { SelectOption } from '@/ds/PmSelect'

export type NotificationSettingsValue = {
  inboundRingtone: string
  inboundBrowserNotification: boolean
  outboundRingtone: string
  messageSound: string
  messageBrowserNotification: boolean
}
type SoundKey = 'inboundRingtone' | 'outboundRingtone' | 'messageSound'
type ToggleKey = 'inboundBrowserNotification' | 'messageBrowserNotification'
type Row = { kind: 'sound'; key: SoundKey; label: string } | { kind: 'toggle'; key: ToggleKey; label: string }
export type NotificationPermissionState = NotificationPermission | 'unsupported'

export type NotificationSettingsProps = {
  value: NotificationSettingsValue
  onChange?: (settings: NotificationSettingsValue) => void
  sounds: SelectOption[]
  permission?: NotificationPermissionState
  onTestSound?: (sound: string) => void
  onFixPermission?: () => void
  onSave?: (settings: NotificationSettingsValue) => void
}

const sections: { title: string; rows: Row[] }[] = [
  {
    title: 'Inbound call preferences',
    rows: [
      { kind: 'sound', key: 'inboundRingtone', label: 'Inbound ringtone' },
      { kind: 'toggle', key: 'inboundBrowserNotification', label: 'Show browser notification for new calls' },
    ],
  },
  { title: 'Outbound call preferences', rows: [{ kind: 'sound', key: 'outboundRingtone', label: 'Outbound ringtone' }] },
  {
    title: 'Chat, SMS and email preferences',
    rows: [
      { kind: 'sound', key: 'messageSound', label: 'Notification sound' },
      { kind: 'toggle', key: 'messageBrowserNotification', label: 'Show browser notification for new messages' },
    ],
  },
]

export function NotificationSettings({ value: settings, onChange, sounds, permission = 'default', onTestSound, onFixPermission, onSave }: NotificationSettingsProps) {
  // Edit a copy; only write back on Save
  const [draft, setDraft] = useState(() => ({ ...settings }))
  useEffect(() => setDraft({ ...settings }), [settings])
  const dirty = (Object.keys(draft) as (keyof NotificationSettingsValue)[]).some((k) => draft[k] !== settings[k])
  const [saved, setSaved] = useState(false)
  const set = <K extends keyof NotificationSettingsValue>(key: K, v: NotificationSettingsValue[K]) => setDraft((d) => ({ ...d, [key]: v }))

  function save() {
    onChange?.({ ...draft })
    onSave?.({ ...draft })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const allowed = permission === 'granted'

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="mb-3 text-[13px] font-medium text-gray-600">{s.title}</h2>
          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {s.rows.map((r) => (
              <div key={r.key} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="flex-1 text-sm font-medium text-gray-900">{r.label}</span>
                {r.kind === 'sound' ? (
                  <>
                    {/* PmSelect has no className: the width lives on a wrapper */}
                    <div className="w-full sm:w-72"><PmSelect value={draft[r.key]} onChange={(v) => set(r.key, v)} options={sounds} /></div>
                    <PmButton variant="secondary" disabled={draft[r.key] === 'none'} onClick={() => onTestSound?.(draft[r.key])}><Play size={16} />Test</PmButton>
                  </>
                ) : (
                  <PmToggle checked={draft[r.key]} onChange={(v) => set(r.key, v)} label={r.label} />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-3 text-[13px] font-medium text-gray-600">Browser must allow notifications</h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          {allowed ? (
            <div className="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
              <BellRing size={18} />Notifications are allowed in this browser
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 sm:max-w-md">
              <BellOff size={18} />
              <span className="flex-1">{permission === 'unsupported' ? 'This browser does not support notifications' : 'Notifications are not allowed'}</span>
              {permission !== 'unsupported' && <PmButton variant="danger" size="sm" onClick={() => onFixPermission?.()}>Fix</PmButton>}
            </div>
          )}
          {permission === 'denied' && <p className="mt-2 text-xs text-gray-500">Blocked in browser settings. Allow notifications for this site in the address bar, then reload.</p>}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <PmButton disabled={!dirty} onClick={save}>Save changes</PmButton>
        {saved && <span className="flex items-center gap-1.5 text-sm text-success-700"><Check size={16} />Changes saved</span>}
      </div>
    </div>
  )
}
