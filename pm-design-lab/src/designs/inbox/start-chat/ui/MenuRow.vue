<script setup>
import { ChevronRight } from 'lucide-vue-next'
import EntityAvatar from './EntityAvatar.vue'
import Highlight from './Highlight.vue'
// One result row. `entity` = { type, name, photo?, logo? }; `subtitle` is highlighted too.
defineProps({ entity: Object, subtitle: String, query: { type: String, default: '' }, chevron: Boolean, active: Boolean })
</script>

<template>
  <button type="button" class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-50" :class="active && 'bg-gray-50'">
    <slot name="avatar"><EntityAvatar v-bind="entity" :size="36" /></slot>
    <span class="min-w-0 flex-1">
      <span class="block truncate text-sm font-medium text-gray-900"><Highlight :text="entity.name" :query="query" /></span>
      <span v-if="subtitle" class="block truncate text-xs text-gray-500"><Highlight :text="subtitle" :query="query" /></span>
    </span>
    <slot name="end" />
    <ChevronRight v-if="chevron" :size="16" class="shrink-0 text-gray-400" />
  </button>
</template>
