'use client'
// PROTOTYPE wiring for the settings page: dummy data + browser sound preview + real permission.
// The UI itself is notification-settings/NotificationSettings.jsx.
import { useState } from 'react'
import { notificationSounds } from '@/mock'
import { useInbox } from './useInbox'
import { NotificationSettings } from '../notification-settings/NotificationSettings'
import { playTone } from '../notification-settings/playTone'

export function NotificationSettingsView() {
  const { state, update } = useInbox()
  const [permission, setPermission] = useState(() => ('Notification' in window ? Notification.permission : 'unsupported'))
  async function fixPermission() {
    setPermission(await Notification.requestPermission())
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 sm:p-8">
      <NotificationSettings
        value={state.notificationSettings}
        onChange={(v) => update((s) => { s.notificationSettings = v })}
        sounds={notificationSounds}
        permission={permission}
        onTestSound={playTone}
        onFixPermission={fixPermission}
      />
    </div>
  )
}
