<script setup>
/**
 * One email in a conversation thread: bold subject, body clamped to 2 lines, "View details" to expand.
 * Links like pmatch.dk/... in the body are rendered as links.
 *
 * Expanded: From / To / Cc, the full body, "Show quoted text" for earlier messages, and Reply.
 * Attachments are always visible (images as thumbnails with a preview, files with a download button).
 * An outgoing email that bounced shows the reason and Retry.
 *
 * Props:  subject, body?, dir ('in' | 'out'), from?, to?, cc? (string[]), quoted?,
 *         attachments? [{ id, name, size, url?, status? }] (see attachments.js),
 *         failed? (reason the email wasn't delivered), sending?
 * Events: reply() · download(attachment) · download-all(attachments) · retry()
 */
import { computed, ref } from 'vue'
import { AlertCircle, Ellipsis, Loader, Paperclip, Reply, RotateCw } from 'lucide-vue-next'
import EmailAttachments from './EmailAttachments.vue'
import ImagePreview from './ImagePreview.vue'
import { isImage, isAvailable } from './attachments'

const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  dir: { type: String, default: 'in' },
  from: String,
  to: String,
  cc: { type: Array, default: () => [] },
  quoted: String,
  attachments: { type: Array, default: () => [] },
  failed: String,
  sending: Boolean,
})
const emit = defineEmits(['reply', 'download', 'download-all', 'retry'])

const expanded = ref(false)
const showQuoted = ref(false)
const canExpand = computed(() => !!(props.body || props.quoted || props.from || props.cc.length))
const showReply = computed(() => !props.failed && !props.sending && (expanded.value || !canExpand.value))

const LINK = /((?:https?:\/\/)?[\w-]+\.[a-z]{2,}\/\S+)/i
const linkify = (text) => text.split(LINK).map((t, i) => ({ t, link: i % 2 === 1 }))
const parts = computed(() => linkify(props.body))
const href = (t) => (t.startsWith('http') ? t : `https://${t}`)

const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const previewIndex = ref(null)
</script>

<template>
  <div class="w-full rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900" :class="dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">
    <div class="flex items-start gap-2">
      <div class="min-w-0 flex-1 font-semibold" :class="!expanded && 'truncate'">{{ subject }}</div>
      <Paperclip v-if="attachments.length" :size="15" class="mt-1 shrink-0 text-gray-500" />
    </div>

    <!-- Sender and recipients (expanded) -->
    <dl v-if="expanded && (from || to || cc.length)" class="mt-1 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
      <template v-if="from"><dt>From</dt><dd class="text-gray-700">{{ from }}</dd></template>
      <template v-if="to"><dt>To</dt><dd class="text-gray-700">{{ to }}</dd></template>
      <template v-if="cc.length"><dt>Cc</dt><dd class="text-gray-700">{{ cc.join(', ') }}</dd></template>
    </dl>

    <p v-if="body" class="mt-1 whitespace-pre-line break-words" :class="!expanded && 'line-clamp-2'">
      <template v-for="(p, i) in parts" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
    </p>

    <!-- Earlier messages quoted in this email -->
    <template v-if="expanded && quoted">
      <button
        type="button"
        class="mt-2 flex h-5 items-center rounded-md bg-gray-200 px-1.5 text-gray-600 hover:bg-gray-300"
        :title="showQuoted ? 'Hide quoted text' : 'Show quoted text'"
        @click="showQuoted = !showQuoted"
      ><Ellipsis :size="16" /></button>
      <p v-if="showQuoted" class="mt-2 whitespace-pre-line border-l-2 border-gray-300 pl-3 text-gray-500">{{ quoted }}</p>
    </template>

    <EmailAttachments
      v-if="attachments.length"
      :attachments="attachments"
      @download="(a) => emit('download', a)"
      @download-all="(list) => emit('download-all', list)"
      @preview="(i) => (previewIndex = i)"
    />

    <!-- Not delivered (outgoing) -->
    <div v-if="failed" class="mt-3 flex items-center gap-2 rounded-xl border border-error-200 bg-white px-3 py-2 text-error-700">
      <AlertCircle :size="16" class="shrink-0" />
      <span class="min-w-0 flex-1"><span class="font-medium">Not delivered.</span> {{ failed }}</span>
      <PmButton size="sm" variant="outline" class="shrink-0" @click="emit('retry')"><RotateCw :size="14" />Retry</PmButton>
    </div>

    <div v-if="canExpand || showReply || sending" class="mt-1 flex min-h-9 items-center gap-4">
      <button v-if="canExpand" type="button" class="font-medium text-info-700 hover:underline" @click="expanded = !expanded">
        {{ expanded ? 'Hide details' : 'View details' }}
      </button>
      <span v-if="sending" class="ml-auto flex items-center gap-1.5 text-xs text-gray-500"><Loader :size="14" class="animate-spin" />Sending</span>
      <PmButton v-else-if="showReply" size="sm" variant="outline" class="ml-auto" @click="emit('reply')"><Reply :size="15" />Reply</PmButton>
    </div>

    <ImagePreview
      v-if="previewIndex !== null"
      v-model:index="previewIndex"
      :images="images"
      @close="previewIndex = null"
      @download="(a) => emit('download', a)"
    />
  </div>
</template>
