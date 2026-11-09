<script setup>
/**
 * Attachments of a sent/received email, compact: image thumbnails (click → full-screen preview)
 * and files as chips (click → download).
 *
 * Props:  attachments [{ id, name, size, url?, status? }] (see ../attachments.js),
 *         row? (one line each: 4 image thumbnails, then a "+N" tile; files side by side, long names shortened)
 * Events: download(file)
 */
import { computed, reactive, ref } from 'vue'
import { Download, File, FileImage, FileSpreadsheet, FileText, ImageOff } from 'lucide-vue-next'
import { formatSize, isAvailable, isImage, kind, STATUS_TEXT } from '../attachments'
import ImagePreview from '../ImagePreview.vue'

const props = defineProps({ attachments: { type: Array, required: true }, row: Boolean })
const emit = defineEmits(['download'])

const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const files = computed(() => props.attachments.filter((a) => !isImage(a) || !isAvailable(a)))
const MAX = 6
const ROW_MAX = 4
const shown = computed(() => images.value.slice(0, props.row ? ROW_MAX : MAX))
const more = computed(() => images.value.length - MAX)
const rest = computed(() => images.value.length - ROW_MAX)
const broken = reactive({})
const preview = ref(null)
const icons = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, image: FileImage }
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="shown.length" class="flex gap-1.5" :class="!row && 'flex-wrap'">
      <button
        v-for="(img, i) in shown"
        :key="img.id"
        type="button"
        class="relative size-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
        :title="img.name"
        @click="preview = i"
      >
        <ImageOff v-if="broken[img.id]" :size="18" class="m-auto text-gray-400" />
        <img v-else :src="img.url" :alt="img.name" loading="lazy" class="size-full object-cover" @error="broken[img.id] = true" />
        <span v-if="!row && i === MAX - 1 && more > 0" class="absolute inset-0 flex items-center justify-center bg-gray-900/60 font-semibold text-white">+{{ more }}</span>
      </button>
      <button
        v-if="row && rest > 0"
        type="button"
        class="flex size-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 font-semibold text-gray-700 hover:bg-gray-100"
        :title="`${rest} more images`"
        @click="preview = ROW_MAX"
      >+{{ rest }}</button>
    </div>

    <div v-if="files.length" class="flex gap-1.5" :class="!row && 'flex-wrap'">
      <button
        v-for="f in files"
        :key="f.id"
        type="button"
        class="flex min-w-0 max-w-64 items-center gap-2 rounded-lg border border-gray-200 bg-white py-1.5 pl-2 pr-2.5 text-xs disabled:cursor-default"
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

    <ImagePreview v-if="preview !== null" v-model:index="preview" :images="images" @close="preview = null" @download="(a) => emit('download', a)" />
  </div>
</template>
