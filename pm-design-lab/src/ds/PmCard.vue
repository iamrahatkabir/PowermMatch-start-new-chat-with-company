<script setup>
// Borders are always present — no shadow-only cards.
defineProps({ padding: { type: String, default: 'p-5' } })
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white" :class="padding"><slot /></div>
</template>
