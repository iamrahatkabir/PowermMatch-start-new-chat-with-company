<script setup>
/**
 * "You are now in DND mode" toast. Shows for 2 seconds after `show` turns true, then slides out to the right.
 * Positioned by the parent (DialerBar puts it above the bar's right edge).
 *
 * Props: show (Do not disturb just turned on)
 */
import { onBeforeUnmount, ref, watch } from 'vue'
import { Moon } from 'lucide-vue-next'

const props = defineProps({ show: Boolean })
const visible = ref(false)
let timer

watch(
  () => props.show,
  (on) => {
    clearTimeout(timer)
    visible.value = on
    if (on) timer = setTimeout(() => (visible.value = false), 2000)
  },
)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-[calc(100%+1rem)] opacity-0"
    leave-active-class="transition duration-300 ease-in"
    leave-to-class="translate-x-[calc(100%+1rem)] opacity-0"
  >
    <div v-if="visible" role="status" class="flex w-72 items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-error-500 text-white"><Moon :size="18" /></span>
      <div class="min-w-0">
        <div class="text-sm font-medium text-gray-900">You are now in DND mode</div>
        <div class="text-xs leading-5 text-gray-600">Disable DND to start receiving calls again</div>
      </div>
    </div>
  </Transition>
</template>
