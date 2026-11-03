<script setup>
const model = defineModel()
defineProps({ tabs: { type: Array, required: true } }) // [{ key, label, count? }]
</script>

<template>
  <div class="flex gap-6 overflow-x-auto border-b border-gray-200">
    <button
      v-for="t in tabs"
      :key="t.key"
      type="button"
      class="relative inline-flex items-center gap-1.5 whitespace-nowrap px-0.5 py-2.5 text-sm outline-none"
      :class="t.key === model ? 'font-semibold text-gray-900' : 'font-medium text-gray-500 hover:text-gray-700'"
      @click="model = t.key"
    >
      {{ t.label }}
      <span v-if="t.count != null" class="rounded-full px-1.5 text-[11px] font-semibold leading-4" :class="t.key === model ? 'bg-brand-bg text-brand-text' : 'bg-gray-100 text-gray-600'">{{ t.count }}</span>
      <span v-if="t.key === model" class="absolute inset-x-0 -bottom-px h-0.5 rounded bg-brand" />
    </button>
  </div>
</template>
