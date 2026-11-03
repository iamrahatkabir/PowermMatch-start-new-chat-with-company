<script setup>
defineProps({ icon: { type: String, required: true }, tone: { type: String, default: 'brand' }, size: { type: Number, default: 40 } })
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center rounded-2xl" :class="tone === 'brand' ? 'bg-brand-bg' : 'bg-gray-100'" :style="{ width: `${size}px`, height: `${size}px` }">
    <PmIcon :name="icon" :size="Math.round(size / 2)" />
  </span>
</template>
