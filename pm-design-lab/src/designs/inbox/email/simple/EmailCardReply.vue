<script setup>
/**
 * Version C: an email as a clear card. Subject on top with a tertiary Reply button that is always visible,
 * then text (first 6 lines, Show more) and files.
 *
 * Props:  subject, body?, attachments?
 * Events: reply() · download(file)
 */
import { computed, ref } from 'vue'
import { Reply } from 'lucide-vue-next'
import EmailFiles from './EmailFiles.vue'
import { href, linkify } from './compose'

// Extra props the thread passes for the full EmailMessage (dir, from, to, quoted…) are ignored
defineOptions({ inheritAttrs: false })
const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, default: '' },
  attachments: { type: Array, default: () => [] },
})
const emit = defineEmits(['reply', 'download'])
const more = ref(false)
const parts = computed(() => linkify(props.body))
const long = computed(() => props.body.split('\n').length > 6 || props.body.length > 450)
</script>

<template>
  <div class="w-full rounded-2xl border border-gray-200 bg-white text-sm leading-6 text-gray-900">
    <div class="flex items-center gap-3 px-4 pt-3">
      <div class="min-w-0 flex-1 truncate font-semibold">{{ subject }}</div>
      <PmButton size="sm" variant="ghost" class="-mr-2 shrink-0" @click="emit('reply')"><Reply :size="15" />Reply</PmButton>
    </div>
    <div v-if="body" class="px-4 pt-2">
      <p class="whitespace-pre-line break-words text-gray-700" :class="long && !more && 'line-clamp-6'">
        <template v-for="(p, i) in parts" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
      </p>
      <button v-if="long" type="button" class="text-xs font-medium text-info-700 hover:underline" @click="more = !more">{{ more ? 'Show less' : 'Show more' }}</button>
    </div>
    <EmailFiles v-if="attachments.length" :attachments="attachments" row class="px-4 pt-3" @download="(f) => emit('download', f)" />
    <div class="h-3" />
  </div>
</template>
