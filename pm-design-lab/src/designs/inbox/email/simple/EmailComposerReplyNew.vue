<script setup>
/**
 * Version C composer: one clear choice at the top — Reply (to the newest email, or the one whose Reply
 * was clicked) or New email. Reply shows which email you're answering; New email asks for a subject.
 * Big labelled buttons: "Attach files" and "Send email". Files can also be dropped on the box.
 *
 * Props:  to { name, email }, lastEmail? ({ subject }), replyTo? ({ subject }), disabled
 * Events: send({ subject, body, attachments }) · cancel-reply()
 */
import { computed, nextTick, ref, watch } from 'vue'
import { Mail, Paperclip, Reply, Send } from 'lucide-vue-next'
import FileChips from './FileChips.vue'
import { replySubject, toAttachment } from './compose'

defineOptions({ inheritAttrs: false })
const props = defineProps({ to: { type: Object, required: true }, lastEmail: Object, replyTo: Object, disabled: Boolean })
const emit = defineEmits(['send', 'cancel-reply'])

const answering = computed(() => props.replyTo ?? props.lastEmail)
const mode = ref(answering.value ? 'reply' : 'new')
const subject = ref('')
const body = ref('')
const attachments = ref([])
const dragging = ref(false)
const fileInput = ref()
const textarea = ref()

const finalSubject = computed(() => (mode.value === 'reply' ? replySubject(answering.value.subject) : subject.value.trim()))
const canSend = computed(() => !props.disabled && body.value.trim() && finalSubject.value)

watch(() => props.replyTo, (r) => r && ((mode.value = 'reply'), nextTick(() => textarea.value?.focus())))
watch(answering, (a) => !a && (mode.value = 'new'))

const addFiles = (files) => attachments.value.push(...[...files].map(toAttachment))
function onDrop(e) {
  dragging.value = false
  addFiles(e.dataTransfer.files)
}
function submit() {
  if (!canSend.value) return
  emit('send', { subject: finalSubject.value, body: body.value.trim(), attachments: attachments.value })
  subject.value = body.value = ''
  attachments.value = []
  emit('cancel-reply')
  mode.value = 'reply' // the email just sent is now the newest, so the next message is a reply to it
}
</script>

<template>
  <div
    class="relative px-4 pb-3 pt-3"
    :class="disabled && 'pointer-events-none opacity-40'"
    @dragover.prevent="dragging = true"
    @dragleave.self="dragging = false"
    @drop.prevent="onDrop"
  >
    <!-- Reply or New email -->
    <div class="flex items-center gap-3">
      <div class="flex shrink-0 rounded-lg bg-gray-100 p-0.5 text-[13px] font-medium">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-3 py-1 disabled:opacity-40"
          :class="mode === 'reply' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'"
          :disabled="!answering"
          @click="mode = 'reply'"
        ><Reply :size="14" />Reply</button>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-3 py-1"
          :class="mode === 'new' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'"
          @click="(mode = 'new'), emit('cancel-reply')"
        ><Mail :size="14" />New email</button>
      </div>
      <span v-if="mode === 'reply'" class="min-w-0 truncate text-sm text-gray-500" :title="finalSubject">{{ finalSubject }}</span>
    </div>

    <input
      v-if="mode === 'new'"
      v-model="subject"
      placeholder="Subject"
      class="mt-2 block w-full border-b border-gray-200 bg-transparent py-2 text-sm font-medium text-gray-900 outline-none placeholder:font-normal"
    />
    <textarea
      ref="textarea"
      v-model="body"
      rows="3"
      :placeholder="mode === 'reply' ? `Write your reply to ${to.name?.split(' ')[0] ?? ''}` : 'Write your email'"
      class="mt-2 block w-full resize-none bg-transparent text-sm leading-6 text-gray-900 outline-none"
    />
    <FileChips :attachments="attachments" class="mb-2" @remove="(id) => (attachments = attachments.filter((a) => a.id !== id))" />

    <div class="flex items-center gap-2">
      <input ref="fileInput" type="file" multiple class="hidden" @change="(e) => (addFiles(e.target.files), (e.target.value = ''))" />
      <PmButton size="sm" variant="ghost" class="-ml-2" @click="fileInput.click()"><Paperclip :size="15" />Attach files</PmButton>
      <PmButton size="sm" class="ml-auto" :disabled="!canSend" @click="submit"><Send :size="14" />Send email</PmButton>
    </div>

    <div v-if="dragging" class="pointer-events-none absolute inset-1 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/90 text-sm font-medium text-gray-700">
      Drop files to attach
    </div>
  </div>
</template>
