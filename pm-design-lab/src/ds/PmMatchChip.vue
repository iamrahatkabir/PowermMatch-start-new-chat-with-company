<script setup>
// Match score is always GREEN (never yellow), per Figma.
defineProps({ score: { type: Number, required: true } })
</script>

<template>
  <div class="relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-success-50 p-2">
    <span class="absolute -right-8 -top-8 h-27 w-33 rounded-full border-[24px] border-success-200 opacity-25" />
    <span class="relative flex size-5 items-center justify-center rounded-full bg-success-500">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </span>
    <span class="relative text-sm font-medium text-gray-900">{{ score }}% Match</span>
  </div>
</template>
