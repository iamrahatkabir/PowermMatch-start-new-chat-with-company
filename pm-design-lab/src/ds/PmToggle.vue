<script setup>
// On/off switch. Yellow when on.
const model = defineModel({ type: Boolean, default: false })
defineProps({ label: String }) // accessible label
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :aria-label="label"
    class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:shadow-focus"
    :class="model ? 'bg-brand' : 'bg-gray-200'"
    @click="model = !model"
  >
    <span class="inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-150" :class="model ? 'translate-x-[18px]' : 'translate-x-0.5'" />
  </button>
</template>
