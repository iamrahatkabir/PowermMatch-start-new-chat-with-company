// Inbox notification settings
export const notificationSounds = [
  { value: 'classic', label: 'Classic ring' },
  { value: 'chime', label: 'Soft chime' },
  { value: 'digital', label: 'Digital beep' },
  { value: 'marimba', label: 'Marimba' },
  { value: 'dog', label: 'Dog barking sound' },
  { value: 'none', label: 'No sound' },
]

export const notificationSettings = {
  inboundRingtone: 'dog',
  inboundBrowserNotification: true,
  outboundRingtone: 'dog',
  messageSound: 'dog',
  messageBrowserNotification: true,
}
