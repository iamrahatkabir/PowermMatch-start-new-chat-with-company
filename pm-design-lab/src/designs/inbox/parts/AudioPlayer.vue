<script setup>
import { ref } from 'vue'
import { Pause, Play } from 'lucide-vue-next'

const props = defineProps({ position: String, duration: String, progress: Number, playing: Boolean })
const isPlaying = ref(props.playing)
// Deterministic pseudo-waveform
const bars = Array.from({ length: 56 }, (_, i) => 30 + Math.round(Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) * 70))
</script>

<template>
  <div class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
    <button type="button" class="flex size-7 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100" @click="isPlaying = !isPlaying">
      <Pause v-if="isPlaying" :size="18" />
      <Play v-else :size="18" />
    </button>
    <div class="flex h-7 min-w-0 flex-1 items-center gap-[2px] overflow-hidden">
      <span
        v-for="(h, i) in bars"
        :key="i"
        class="w-[2px] shrink-0 rounded-full"
        :class="i / bars.length < progress ? 'bg-success-500' : 'bg-gray-300'"
        :style="{ height: `${h}%` }"
      />
    </div>
    <span class="shrink-0 text-xs tabular-nums text-gray-700">{{ position }} / {{ duration }}</span>
  </div>
</template>
