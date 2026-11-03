<script setup>
import { onMounted, ref } from 'vue'
// Popover frame shared by every menu variant: title, search field, scrollable body.
const query = defineModel({ type: String, default: '' })
defineProps({ placeholder: { type: String, default: 'Search contact persons, candidates, companies' } })
const root = ref()
onMounted(() => root.value.querySelector('input')?.focus())
</script>

<template>
  <div ref="root" class="absolute inset-x-2 top-14 z-30 flex max-h-[min(640px,calc(100vh-140px))] flex-col rounded-2xl border border-gray-200 bg-white shadow-xl">
    <div class="p-4 pb-2">
      <div class="mb-3 text-sm font-semibold text-gray-900">Start new conversation</div>
      <PmInput v-model="query" :placeholder="placeholder" />
      <slot name="below-search" />
    </div>
    <div class="overflow-y-auto px-2 pb-2"><slot /></div>
  </div>
</template>
