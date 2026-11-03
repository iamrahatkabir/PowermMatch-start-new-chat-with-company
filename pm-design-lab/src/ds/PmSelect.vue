<script setup>
const model = defineModel()
defineProps({ label: String, options: { type: Array, required: true } }) // [{ value, label }]
</script>

<template>
  <label class="flex flex-col gap-1.5">
    <span v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</span>
    <span class="relative rounded-lg border border-gray-300 bg-white transition-shadow duration-150 focus-within:shadow-focus">
      <select v-model="model" class="input-text w-full appearance-none bg-transparent py-2.5 pl-3 pr-9 text-sm text-gray-900 outline-none">
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </label>
</template>
