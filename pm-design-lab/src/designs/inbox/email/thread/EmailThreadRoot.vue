<script setup>
/**
 * Version G: the first email of a thread, shown in the conversation. Replies are not listed in the
 * conversation; instead the bubble ends with a summary row — reply avatars, "N replies", last reply time —
 * that opens the Thread panel.
 * Without replies (empty state, like notes) it ends with a blue "Reply" link that opens the Thread panel.
 *
 * Props:  subject, body?, dir ('in' | 'out'), attachments?, replies? [{ author, authorPhoto?, time }]
 * Events: open-thread() · download(file)
 */
import { computed, ref } from 'vue'
import { Reply } from 'lucide-vue-next'
import EmailAttachments from '../EmailAttachments.vue'
import ImagePreview from '../ImagePreview.vue'
import { isAvailable, isImage } from '../attachments'
import { href, linkify } from '../simple/compose'

// Extra props the thread passes for the full EmailMessage (from, to, quoted, failed…) are ignored
defineOptions({ inheritAttrs: false })
const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  dir: { type: String, default: 'in' },
  attachments: { type: Array, default: () => [] },
  replies: { type: Array, default: () => [] },
})
const emit = defineEmits(['open-thread', 'download'])

const parts = computed(() => linkify(props.body))
const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const previewIndex = ref(null)

// Up to 2 avatars of different people who replied, then "+N"
const people = computed(() => [...new Map(props.replies.map((r) => [r.author, r])).values()])
const last = computed(() => props.replies.at(-1))
</script>

<template>
  <div class="group relative w-full rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900" :class="dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">

    <div class="truncate font-semibold">{{ subject }}</div>
    <p v-if="body" class="mt-1 line-clamp-3 whitespace-pre-line break-words">
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
