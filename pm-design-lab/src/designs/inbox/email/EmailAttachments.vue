<script setup>
/**
 * Attachments of one email: images as thumbnails (click → preview), other files as cards with a download button.
 * Unavailable files (expired / blocked) are shown but can't be downloaded.
 *
 * Props:  attachments [{ id, name, size, url?, status? }], stacked? (files in one column, for narrow spaces),
 *          small? (80px image thumbnails in a row, like the simple E version)
 * Events: download(attachment) · preview(index into images)
 */
import { computed, reactive } from 'vue'
import { Download, File, FileArchive, FileImage, FileSpreadsheet, FileText, ImageOff, ShieldAlert, Clock } from 'lucide-vue-next'
import { isImage, isAvailable, kind, extension, formatSize, STATUS_TEXT } from './attachments'

const props = defineProps({ attachments: { type: Array, required: true }, stacked: Boolean, small: Boolean })
const emit = defineEmits(['download', 'preview'])

const images = computed(() => props.attachments.filter((a) => isImage(a) && isAvailable(a)))
const files = computed(() => props.attachments.filter((a) => !isImage(a) || !isAvailable(a)))

// Thumbnails: up to 6, the last one shows "+N" when there are more.
// small: 4 images, then a separate "+N" tile for the rest (opens the preview at the 5th image).
const MAX = 6
const SMALL_MAX = 4
const shown = computed(() => images.value.slice(0, props.small ? SMALL_MAX : MAX))
const hidden = computed(() => images.value.length - MAX)
const rest = computed(() => images.value.length - SMALL_MAX)
const broken = reactive({})

const icons = { pdf: FileText, doc: FileText, sheet: FileSpreadsheet, archive: FileArchive, image: FileImage, file: File }
const tiles = {
  pdf: 'bg-error-50 text-error-700',
  doc: 'bg-info-50 text-info-700',
  sheet: 'bg-success-50 text-success-700',
  archive: 'bg-gray-100 text-gray-600',
  image: 'bg-gray-100 text-gray-600',
  file: 'bg-gray-100 text-gray-600',
}
</script>

<template>
  <div class="mt-3 flex flex-col gap-2">
    <!-- Images -->
    <div
      v-if="shown.length"
      :class="small ? 'flex flex-wrap gap-1.5' : ['grid gap-2', shown.length === 1 ? 'max-w-sm grid-cols-1' : shown.length === 2 ? 'max-w-lg grid-cols-2' : 'max-w-lg grid-cols-3']"
    >
      <button
        v-for="(img, i) in shown"
        :key="img.id"
        type="button"
        class="group relative overflow-hidden border border-gray-200 bg-white"
        :class="small ? 'size-20 rounded-lg' : ['rounded-xl', shown.length === 1 ? 'aspect-[4/3]' : 'aspect-square']"
        :title="img.name"
        @click="emit('preview', i)"
      >
        <div v-if="broken[img.id]" class="flex size-full flex-col items-center justify-center gap-1 bg-gray-50 px-2 text-xs text-gray-500">
          <ImageOff :size="small ? 18 : 20" /><template v-if="!small">Image can't be shown</template>
        </div>
        <img v-else :src="img.url" :alt="img.name" loading="lazy" class="size-full object-cover" @error="broken[img.id] = true" />
        <span
          v-if="!small && i === MAX - 1 && hidden > 0"
          class="absolute inset-0 flex items-center justify-center bg-gray-900/60 font-semibold text-white"
          :class="!small && 'text-lg'"
        >+{{ hidden }}</span>
        <span
          v-else-if="!small"
          class="absolute right-1.5 top-1.5 hidden size-7 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 group-hover:flex"
          title="Download"
          @click.stop="emit('download', img)"
        ><Download :size="14" /></span>
      </button>
      <button
        v-if="small && rest > 0"
        type="button"
        class="flex size-20 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 font-semibold text-gray-700 hover:bg-gray-100"
        :title="`${rest} more images`"
        @click="emit('preview', SMALL_MAX)"
      >+{{ rest }}</button>
    </div>

    <!-- Files -->
    <div v-if="files.length" class="grid max-w-2xl grid-cols-1 gap-2" :class="!stacked && 'sm:grid-cols-2'">
      <div
        v-for="f in files"
        :key="f.id"
        class="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5"
      >
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg" :class="isAvailable(f) ? tiles[kind(f.name)] : 'bg-gray-100 text-gray-400'">
          <component :is="icons[kind(f.name)]" :size="18" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm font-medium" :class="isAvailable(f) ? 'text-gray-900' : 'text-gray-500'" :title="f.name">{{ f.name }}</div>
          <div v-if="isAvailable(f)" class="text-xs text-gray-500">{{ extension(f.name) }} • {{ formatSize(f.size) }}</div>
          <div v-else class="flex items-center gap-1 text-xs" :class="f.status === 'blocked' ? 'text-error-700' : 'text-gray-500'">
            <component :is="f.status === 'blocked' ? ShieldAlert : Clock" :size="12" />{{ STATUS_TEXT[f.status] }}
          </div>
        </div>
        <button
          v-if="isAvailable(f)"
          type="button"
          class="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
          title="Download"
          @click="emit('download', f)"
        ><Download :size="16" /></button>
      </div>
    </div>
  </div>
</template>
