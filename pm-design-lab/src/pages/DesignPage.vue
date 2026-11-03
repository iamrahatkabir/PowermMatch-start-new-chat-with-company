<script setup>
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
  if (e.target.closest('input, textarea, select, [contenteditable]')) return
  const keys = design.value?.keys ?? []
  const i = keys.indexOf(current.value)
  if (/^[1-9]$/.test(e.key) && keys[e.key - 1]) go(keys[e.key - 1])
  else if (e.key === 'ArrowRight') go(keys[(i + 1) % keys.length])
  else if (e.key === 'ArrowLeft') go(keys[(i - 1 + keys.length) % keys.length])
  else if (e.key.toLowerCase() === 'h') toolbar.value = !toolbar.value
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="!design" class="p-10 text-sm text-gray-500">Unknown design “{{ route.params.slug }}”. <RouterLink to="/" class="underline">All designs</RouterLink></div>
  <template v-else>
    <component :is="Variant" v-if="Variant" :key="current" />

    <div
      v-if="toolbar"
      class="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-xl bg-gray-900 p-1.5 text-sm text-white shadow-xl"
    >
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
