<script setup>
/**
 * Version E: wide modal split in two — the email on the left, all attachments in a column on the right
 * ("Attachments (n)", images on top, files below). Without attachments it is a normal single-column modal.
 *
 * Props:  subject, body?, from?, to?, quoted?, attachments?
 * Events: close() · reply() · download(file)
 */
import { computed, ref } from 'vue'
import { Reply, X } from 'lucide-vue-next'
import EmailAttachments from './EmailAttachments.vue'
import EmailBody from './EmailBody.vue'
import ImagePreview from './ImagePreview.vue'
import { formatSize, isAvailable, isImage } from './attachments'
import { useModalKeys } from './useModalKeys'

const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  from: String,
  to: String,
  quoted: String,
  attachments: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'reply', 'download'])

const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const downloadable = computed(() => props.attachments.filter(isAvailable))
const total = computed(() => formatSize(downloadable.value.reduce((s, a) => s + a.size, 0)))
const previewIndex = ref(null)
useModalKeys(() => emit('close'), () => previewIndex.value !== null)
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/70 p-4 sm:p-6" @click.self="emit('close')">
      <div
        class="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
        :class="attachments.length ? 'h-[85vh] max-w-5xl' : 'max-w-2xl'"
        role="dialog"
        aria-modal="true"
        :aria-label="subject"
      >
        <div class="flex shrink-0 items-start gap-3 border-b border-gray-200 px-6 py-4">
          <div class="min-w-0 flex-1">
            <h2 class="text-lg font-semibold text-gray-900">{{ subject }}</h2>
            <p v-if="from" class="mt-0.5 truncate text-xs text-gray-500">{{ from }}<template v-if="to"> → {{ to }}</template></p>
          </div>
          <button type="button" class="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50" title="Close" @click="emit('close')"><X :size="20" /></button>
        </div>

        <div class="flex min-h-0 flex-1 flex-col md:flex-row">
          <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <EmailBody :body="body" :quoted="quoted" />
          </div>
          <aside v-if="attachments.length" class="flex min-h-0 flex-col border-t border-gray-200 bg-gray-25 md:w-80 md:border-l md:border-t-0">
            <div class="flex shrink-0 items-center gap-2 px-5 pb-1 pt-5">
              <h3 class="text-sm font-semibold text-gray-900">Attachments ({{ attachments.length }})</h3>
              <span class="text-xs text-gray-500">{{ total }}</span>
            </div>
            <EmailAttachments
              :attachments="attachments"
              stacked
              hide-summary
              class="!mt-0 min-h-0 overflow-y-auto px-5 pb-5 pt-2"
              @download="(f) => emit('download', f)"
              @preview="(i) => (previewIndex = i)"
            />
          </aside>
        </div>

        <div class="flex shrink-0 items-center justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <PmButton variant="secondary" @click="emit('close')">Close</PmButton>
          <PmButton @click="emit('reply')"><Reply :size="16" />Reply</PmButton>
        </div>
      </div>
    </div>

    <ImagePreview v-if="previewIndex !== null" v-model:index="previewIndex" :images="images" @close="previewIndex = null" @download="(a) => emit('download', a)" />
  </Teleport>
</template>

