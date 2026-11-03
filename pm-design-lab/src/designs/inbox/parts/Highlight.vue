<script setup>
import { computed } from 'vue'
// Highlights the search query inside text.
const props = defineProps({ text: { type: String, default: '' }, query: { type: String, default: '' } })
const parts = computed(() => {
  const q = props.query.trim()
  if (!q) return [{ t: props.text }]
  const i = props.text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return [{ t: props.text }]
  return [{ t: props.text.slice(0, i) }, { t: props.text.slice(i, i + q.length), hit: true }, { t: props.text.slice(i + q.length) }]
})
</script>

<template>
  <span><template v-for="(p, i) in parts" :key="i"><mark v-if="p.hit" class="rounded-sm bg-brand-light text-inherit">{{ p.t }}</mark><template v-else>{{ p.t }}</template></template></span>
</template>
