<script setup>
/**
 * Version G: right-hand "Thread" panel for one email thread (like the notes thread).
 * The first email on top, then "N replies" and every reply (avatar, name • time, text, files),
 * and a reply box at the bottom. Replies keep the thread's subject ("RE: …"), so there is no subject field.
 *
 * Props:  root { subject, body, from?, to?, author, authorPhoto?, time, attachments? },
 *         replies [{ id, author, authorPhoto?, time, body, attachments? }], disabled?
 * Events: close() · send({ body, attachments }) · download(file)
 */
import { computed, nextTick, ref, watch } from 'vue'
import { Paperclip, Reply, Send, X } from 'lucide-vue-next'
import EmailAttachments from '../EmailAttachments.vue'
import ImagePreview from '../ImagePreview.vue'
import FileChips from '../simple/FileChips.vue'
import { isAvailable, isImage } from '../attachments'
import { href, linkify, toAttachment } from '../simple/compose'

const props = defineProps({
  root: { type: Object, required: true },
  replies: { type: Array, default: () => [] },
  disabled: Boolean,
})
const emit = defineEmits(['close', 'send', 'download'])

const body = ref('')
const attachments = ref([])
const fileInput = ref()
const textarea = ref()
const scroller = ref()
const dragging = ref(false)
const canSend = computed(() => !props.disabled && body.value.trim())

// Image preview across the whole thread
const preview = ref(null) // { images, index }
const imagesOf = (list = []) => list.filter((a) => isImage(a) && isAvailable(a))
const openPreview = (list, index) => (preview.value = { images: imagesOf(list), index })

const addFiles = (files) => attachments.value.push(...[...files].map(toAttachment))
function onDrop(e) {
  dragging.value = false
  addFiles(e.dataTransfer.files)
}
function submit() {
  if (!canSend.value) return
  emit('send', { body: body.value.trim(), attachments: attachments.value })
  body.value = ''
  attachments.value = []
}
const focusReply = () => textarea.value?.focus()

// New reply → scroll to it. Another thread opened → start at the top.
watch(() => props.replies.length, () => nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' })))
watch(() => props.root, () => nextTick(() => scroller.value?.scrollTo({ top: 0 })))
</script>

<template>
  <aside class="hidden w-[340px] shrink-0 flex-col border-l border-gray-200 bg-white xl:flex">
    <div class="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
      <h2 class="text-base font-semibold text-gray-900">Thread</h2>
      <button type="button" class="ml-auto flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50" title="Close" @click="emit('close')"><X :size="18" /></button>
    </div>

    <div ref="scroller" class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      <!-- First email -->
      <div class="rounded-2xl px-3.5 py-3 text-sm leading-6 text-gray-900" :class="root.dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">
        <div class="font-semibold">{{ root.subject }}</div>
        <dl v-if="root.from || root.to" class="mt-0.5 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
          <template v-if="root.from"><dt>From</dt><dd class="truncate text-gray-700">{{ root.from }}</dd></template>
          <template v-if="root.to"><dt>To</dt><dd class="truncate text-gray-700">{{ root.to }}</dd></template>
        </dl>
        <p v-if="root.body" class="mt-2 whitespace-pre-line break-words">
          <template v-for="(p, i) in linkify(root.body)" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
        </p>
        <EmailAttachments
          v-if="root.attachments?.length"
          :attachments="root.attachments"
          small
          stacked
          @download="(f) => emit('download', f)"
          @preview="(i) => openPreview(root.attachments, i)"
        />
      </div>
      <div class="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
        <PmAvatar :name="root.author" :src="root.authorPhoto" :size="16" />{{ root.author }} • {{ root.time }}
      </div>

      <!-- Replies -->
      <div class="my-4 flex items-center gap-3 text-xs text-gray-500">
        {{ replies.length ? `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}` : 'No replies yet' }}
        <span class="h-px flex-1 bg-gray-200" />
      </div>
      <div class="flex flex-col gap-5">
        <div v-for="r in replies" :key="r.id" class="group relative flex gap-2.5">
          <PmAvatar :name="r.author" :src="r.authorPhoto" :size="28" class="shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-1 text-sm">
              <span class="truncate font-medium text-gray-900">{{ r.author }}</span>
              <span class="shrink-0 text-xs text-gray-500">• {{ r.time }}</span>
            </div>
            <p class="mt-0.5 whitespace-pre-line break-words text-sm leading-6 text-gray-700">
              <template v-for="(p, i) in linkify(r.body)" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
            </p>
            <EmailAttachments
              v-if="r.attachments?.length"
              :attachments="r.attachments"
              small
              stacked
              @download="(f) => emit('download', f)"
              @preview="(i) => openPreview(r.attachments, i)"
            />
          </div>
          <button
            type="button"
            class="absolute -top-2 right-0 hidden items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-gray-50 group-hover:flex"
            @click="focusReply"
          ><Reply :size="13" />Reply</button>
        </div>
      </div>
    </div>

    <!-- Reply box -->
    <div class="shrink-0 p-4">
      <div
        class="relative rounded-2xl border border-gray-200 bg-white"
        :class="disabled && 'pointer-events-none opacity-40'"
        @dragover.prevent="dragging = true"
        @dragleave.self="dragging = false"
        @drop.prevent="onDrop"
      >
        <textarea
          ref="textarea"
          v-model="body"
          rows="3"
          placeholder="Reply…"
          class="block w-full resize-none bg-transparent px-3 pt-3 text-sm leading-6 text-gray-900 outline-none"
          @keydown.enter.meta.prevent="submit"
          @keydown.enter.ctrl.prevent="submit"
        />
        <FileChips :attachments="attachments" class="mx-3 mb-2" @remove="(id) => (attachments = attachments.filter((a) => a.id !== id))" />
        <div class="flex items-center gap-1 px-2 pb-2 text-gray-500">
          <input ref="fileInput" type="file" multiple class="hidden" @change="(e) => (addFiles(e.target.files), (e.target.value = ''))" />
          <button type="button" class="flex size-8 items-center justify-center rounded-lg hover:bg-gray-50" title="Attach files" @click="fileInput.click()"><Paperclip :size="16" /></button>
          <PmButton size="sm" variant="secondary" class="ml-auto" :disabled="!canSend" @click="submit">Send <Send :size="14" /></PmButton>
        </div>
        <div v-if="dragging" class="pointer-events-none absolute inset-1 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white/90 text-sm font-medium text-gray-700">
          Drop files to attach
        </div>
      </div>
    </div>

    <ImagePreview
      v-if="preview"
      v-model:index="preview.index"
      :images="preview.images"
      @close="preview = null"
      @download="(f) => emit('download', f)"
    />
  </aside>
</template>
