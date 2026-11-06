<script setup>
/**
 * One email in a conversation thread: bold subject, body clamped to 2 lines, "View details" to expand.
 * Links like pmatch.dk/... in the body are rendered as links.
 *
 * Props: subject, body, dir ('in' | 'out' — out is right-aligned, light blue)
 */
import { computed, ref } from 'vue'

const props = defineProps({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  dir: { type: String, default: 'in' },
})
const expanded = ref(false)
const LINK = /((?:https?:\/\/)?[\w-]+\.[a-z]{2,}\/\S+)/i
const parts = computed(() => props.body.split(LINK).map((t, i) => ({ t, link: i % 2 === 1 })))
const href = (t) => (t.startsWith('http') ? t : `https://${t}`)
</script>

<template>
  <div class="rounded-2xl px-4 py-3 text-sm leading-6 text-gray-900" :class="dir === 'out' ? 'bg-info-25' : 'bg-gray-50'">
    <div class="font-semibold">{{ subject }}</div>
    <p class="mt-1 whitespace-pre-line" :class="!expanded && 'line-clamp-2'">
      <template v-for="(p, i) in parts" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
    </p>
    <button type="button" class="mt-1 font-medium text-info-700 hover:underline" @click="expanded = !expanded">
      {{ expanded ? 'Hide details' : 'View details' }}
    </button>
  </div>
</template>
