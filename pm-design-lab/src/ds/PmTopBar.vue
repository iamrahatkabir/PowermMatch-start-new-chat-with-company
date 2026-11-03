<script setup>
defineProps({ title: { type: String, required: true }, subtitle: String })
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
    <div class="flex flex-col gap-1">
      <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
      <span v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</span>
    </div>
    <div class="ml-auto flex items-center gap-3"><slot name="actions" /></div>
  </div>
</template>
