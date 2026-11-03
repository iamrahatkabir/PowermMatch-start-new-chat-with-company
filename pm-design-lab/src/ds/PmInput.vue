<script setup>
const model = defineModel()
defineProps({ label: String, placeholder: String, type: { type: String, default: 'text' }, error: String, hint: String })
</script>

<template>
  <label class="flex flex-col gap-1.5">
    <span v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</span>
    <span
      class="flex items-center gap-2 rounded-lg border bg-white px-3 transition-shadow duration-150 focus-within:shadow-focus"
      :class="error ? 'border-error-500' : 'border-gray-300'"
    >
      <slot name="prefix" />
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        class="input-text min-w-0 flex-1 bg-transparent py-2.5 text-sm text-gray-900 outline-none"
      />
      <slot name="suffix" />
    </span>
    <span v-if="error" class="text-xs text-error-700">{{ error }}</span>
    <span v-else-if="hint" class="text-xs text-gray-500">{{ hint }}</span>
  </label>
</template>
