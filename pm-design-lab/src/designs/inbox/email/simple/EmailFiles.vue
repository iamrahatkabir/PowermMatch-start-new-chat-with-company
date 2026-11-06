<script setup>
/**
 * Attachments of a sent/received email, compact: image thumbnails (click → full-screen preview)
 * and files as chips (click → download). Shows "Download all" for 2+ files.
 *
 * Props:  attachments [{ id, name, size, url?, status? }] (see ../attachments.js)
 * Events: download(file) · download-all(files)
 */
import { computed, reactive, ref } from 'vue'
import { Download, File, FileImage, FileSpreadsheet, FileText, ImageOff } from 'lucide-vue-next'
import { formatSize, isAvailable, isImage, kind, STATUS_TEXT } from '../attachments'
import ImagePreview from '../ImagePreview.vue'

const props = defineProps({ attachments: { type: Array, required: true } })
const emit = defineEmits(['download', 'download-all'])

const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const files = computed(() => props.attachments.filter((a) => !isImage(a) || !isAvailable(a)))
const downloadable = computed(() => props.attachments.filter(isAvailable))
const MAX = 6
const shown = computed(() => images.value.slice(0, MAX))
const more = computed(() => images.value.length - MAX)
const broken = reactive({})
const preview = ref(null)
const icons = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, image: FileImage }
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="shown.length" class="flex flex-wrap gap-1.5">
      <button
        v-for="(img, i) in shown"
        :key="img.id"
        type="button"
        class="relative size-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
        :title="img.name"
        @click="preview = i"
      >
        <ImageOff v-if="broken[img.id]" :size="18" class="m-auto text-gray-400" />
        <img v-else :src="img.url" :alt="img.name" loading="lazy" class="size-full object-cover" @error="broken[img.id] = true" />
        <span v-if="i === MAX - 1 && more > 0" class="absolute inset-0 flex items-center justify-center bg-gray-900/60 font-semibold text-white">+{{ more }}</span>
      </button>
    </div>

    <div v-if="files.length" class="flex flex-wrap gap-1.5">
      <button
        v-for="f in files"
        :key="f.id"
        type="button"
        class="flex max-w-64 items-center gap-2 rounded-lg border border-gray-200 bg-white py-1.5 pl-2 pr-2.5 text-xs disabled:cursor-default"
        :class="isAvailable(f) && 'hover:bg-gray-50'"
        :disabled="!isAvailable(f)"
        :title="isAvailable(f) ? `Download ${f.name}` : STATUS_TEXT[f.status]"
        @click="emit('download', f)"
      >
        <component :is="icons[kind(f.name)] ?? File" :size="15" class="shrink-0" :class="isAvailable(f) ? 'text-gray-600' : 'text-gray-300'" />
        <span class="min-w-0 truncate font-medium" :class="isAvailable(f) ? 'text-gray-900' : 'text-gray-400'">{{ f.name }}</span>
        <span class="shrink-0 text-gray-500">{{ isAvailable(f) ? formatSize(f.size) : STATUS_TEXT[f.status] }}</span>
        <Download v-if="isAvailable(f)" :size="13" class="shrink-0 text-gray-500" />
      </button>
    </div>

    <button
      v-if="downloadable.length > 1"
      type="button"
      class="flex w-fit items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
      @click="emit('download-all', downloadable)"
    ><Download :size="13" />Download all ({{ downloadable.length }})</button>

    <ImagePreview v-if="preview !== null" v-model:index="preview" :images="images" @close="preview = null" @download="(a) => emit('download', a)" />
  </div>
</template>
