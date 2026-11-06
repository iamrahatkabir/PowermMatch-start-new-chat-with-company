<script setup>
/**
 * Version D composer: as simple as chat. Just type and send — it replies to the newest email in the
 * conversation, so the subject is filled in for you ("RE: …"). Click the subject to change it,
 * or "New email" to start a fresh subject. Attach with the paperclip or drop files on the box.
 * Ctrl/⌘ + Enter sends.
 *
 * Props:  to { name, email }, lastEmail? ({ subject }), replyTo? ({ subject }), disabled
 * Events: send({ subject, body, attachments }) · cancel-reply()
 */
import { computed, nextTick, ref, watch } from 'vue'
import { Paperclip, Pencil, Send, X } from 'lucide-vue-next'
import FileChips from './FileChips.vue'
import { replySubject, toAttachment } from './compose'

defineOptions({ inheritAttrs: false })
const props = defineProps({ to: { type: Object, required: true }, lastEmail: Object, replyTo: Object, disabled: Boolean })
const emit = defineEmits(['send', 'cancel-reply'])

const body = ref('')
const attachments = ref([])
const customSubject = ref(null) // null = automatic "RE: …"
const editing = ref(false)
const dragging = ref(false)
const fileInput = ref()
const textarea = ref()
const subjectInput = ref()

const replyingTo = computed(() => props.replyTo ?? props.lastEmail)
const subject = computed(() => customSubject.value ?? (replyingTo.value ? replySubject(replyingTo.value.subject) : ''))
const canSend = computed(() => !props.disabled && body.value.trim() && subject.value.trim())

// Reply on a specific email → use its subject and focus the text
watch(() => props.replyTo, (r) => {
  if (!r) return
  customSubject.value = null
  editing.value = false
  nextTick(() => textarea.value?.focus())
})

function editSubject(fresh = false) {
  customSubject.value = fresh ? '' : subject.value
  editing.value = true
  nextTick(() => subjectInput.value?.focus())
}
function autoSubject() {
  customSubject.value = null
  editing.value = false
}
const addFiles = (files) => attachments.value.push(...[...files].map(toAttachment))
function onDrop(e) {
  dragging.value = false
  addFiles(e.dataTransfer.files)
}
function submit() {
  if (!canSend.value) return
  emit('send', { subject: subject.value.trim(), body: body.value.trim(), attachments: attachments.value })
  body.value = ''
  attachments.value = []
  autoSubject()
  emit('cancel-reply')
}
</script>

<template>
  <div
    class="relative px-4 pb-3 pt-2.5"
    :class="disabled && 'pointer-events-none opacity-40'"
    @dragover.prevent="dragging = true"
    @dragleave.self="dragging = false"
    @drop.prevent="onDrop"
  >
    <!-- Subject: automatic, click to change -->
    <div class="flex h-7 items-center gap-2 text-xs text-gray-500">
      <template v-if="editing || !replyingTo">
        <input
          ref="subjectInput"
          :value="subject"
          placeholder="Subject"
          class="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
          @input="customSubject = $event.target.value"
        />
        <button v-if="replyingTo" type="button" class="flex shrink-0 items-center gap-1 hover:text-gray-900" title="Use the reply subject" @click="autoSubject"><X :size="13" />Back to reply</button>
      </template>
      <template v-else>
        <button type="button" class="flex min-w-0 items-center gap-1.5 rounded-md px-1 -mx-1 hover:bg-gray-100" title="Change subject" @click="editSubject()">
          <span class="min-w-0 truncate font-medium text-gray-700">{{ subject }}</span>
          <Pencil :size="12" class="shrink-0" />
        </button>
        <button type="button" class="ml-auto shrink-0 font-medium hover:text-gray-900" @click="editSubject(true)">New email</button>
      </template>
    </div>

    <textarea
      ref="textarea"
      v-model="body"
      rows="3"
      :placeholder="`Write an email to ${to.name?.split(' ')[0] ?? ''}`"
      class="mt-1 block w-full resize-none bg-transparent text-sm leading-6 text-gray-900 outline-none"
      @keydown.enter.meta.prevent="submit"
      @keydown.enter.ctrl.prevent="submit"
    />
    <FileChips :attachments="attachments" class="mb-2" @remove="(id) => (attachments = attachments.filter((a) => a.id !== id))" />

    <div class="flex items-center gap-2 text-gray-500">
      <input ref="fileInput" type="file" multiple class="hidden" @change="(e) => (addFiles(e.target.files), (e.target.value = ''))" />
      <button type="button" class="-ml-1.5 flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Attach files" @click="fileInput.click()"><Paperclip :size="16" /></button>
      <span class="ml-auto text-xs text-gray-400">Ctrl + Enter to send</span>
      <PmButton size="sm" :disabled="!canSend" @click="submit">Send <Send :size="14" /></PmButton>
    </div>

    <div v-if="dragging" class="pointer-events-none absolute inset-1 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/90 text-sm font-medium text-gray-700">
      Drop files to attach
    </div>
  </div>
</template>
