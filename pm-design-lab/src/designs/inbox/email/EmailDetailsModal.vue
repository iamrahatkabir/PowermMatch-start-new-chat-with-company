<script setup>
/**
 * Modal with one full email: subject, From / To, body, quoted text, images, files and Reply.
 * Esc or the backdrop closes it.
 *
 * Props:  subject, body?, from?, to?, quoted?, attachments?
 * Events: close() · reply() · download(file) · download-all(files)
 */
import { computed, ref } from 'vue'
import { Reply, X } from 'lucide-vue-next'
import EmailAttachments from './EmailAttachments.vue'
import EmailBody from './EmailBody.vue'
import { useModalKeys } from './useModalKeys'
import ImagePreview from './ImagePreview.vue'
import { isAvailable, isImage } from './attachments'

const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  from: String,
  to: String,
  quoted: String,
  attachments: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'reply', 'download', 'download-all'])

const previewIndex = ref(null)
const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
useModalKeys(() => emit('close'), () => previewIndex.value !== null)
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/70 p-4 sm:p-6" @click.self="emit('close')">
      <div class="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl" role="dialog" aria-modal="true" :aria-label="subject">
        <div class="flex shrink-0 items-start gap-3 border-b border-gray-200 px-6 py-4">
          <div class="min-w-0 flex-1">
            <h2 class="text-lg font-semibold text-gray-900">{{ subject }}</h2>
            <dl v-if="from || to" class="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
              <template v-if="from"><dt>From</dt><dd class="text-gray-700">{{ from }}</dd></template>
              <template v-if="to"><dt>To</dt><dd class="text-gray-700">{{ to }}</dd></template>
            </dl>
          </div>
          <button type="button" class="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50" title="Close" @click="emit('close')"><X :size="20" /></button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm leading-6 text-gray-900">
          <EmailBody :body="body" :quoted="quoted" />

          <div v-if="attachments.length" class="mt-5 border-t border-gray-100 pt-4">
            <EmailAttachments
              :attachments="attachments"
              class="!mt-0"
              @download="(f) => emit('download', f)"
              @download-all="(l) => emit('download-all', l)"
              @preview="(i) => (previewIndex = i)"
            />
          </div>
        </div>

        <div class="flex shrink-0 items-center justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <PmButton variant="secondary" @click="emit('close')">Close</PmButton>
          <PmButton @click="emit('reply')"><Reply :size="16" />Reply</PmButton>
        </div>
      </div>
    </div>

    <ImagePreview
      v-if="previewIndex !== null"
      v-model:index="previewIndex"
      :images="images"
      @close="previewIndex = null"
      @download="(a) => emit('download', a)"
    />
  </Teleport>
</template>
