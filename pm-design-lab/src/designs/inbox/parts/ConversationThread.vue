<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { Archive, Check, ChevronDown, ChevronRight, Ellipsis, Link, Mail, MessageCircle, MessageSquareText, Paperclip, Phone, Reply, X, PhoneMissed, PhoneOutgoing, Send, StickyNote, Voicemail, Zap } from 'lucide-vue-next'
import { agents, candidateProfile } from '@/mock'
import { useInbox } from './useInbox'
import AudioPlayer from './AudioPlayer.vue'
import EntityAvatar from '../start-chat/ui/EntityAvatar.vue'
import EmailMessage from '../email/EmailMessage.vue'
import { fakeDownload, fakeDownloadAll } from './fakeDownload'

const { state, selected, company, currentContact, send, call, assignToMe } = useInbox()
const assignee = computed(() => agents.find((a) => a.id === (selected.value.assigneeId ?? 'pa')))
const thread = computed(() => state.threads[selected.value.id])
const isCompany = computed(() => selected.value.kind === 'company')
const phone = computed(() => (isCompany.value ? currentContact.value?.phone : candidateProfile.phone))
const recipient = computed(() => (isCompany.value ? currentContact.value?.name : selected.value.name)?.split(' ')[0])

const tab = ref('chat')
const tabs = [
  { key: 'chat', label: 'Chat', icon: MessageCircle },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'sms', label: 'SMS', icon: MessageSquareText },
  { key: 'note', label: 'Note', icon: StickyNote },
]
const channelIcon = { chat: MessageCircle, email: Mail, sms: MessageSquareText, call: Phone, missed: Phone, voicemail: Voicemail }
const draft = ref('')
const subject = ref('')
const replyTo = ref(null) // email being replied to
const textarea = ref()
const replySubject = computed(() => replyTo.value && `RE: ${replyTo.value.subject.replace(/^(re:\s*)+/i, '')}`)
const scroller = ref()

const isEmail = computed(() => tab.value === 'email')
const canSend = computed(() => draft.value.trim() && (!isEmail.value || replyTo.value || subject.value.trim()))

function startReply(email) {
  replyTo.value = email
  tab.value = 'email'
  nextTick(() => textarea.value?.focus())
}

// Prototype: a retried bounced email "sends" for a moment, then goes through
function retry(m) {
  m.failed = undefined
  m.sending = true
  setTimeout(() => (m.sending = false), 1200)
}

function submit() {
  if (!canSend.value) return
  send(draft.value.trim(), tab.value, isEmail.value ? replySubject.value ?? subject.value.trim() : undefined)
  draft.value = ''
  subject.value = ''
  replyTo.value = null
}
watch(() => thread.value.length, () => nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' })))
// Opening a conversation starts at the newest message, with the composer on that conversation's channel
const tabFor = { email: 'email', sms: 'sms' }
watch(
  () => selected.value.id,
  () => {
    tab.value = tabFor[selected.value.channel] ?? 'chat'
    replyTo.value = null
    nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight }))
  },
  { immediate: true },
)
</script>

