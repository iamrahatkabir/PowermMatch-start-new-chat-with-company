<script setup>
// Product icons live in /public/brand/icons (see CLAUDE.md for the list).
defineProps({ name: { type: String, required: true }, size: { type: Number, default: 20 } })
</script>

<template>
  <img :src="`/brand/icons/${name}.svg`" :width="size" :height="size" alt="" class="shrink-0" />
</template>
