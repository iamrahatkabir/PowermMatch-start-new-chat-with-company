<script setup>
/**
 * Version G: the first email of a thread, shown in the conversation. Replies are not listed in the
 * conversation; instead the bubble ends with a summary row — reply avatars, "N replies", last reply time —
 * that opens the Thread panel.
 * Without replies (empty state, like notes) it ends with a blue "Reply" link that opens the Thread panel.
 * Clicking the email itself expands it in place (From / To and the full text); clicking again collapses it.
 *
 * Props:  subject, body?, dir ('in' | 'out'), from?, to?, attachments?, replies? [{ author, authorPhoto?, time }]
 * Events: open-thread() · download(file)
 */
import { computed, ref } from 'vue'
import { Reply } from 'lucide-vue-next'
import EmailAttachments from '../EmailAttachments.vue'
import ImagePreview from '../ImagePreview.vue'
import { isAvailable, isImage } from '../attachments'
import { href, linkify } from '../simple/compose'

// Extra props the thread passes for the full EmailMessage (quoted, failed…) are ignored
defineOptions({ inheritAttrs: false })
const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  dir: { type: String, default: 'in' },
  from: String,
  to: String,
  attachments: { type: Array, default: () => [] },
  replies: { type: Array, default: () => [] },
})
const emit = defineEmits(['open-thread', 'download'])

const parts = computed(() => linkify(props.body))
const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const previewIndex = ref(null)

// Click anywhere on the email to expand / collapse it — except on links, buttons, files, or while selecting text
const expanded = ref(false)
function toggle(e) {
  if (e.target.closest('a, button') || window.getSelection()?.toString()) return
  expanded.value = !expanded.value
}

// Up to 2 avatars of different people who replied, then "+N"
const people = computed(() => [...new Map(props.replies.map((r) => [r.author, r])).values()])
const last = computed(() => props.replies.at(-1))
</script>

<template>
  <div
    class="group relative w-full cursor-pointer rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900"
    :class="dir === 'out' ? 'bg-info-25' : 'bg-gray-50'"
    role="button"
    tabindex="0"
    :aria-expanded="expanded"
    @click="toggle"
    @keydown.enter.self="expanded = !expanded"
  >
    <div class="font-semibold" :class="!expanded && 'truncate'">{{ subject }}</div>
    <dl v-if="expanded && (from || to)" class="mt-0.5 grid grid-cols-[auto_1fr] gap-x-2 text-xs leading-5 text-gray-500">
      <template v-if="from"><dt>From</dt><dd class="text-gray-700">{{ from }}</dd></template>
      <template v-if="to"><dt>To</dt><dd class="text-gray-700">{{ to }}</dd></template>
    </dl>
    <p v-if="body" class="mt-1 whitespace-pre-line break-words" :class="!expanded && 'line-clamp-3'">
      <template v-for="(p, i) in parts" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
    </p>
    <EmailAttachments
      v-if="attachments.length"
      :attachments="attachments"
      small
      @download="(f) => emit('download', f)"
      @preview="(i) => (previewIndex = i)"
    />

    <!-- No replies yet: Reply link (same as the notes empty state) -->
    <button v-if="!replies.length" type="button" class="mt-2 flex items-center gap-1 text-[13px] font-medium text-info-700 hover:underline" @click="emit('open-thread')">
      <Reply :size="14" />Reply
    </button>

    <!-- Replies summary -->
    <button v-if="replies.length" type="button" class="group/replies mt-2 flex items-center gap-2 text-xs" @click="emit('open-thread')">
      <span class="flex -space-x-1">
        <PmAvatar v-for="r in people.slice(0, 2)" :key="r.author" :name="r.author" :src="r.authorPhoto" :size="20" class="ring-2 ring-white" />
      </span>
      <span v-if="people.length > 2" class="text-[10px] text-gray-500">+{{ people.length - 2 }}</span>
      <span class="font-medium text-info-700 group-hover/replies:underline">{{ replies.length }} {{ replies.length === 1 ? 'reply' : 'replies' }}</span>
      <span class="text-gray-500">Last reply {{ last.time }}</span>
    </button>

    <ImagePreview
      v-if="previewIndex !== null"
      v-model:index="previewIndex"
      :images="images"
      @close="previewIndex = null"
      @download="(f) => emit('download', f)"
    />
  </div>
</template>
