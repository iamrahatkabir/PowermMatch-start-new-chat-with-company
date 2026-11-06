<script setup>
/**
 * Full email text with clickable links, plus earlier quoted text behind a ••• button.
 * Props: body?, quoted?
 */
import { computed, ref } from 'vue'
import { Ellipsis } from 'lucide-vue-next'

const props = defineProps({ body: { type: String, default: '' }, quoted: String })
const showQuoted = ref(false)
const LINK = /((?:https?:\/\/)?[\w-]+\.[a-z]{2,}\/\S+)/i
const parts = computed(() => props.body.split(LINK).map((t, i) => ({ t, link: i % 2 === 1 })))
const href = (t) => (t.startsWith('http') ? t : `https://${t}`)
</script>

<template>
  <div class="text-sm leading-6 text-gray-900">
    <p v-if="body" class="whitespace-pre-line break-words">
      <template v-for="(p, i) in parts" :key="i"><a v-if="p.link" :href="href(p.t)" target="_blank" rel="noopener" class="underline underline-offset-2">{{ p.t }}</a><template v-else>{{ p.t }}</template></template>
    </p>
    <template v-if="quoted">
      <button
        type="button"
        class="mt-3 flex h-5 items-center rounded-md bg-gray-200 px-1.5 text-gray-600 hover:bg-gray-300"
        :title="showQuoted ? 'Hide quoted text' : 'Show quoted text'"
        @click="showQuoted = !showQuoted"
      ><Ellipsis :size="16" /></button>
      <p v-if="showQuoted" class="mt-2 whitespace-pre-line border-l-2 border-gray-300 pl-3 text-gray-500">{{ quoted }}</p>
    </template>
  </div>
</template>
