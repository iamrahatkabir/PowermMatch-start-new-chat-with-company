<script setup>
/**
 * Version D: an email shown like a chat message. The subject is a small label on top, the whole text
 * is visible (long emails: first 8 lines + Show more), files sit right under it. Nothing to open.
 * Hovering shows a small Reply link (the composer already replies to the newest email by default).
 *
 * Props:  subject, body?, dir ('in' | 'out'), attachments?
 * Events: reply() · download(file) · download-all(files)
 */
import { computed, ref } from 'vue'
import { Mail, Reply } from 'lucide-vue-next'
import EmailFiles from './EmailFiles.vue'
import { href, linkify } from './compose'

// Extra props the thread passes for the full EmailMessage (from, to, quoted…) are ignored
defineOptions({ inheritAttrs: false })
const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  dir: { type: String, default: 'in' },
  attachments: { type: Array, default: () => [] },
})
const emit = defineEmits(['reply', 'download', 'download-all'])
const more = ref(false)
const parts = computed(() => linkify(props.body))
const long = computed(() => props.body.split('\n').length > 8 || props.body.length > 600)
</script>

<template>
  <div class="group flex w-full flex-col gap-2 rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900" :class="dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">
    <div class="flex items-center gap-1.5 text-xs font-medium text-gray-500">
      <Mail :size="13" class="shrink-0" />
      <span class="min-w-0 truncate">{{ subject }}</span>
      <button type="button" class="ml-auto hidden shrink-0 items-center gap-1 text-gray-600 hover:text-gray-900 group-hover:flex" @click="emit('reply')"><Reply :size="13" />Reply</button>
    </div>
    <div v-if="body">
      <p class="whitespace-pre-line break-words" :class="long && !more && 'line-clamp-8'">
        <template v-for="(p, i) in parts" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
      </p>
      <button v-if="long" type="button" class="text-xs font-medium text-info-700 hover:underline" @click="more = !more">{{ more ? 'Show less' : 'Show more' }}</button>
    </div>
    <EmailFiles v-if="attachments.length" :attachments="attachments" @download="(f) => emit('download', f)" @download-all="(l) => emit('download-all', l)" />
  </div>
</template>
