<script setup>
/**
 * Version G: an email as a clear card. Sender initials + name on top, subject, text (first 6 lines,
 * Show more), files, and a Reply button that is always visible on every email.
 *
 * Props:  subject, body?, dir ('in' | 'out'), from?, attachments?
 * Events: reply() · download(file)
 */
import { computed, ref } from 'vue'
import { Reply } from 'lucide-vue-next'
import EmailFiles from './EmailFiles.vue'
import { href, initials, linkify, nameOf } from './compose'

// Extra props the thread passes for the full EmailMessage (to, quoted…) are ignored
defineOptions({ inheritAttrs: false })
const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  dir: { type: String, default: 'in' },
  from: String,
  attachments: { type: Array, default: () => [] },
})
const emit = defineEmits(['reply', 'download'])
const more = ref(false)
const parts = computed(() => linkify(props.body))
const long = computed(() => props.body.split('\n').length > 6 || props.body.length > 450)
const sender = computed(() => nameOf(props.from))
</script>

<template>
  <div class="w-full rounded-2xl border border-gray-200 bg-white text-sm leading-6 text-gray-900">
    <div class="flex items-center gap-3 px-4 pt-3">
      <span
        v-if="sender"
        class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        :class="dir === 'out' ? 'bg-info-50 text-info-700' : 'bg-gray-100 text-gray-600'"
      >{{ initials(sender) }}</span>
      <div class="min-w-0 flex-1">
        <div v-if="sender" class="truncate text-xs text-gray-500">{{ dir === 'out' ? `${sender} (you)` : sender }}</div>
        <div class="truncate font-semibold">{{ subject }}</div>
      </div>
      <PmButton size="sm" variant="outline" class="shrink-0" @click="emit('reply')"><Reply :size="15" />Reply</PmButton>
    </div>
    <div v-if="body" class="px-4 pt-2">
      <p class="whitespace-pre-line break-words text-gray-700" :class="long && !more && 'line-clamp-6'">
        <template v-for="(p, i) in parts" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
      </p>
      <button v-if="long" type="button" class="text-xs font-medium text-info-700 hover:underline" @click="more = !more">{{ more ? 'Show less' : 'Show more' }}</button>
    </div>
    <EmailFiles v-if="attachments.length" :attachments="attachments" class="px-4 pt-3" @download="(f) => emit('download', f)" />
    <div class="h-3" />
  </div>
</template>
