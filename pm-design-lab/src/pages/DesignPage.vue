<script setup>
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GripVertical } from 'lucide-vue-next'
import { getDesign, loadVariant } from '@/lab/registry'

// /d/:slug?v=B — keys 1-9 / ← → switch variants, H hides the toolbar
const route = useRoute()
const router = useRouter()
const design = computed(() => getDesign(route.params.slug))
const toolbar = ref(true)

const current = computed(() => {
  const d = design.value
  if (!d?.keys.length) return null
  return d.keys.includes(route.query.v) ? route.query.v : d.keys[0]
})

const Variant = computed(() => current.value && defineAsyncComponent(() => loadVariant(design.value.slug, current.value)))

const go = (k) => router.replace({ query: { ...route.query, v: k } })

function onKey(e) {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return
  const keys = design.value?.keys ?? []
  const i = keys.indexOf(current.value)
  if (/^[1-9]$/.test(e.key) && keys[e.key - 1]) go(keys[e.key - 1])
  else if (e.key === 'ArrowRight') go(keys[(i + 1) % keys.length])
  else if (e.key === 'ArrowLeft') go(keys[(i - 1 + keys.length) % keys.length])
  else if (e.key.toLowerCase() === 'h') toolbar.value = !toolbar.value
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

// Draggable toolbar: grab the handle to move it anywhere. The spot is remembered for every design
// (localStorage). Double-click the handle to put it back at the bottom center.
const STORE = 'pm-lab-toolbar-pos'
const bar = ref()
const pos = ref(read())
function read() {
  try { return JSON.parse(localStorage.getItem(STORE)) } catch { return null }
}
function save() {
  try { pos.value ? localStorage.setItem(STORE, JSON.stringify(pos.value)) : localStorage.removeItem(STORE) } catch {}
}
function clamp({ x, y }) {
  const r = bar.value?.getBoundingClientRect()
  const w = r?.width ?? 0
  const h = r?.height ?? 0
  return { x: Math.min(Math.max(8, x), window.innerWidth - w - 8), y: Math.min(Math.max(8, y), window.innerHeight - h - 8) }
}
let offset = null
function startDrag(e) {
  const r = bar.value.getBoundingClientRect()
  offset = { x: e.clientX - r.left, y: e.clientY - r.top }
  e.currentTarget.setPointerCapture(e.pointerId)
}
function drag(e) {
  if (offset) pos.value = clamp({ x: e.clientX - offset.x, y: e.clientY - offset.y })
}
function endDrag() {
  if (!offset) return
  offset = null
  save()
}
function resetPos() {
  pos.value = null
  save()
}
const keepInView = () => pos.value && (pos.value = clamp(pos.value))
onMounted(() => (window.addEventListener('resize', keepInView), nextTick(keepInView)))
// The bar's width changes with the design title / version label, so re-check it stays on screen
watch([() => route.params.slug, current], () => nextTick(keepInView))
onUnmounted(() => window.removeEventListener('resize', keepInView))
</script>

<template>
  <div v-if="!design" class="p-10 text-sm text-gray-500">Unknown design “{{ route.params.slug }}”. <RouterLink to="/" class="underline">All designs</RouterLink></div>
  <template v-else>
    <component :is="Variant" v-if="Variant" :key="current" />

    <div
      v-if="toolbar"
      ref="bar"
      class="fixed z-50 flex max-w-[calc(100vw-32px)] items-center gap-1 overflow-x-auto rounded-xl bg-gray-900 p-1.5 text-sm text-white shadow-xl"
      :class="!pos && 'bottom-4 left-1/2 -translate-x-1/2'"
      :style="pos && { left: `${pos.x}px`, top: `${pos.y}px` }"
    >
      <span
        class="flex shrink-0 cursor-grab touch-none items-center self-stretch rounded-lg px-0.5 text-gray-500 hover:bg-gray-800 hover:text-white active:cursor-grabbing"
        title="Drag to move · double-click to reset"
        @pointerdown.prevent="startDrag"
        @pointermove="drag"
        @pointerup="endDrag"
        @pointercancel="endDrag"
        @dblclick="resetPos"
      ><GripVertical :size="16" /></span>
      <RouterLink to="/" class="rounded-lg px-2.5 py-1.5 text-gray-400 hover:text-white" title="All designs">←</RouterLink>
      <span class="hidden max-w-48 truncate px-2 font-semibold sm:inline" :title="design.title">{{ design.title }}</span>
      <button
        v-for="(k, i) in design.keys"
        :key="k"
        type="button"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 font-semibold"
        :class="k === current ? 'bg-brand text-gray-900' : 'text-gray-300 hover:bg-gray-800'"
        :title="`${design.variants?.[k] ?? ''} (${i + 1})`"
        @click="go(k)"
      >
        {{ k }}<span v-if="design.variants?.[k] && k === current" class="ml-1.5 hidden font-normal md:inline">{{ design.variants[k] }}</span>
      </button>
      <span class="hidden whitespace-nowrap px-2 text-xs text-gray-400 lg:inline">1–9 · ← → · H hide</span>
    </div>
  </template>
</template>
