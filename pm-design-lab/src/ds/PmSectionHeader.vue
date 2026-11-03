<script setup>
defineProps({ icon: String, title: { type: String, required: true }, subtitle: String })
</script>

<template>
  <div class="flex items-center gap-3">
    <PmIconTile v-if="icon" :icon="icon" />
    <div class="flex flex-col gap-0.5">
      <div class="text-base font-semibold text-gray-700">{{ title }}</div>
      <div v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</div>
    </div>
    <div class="ml-auto"><slot name="actions" /></div>
  </div>
</template>
