<script setup>
/**
 * Inbox notification settings — the page content (no app chrome).
 *
 * v-model:    settings object { inboundRingtone, inboundBrowserNotification, outboundRingtone,
 *             messageSound, messageBrowserNotification }  (edited locally until Save)
 * Props:      sounds       [{ value, label }]
 *             permission   browser notification permission: 'granted' | 'denied' | 'default' | 'unsupported'
 * Events:     test-sound(soundValue)   play a preview
 *             fix-permission()         ask the browser for permission
 *             save(settings)           also updates v-model
 */
import { computed, ref, watch } from 'vue'
import { BellOff, BellRing, Check, Play } from 'lucide-vue-next'

const settings = defineModel({ type: Object, required: true })
const props = defineProps({
  sounds: { type: Array, required: true },
  permission: { type: String, default: 'default' },
})
const emit = defineEmits(['test-sound', 'fix-permission', 'save'])

// Edit a copy; only write back on Save
const draft = ref({ ...settings.value })
watch(settings, (v) => (draft.value = { ...v }))
const dirty = computed(() => Object.keys(draft.value).some((k) => draft.value[k] !== settings.value[k]))
const saved = ref(false)

function save() {
  settings.value = { ...draft.value }
  emit('save', { ...draft.value })
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

const sections = [
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
const allowed = computed(() => props.permission === 'granted')
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-8">
    <section v-for="s in sections" :key="s.title">
      <h2 class="mb-3 text-[13px] font-medium text-gray-600">{{ s.title }}</h2>
      <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
        <div v-for="r in s.rows" :key="r.key" class="flex flex-wrap items-center gap-3 px-5 py-4">
          <span class="flex-1 text-sm font-medium text-gray-900">{{ r.label }}</span>
          <template v-if="r.kind === 'sound'">
            <PmSelect v-model="draft[r.key]" :options="sounds" class="w-full sm:w-72" />
            <PmButton variant="secondary" :disabled="draft[r.key] === 'none'" @click="emit('test-sound', draft[r.key])"><Play :size="16" />Test</PmButton>
          </template>
          <PmToggle v-else v-model="draft[r.key]" :label="r.label" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-[13px] font-medium text-gray-600">Browser must allow notifications</h2>
      <div class="rounded-2xl border border-gray-200 bg-white p-5">
        <div v-if="allowed" class="flex items-center gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
          <BellRing :size="18" />Notifications are allowed in this browser
        </div>
        <div v-else class="flex flex-wrap items-center gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 sm:max-w-md">
          <BellOff :size="18" />
          <span class="flex-1">{{ permission === 'unsupported' ? 'This browser does not support notifications' : 'Notifications are not allowed' }}</span>
          <PmButton v-if="permission !== 'unsupported'" variant="danger" size="sm" @click="emit('fix-permission')">Fix</PmButton>
        </div>
        <p v-if="permission === 'denied'" class="mt-2 text-xs text-gray-500">Blocked in browser settings. Allow notifications for this site in the address bar, then reload.</p>
      </div>
    </section>

    <div class="flex items-center gap-3">
      <PmButton :disabled="!dirty" @click="save">Save changes</PmButton>
      <span v-if="saved" class="flex items-center gap-1.5 text-sm text-success-700"><Check :size="16" />Changes saved</span>
    </div>
  </div>
</template>
