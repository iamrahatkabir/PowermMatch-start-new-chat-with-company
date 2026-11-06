<script setup>
/**
 * Full-screen image preview for email images. ← → to browse, Esc to close.
 *
 * Props:  images [{ id, name, size, url }], index (v-model:index — the image shown)
 * Events: close() · download(image) · update:index(i)
 */
import { onBeforeUnmount, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-vue-next'
import { formatSize } from './attachments'

const props = defineProps({ images: { type: Array, required: true }, index: { type: Number, default: 0 } })
const emit = defineEmits(['close', 'download', 'update:index'])

const go = (step) => emit('update:index', (props.index + step + props.images.length) % props.images.length)
function onKey(e) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
  else return
  e.stopPropagation()
}
// Capture phase so the lab's ← → version switcher doesn't react while the preview is open
onMounted(() => window.addEventListener('keydown', onKey, true))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey, true))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex flex-col bg-gray-900/90" @click.self="emit('close')">
      <div class="flex items-center gap-3 px-6 py-4 text-sm text-white">
        <span class="min-w-0 truncate font-medium">{{ images[index].name }}</span>
        <span class="shrink-0 text-gray-300">{{ formatSize(images[index].size) }} • {{ index + 1 }} of {{ images.length }}</span>
        <button type="button" class="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium hover:bg-white/10" @click="emit('download', images[index])">
          <Download :size="16" />Download
        </button>
        <button type="button" class="flex size-9 items-center justify-center rounded-lg hover:bg-white/10" title="Close" @click="emit('close')"><X :size="20" /></button>
      </div>
      <div class="relative flex min-h-0 flex-1 items-center justify-center px-20 pb-10" @click.self="emit('close')">
        <img :src="images[index].url" :alt="images[index].name" class="max-h-full max-w-full rounded-lg object-contain" />
        <template v-if="images.length > 1">
          <button type="button" class="absolute left-6 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" title="Previous" @click="go(-1)"><ChevronLeft :size="22" /></button>
          <button type="button" class="absolute right-6 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" title="Next" @click="go(1)"><ChevronRight :size="22" /></button>
        </template>
      </div>
    </div>
  </Teleport>
</template>