<template>
  <section class="flex min-w-0 flex-1 flex-col">
    <!-- Header: company conversations always carry the company's name -->
    <div class="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 px-5">
      <EntityAvatar :type="isCompany ? 'company' : 'person'" :name="selected.name" :photo="selected.photo" :logo="company?.logo" :size="36" />
      <div class="min-w-0">
        <div class="truncate text-sm font-semibold text-gray-900">{{ selected.name }}</div>
        <div class="text-xs text-gray-500">{{ phone }}</div>
      </div>
      <button type="button" class="ml-auto flex items-center gap-2 rounded-lg border border-gray-200 py-1.5 pl-1.5 pr-2.5 text-sm text-gray-900 hover:bg-gray-50">
        <span class="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">{{ assignee.initials }}</span>
        {{ assignee.name }}
        <ChevronDown :size="16" class="text-gray-500" />
      </button>
      <div class="flex items-center gap-1 text-gray-600">
        <button type="button" class="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="More"><Ellipsis :size="18" /></button>
        <button type="button" class="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Call" @click="call"><Phone :size="18" /></button>
        <button type="button" class="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Archive"><Archive :size="18" /></button>
      </div>
    </div>

    <!-- Callback requested: stays until a recruiter calls, chats, texts or emails (not notes) -->
    <div v-if="selected.callback" class="flex shrink-0 items-center gap-2 border-b border-brand-light bg-brand-bg px-6 py-2.5 text-sm">
      <PhoneMissed :size="16" class="text-error-500" />
      <span class="font-medium text-gray-900">Callback requested</span>
      <span class="text-gray-600">• Missed call at {{ selected.callback.missedAt }}</span>
    </div>

    <!-- Messages -->
    <div ref="scroller" class="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
      <template v-for="m in thread" :key="m.id">
        <div v-if="m.type === 'system'" class="flex items-center gap-3 text-xs text-gray-400">
          <span class="h-px flex-1 bg-gray-200" />{{ m.text }}<span class="h-px flex-1 bg-gray-200" />
        </div>

        <div v-else-if="m.type === 'missed' || m.type === 'event'" class="flex flex-col gap-1.5" :class="m.dir === 'out' ? 'items-end self-end' : 'items-start'">
          <div class="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-gray-900" :class="m.dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">
            <PhoneMissed v-if="m.type === 'missed'" :size="18" class="text-error-500" />
            <PhoneOutgoing v-else :size="18" class="text-gray-600" />
            {{ m.text }}
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <PmAvatar v-if="m.authorPhoto" :name="m.author" :src="m.authorPhoto" :size="16" />
            <template v-if="m.author">{{ m.author }} • </template>{{ m.time }}
          </div>
        </div>

        <!-- Emails are full width minus a 48px gap on the opposite side; chat/SMS bubbles stay at 70% -->
        <div v-else-if="m.type === 'message'" class="flex flex-col gap-1.5" :class="[m.dir === 'out' ? 'items-end self-end' : 'items-start', m.subject ? 'w-[calc(100%-48px)]' : 'max-w-[70%]']">
          <EmailMessage
            v-if="m.subject"
            :subject="m.subject"
            :body="m.text"
            :dir="m.dir"
            :from="m.from"
            :to="m.to"
            :cc="m.cc"
            :quoted="m.quoted"
            :attachments="m.attachments"
            :failed="m.failed"
            :sending="m.sending"
            @reply="startReply(m)"
            @download="fakeDownload"
            @download-all="(files) => fakeDownloadAll(files, m.subject)"
            @retry="retry(m)"
          />
          <div v-else class="whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900" :class="m.dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">{{ m.text }}</div>
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <component :is="channelIcon[m.channel] ?? MessageCircle" :size="13" />
            <Zap v-if="m.bySystem" :size="13" />
            <PmAvatar v-else-if="m.authorPhoto" :name="m.author" :src="m.authorPhoto" :size="16" />
            {{ m.author }} • {{ m.time }}
          </div>
        </div>

        <div v-else class="flex w-full max-w-[560px] flex-col gap-1.5" :class="m.type === 'call' && 'items-end self-end'">
          <div class="w-full rounded-2xl p-4" :class="m.type === 'call' ? 'bg-info-25' : 'bg-gray-50'">
            <button type="button" class="mb-3 flex w-full items-center gap-2 text-sm text-gray-900">
              <component :is="m.type === 'call' ? PhoneOutgoing : Voicemail" :size="18" class="text-gray-600" />{{ m.title }}
              <ChevronRight :size="16" class="ml-auto text-gray-500" />
            </button>
            <AudioPlayer :position="m.position" :duration="m.duration" :progress="m.progress" />
            <p class="mt-3 text-[13px] leading-5 text-gray-700">{{ m.summary }}</p>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <PmAvatar v-if="m.authorPhoto" :name="m.author" :src="m.authorPhoto" :size="16" />
            <template v-if="m.author">{{ m.author }} • </template>{{ m.time }}
          </div>
        </div>
      </template>
    </div>

    <!-- Composer -->
    <div class="shrink-0 px-6 pb-6">
      <div class="relative rounded-2xl border border-gray-200 bg-white">
        <div class="flex gap-1 border-b border-gray-100 px-3">
          <button
            v-for="t in tabs"
            :key="t.key"
            type="button"
            class="flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px]"
            :class="t.key === tab ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-500'"
            @click="tab = t.key"
          >
            <component :is="t.icon" :size="15" />{{ t.label }}
          </button>
        </div>
        <!-- Replying: fixed "RE:" subject with a reply icon; ✕ goes back to a new email -->
        <div v-if="isEmail && replyTo" class="mx-4 mt-2 flex items-center gap-2 border-b border-gray-200 py-2.5 text-sm text-gray-500">
          <Reply :size="16" class="shrink-0" />
          <span class="min-w-0 flex-1 truncate">{{ replySubject }}</span>
          <button type="button" class="flex size-6 items-center justify-center rounded-md hover:bg-gray-100" title="Cancel reply" @click="replyTo = null"><X :size="16" /></button>
        </div>
        <input
          v-else-if="isEmail"
          v-model="subject"
          :disabled="!selected.assignedToMe"
          placeholder="Subject"
          class="mx-4 mt-2 block w-[calc(100%-2rem)] border-b border-gray-200 bg-transparent py-2.5 text-sm text-gray-900 outline-none disabled:opacity-40"
        />
        <textarea
          ref="textarea"
          v-model="draft"
          :rows="isEmail ? 4 : 3"
          :disabled="!selected.assignedToMe"
          :placeholder="isEmail ? 'Write description here' : `Write a message to ${recipient}`"
          class="block w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-900 outline-none disabled:opacity-40"
          @keydown.enter.exact="!isEmail && ($event.preventDefault(), submit())"
        />
        <div class="flex items-center gap-2 px-3 pb-3 text-gray-500" :class="!selected.assignedToMe && 'opacity-40'">
          <button type="button" class="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Attach file"><Paperclip :size="16" /></button>
          <button type="button" class="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Templates"><Zap :size="16" /></button>
          <button v-if="isEmail" type="button" class="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Insert link"><Link :size="16" /></button>
          <PmButton size="sm" variant="secondary" class="ml-auto"><Check :size="15" />Wrap-up</PmButton>
          <PmButton size="sm" variant="secondary" :disabled="!canSend" @click="submit">Send <Send :size="14" /></PmButton>
        </div>

        <div v-if="!selected.assignedToMe" class="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/40">
          <PmButton size="lg" @click="assignToMe">Assign to me</PmButton>
          <p class="text-sm text-gray-700">Click the button to assign this conversation to yourself.</p>
        </div>
      </div>
    </div>
  </section>
</template>
