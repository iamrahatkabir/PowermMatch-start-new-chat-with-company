<script setup>
/**
 * Version D: email in the thread with a modal for details.
 * The bubble shows the subject, attachment counts (images / files) at the top and a 2-line body.
 * "View details" (or a count) opens EmailDetailsModal with the full email, images, files and Reply.
 *
 * Props:  subject, body?, dir ('in' | 'out'), from?, to?, quoted?, attachments? (see attachments.js),
 *         details? — the details component to open (default EmailDetailsModal; version E passes its own)
 * Events: reply() · download(file)
 */
import { computed, ref } from 'vue'
import { Image, Paperclip } from 'lucide-vue-next'
import EmailDetailsModal from './EmailDetailsModal.vue'
import { isImage } from './attachments'

// Extra props the thread passes for the full EmailMessage (failed, sending…) are ignored
defineOptions({ inheritAttrs: false })
const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  dir: { type: String, default: 'in' },
  from: String,
  to: String,
  quoted: String,
  attachments: { type: Array, default: () => [] },
  details: { type: Object, default: () => EmailDetailsModal },
})
const emit = defineEmits(['reply', 'download'])
const open = ref(false)

const imageCount = computed(() => props.attachments.filter(isImage).length)
const fileCount = computed(() => props.attachments.length - imageCount.value)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

function reply() {
  open.value = false
  emit('reply')
}
</script>

<template>
  <div class="w-full rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900" :class="dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">
    <div class="flex items-center gap-3">
      <div class="min-w-0 flex-1 truncate font-semibold">{{ subject }}</div>
      <!-- Attachment counts -->
      <div v-if="attachments.length" class="flex shrink-0 items-center gap-1.5">
        <button
          v-if="imageCount"
          type="button"
          class="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          @click="open = true"
        ><Image :size="13" class="text-gray-500" />{{ plural(imageCount, 'image') }}</button>
        <button
          v-if="fileCount"
          type="button"
          class="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          @click="open = true"
        ><Paperclip :size="13" class="text-gray-500" />{{ plural(fileCount, 'file') }}</button>
      </div>
    </div>
    <p v-if="body" class="mt-1 line-clamp-2 whitespace-pre-line break-words text-gray-900">{{ body }}</p>
    <button type="button" class="mt-1 font-medium text-info-700 hover:underline" @click="open = true">View details</button>

    <component
      :is="details"
      v-if="open"
      :subject="subject"
      :body="body"
      :from="from"
      :to="to"
      :quoted="quoted"
      :attachments="attachments"
      @close="open = false"
      @reply="reply"
      @download="(f) => emit('download', f)"
    />
  </div>
</template>
