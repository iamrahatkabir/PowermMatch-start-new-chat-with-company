<script setup>
import { computed } from 'vue'
const props = defineProps({ name: String, src: String, size: { type: Number, default: 40 }, palette: Number })
const palettes = [
  'bg-gradient-to-br from-brand-light to-brand text-brand-text',
  'bg-gray-100 text-gray-700',
  'bg-success-50 text-success-700',
  'bg-info-50 text-info-700',
]
const initials = computed(() => (props.name || '?').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase())
const tone = computed(() => palettes[props.palette ?? [...(props.name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % palettes.length])
</script>

<template>
  <img v-if="src" :src="src" :width="size" :height="size" alt="" class="shrink-0 rounded-full object-cover" :style="{ width: `${size}px`, height: `${size}px` }" />
  <span
    v-else
    class="inline-flex shrink-0 items-center justify-center rounded-full font-semibold"
    :class="tone"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.38)}px` }"
  >{{ initials }}</span>
</template>
