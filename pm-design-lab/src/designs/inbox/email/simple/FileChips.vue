<script setup>
/**
 * Files added to an email being written, each with a remove button.
 * Props: attachments [{ id, name, size }] · Events: remove(id)
 */
import { File, FileImage, FileSpreadsheet, FileText, X } from 'lucide-vue-next'
import { formatSize, kind } from '../attachments'

defineProps({ attachments: { type: Array, required: true } })
const emit = defineEmits(['remove'])
const icons = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, image: FileImage }
</script>

<template>
  <div v-if="attachments.length" class="flex flex-wrap gap-1.5">
    <span v-for="a in attachments" :key="a.id" class="flex max-w-60 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-1 pl-2 pr-1 text-xs text-gray-700">
      <component :is="icons[kind(a.name)] ?? File" :size="14" class="shrink-0 text-gray-500" />
      <span class="min-w-0 truncate font-medium" :title="a.name">{{ a.name }}</span>
      <span class="shrink-0 text-gray-500">{{ formatSize(a.size) }}</span>
      <button type="button" class="flex size-5 shrink-0 items-center justify-center rounded hover:bg-gray-200" :title="`Remove ${a.name}`" @click="emit('remove', a.id)"><X :size="12" /></button>
    </span>
  </div>
</template>
