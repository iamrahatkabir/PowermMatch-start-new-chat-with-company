<script setup>
/**
 * Version B: same bubble as the modal version (subject, attachment counts at the top, 2-line body),
 * but "View details" (or a count) expands the email in place, below — no pop-up.
 * Expanded: From / To, full body with quoted text, images and files, Hide details and Reply.
 *
 * Props:  subject, body?, dir ('in' | 'out'), from?, to?, quoted?, attachments? (see attachments.js)
 * Events: reply() · download(file)
 */
import { computed, ref } from 'vue'
import { Image, Paperclip, Reply } from 'lucide-vue-next'
import EmailAttachments from './EmailAttachments.vue'
import EmailBody from './EmailBody.vue'
import ImagePreview from './ImagePreview.vue'
import { isAvailable, isImage } from './attachments'

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
})
const emit = defineEmits(['reply', 'download'])
const open = ref(false)
const previewIndex = ref(null)

const imageCount = computed(() => props.attachments.filter(isImage).length)
const fileCount = computed(() => props.attachments.length - imageCount.value)
const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const chip = 'flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50'
</script>

<template>
  <div class="w-full rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900" :class="dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">
    <div class="flex items-center gap-3">
      <div class="min-w-0 flex-1 truncate font-semibold">{{ subject }}</div>
      <!-- Attachment counts -->
      <div v-if="attachments.length" class="flex shrink-0 items-center gap-1.5">
        <button v-if="imageCount" type="button" :class="chip" @click="open = true"><Image :size="13" class="text-gray-500" />{{ plural(imageCount, 'image') }}</button>
        <button v-if="fileCount" type="button" :class="chip" @click="open = true"><Paperclip :size="13" class="text-gray-500" />{{ plural(fileCount, 'file') }}</button>
      </div>
    </div>

    <!-- Collapsed -->
    <p v-if="!open && body" class="mt-1 line-clamp-2 whitespace-pre-line break-words">{{ body }}</p>

    <!-- Expanded details -->
    <template v-if="open">
      <dl v-if="from || to" class="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
        <template v-if="from"><dt>From</dt><dd class="text-gray-700">{{ from }}</dd></template>
        <template v-if="to"><dt>To</dt><dd class="text-gray-700">{{ to }}</dd></template>
      </dl>
      <EmailBody :body="body" :quoted="quoted" class="mt-2" />
      <EmailAttachments
        v-if="attachments.length"
        :attachments="attachments"
        @download="(f) => emit('download', f)"
        @preview="(i) => (previewIndex = i)"
      />
    </template>

    <div class="mt-1 flex min-h-9 items-center gap-4">
      <button type="button" class="font-medium text-info-700 hover:underline" @click="open = !open">{{ open ? 'Hide details' : 'View details' }}</button>
      <PmButton v-if="open" size="sm" variant="ghost" class="ml-auto" @click="emit('reply')"><Reply :size="15" />Reply</PmButton>
    </div>

    <ImagePreview
      v-if="previewIndex !== null"
      v-model:index="previewIndex"
      :images="images"
      @close="previewIndex = null"
      @download="(f) => emit('download', f)"
    />
  </div>
</template>
