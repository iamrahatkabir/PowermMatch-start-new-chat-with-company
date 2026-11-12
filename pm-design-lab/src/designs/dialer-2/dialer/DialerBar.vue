<script setup>
/**
 * Dialer 2.0: the call bar fixed to the bottom of every page.
 * Left: status pill (Available, or Do not disturb while DND is on). Centre: call timer and call controls (only active during a call) around the big
 * Call / Hang up button. Right: missed calls (with a count), call queue, Do not disturb and audio devices.
 *
 * Props:  inCall, seconds (call length), muted, held (call on hold),
 *         missed (missed calls count), dnd (Do not disturb on: the status pill turns red "Do not disturb",
 *         the moon button turns red, and a toast shows for 2 seconds)
 * Events: call() · hang-up() · mute() · hold() · keypad() · transfer() ·
 *         history() · queue() · dnd() · devices()
 */
import { computed } from 'vue'
import { Clock, Grip, Headphones, List, Mic, MicOff, Moon, Pause, Phone, PhoneOff, Play, Shuffle } from 'lucide-vue-next'
import { formatDuration, STATUS } from './dialer'
import DndToast from './DndToast.vue'

const props = defineProps({
  inCall: Boolean,
  seconds: { type: Number, default: 0 },
  muted: Boolean,
  held: Boolean,
  missed: { type: Number, default: 0 },
  dnd: Boolean,
})
const emit = defineEmits(['call', 'hang-up', 'mute', 'hold', 'keypad', 'transfer', 'history', 'queue', 'dnd', 'devices'])

const s = computed(() => (props.dnd ? STATUS.dnd : STATUS.available))
const round = 'flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white'
const control = `${round} text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-white`
</script>

<template>
  <div class="relative flex h-16 shrink-0 items-center border-t border-gray-200 bg-white px-4">
    <!-- DND toast, above the bar's right edge -->
    <div class="pointer-events-none absolute bottom-full right-0 overflow-hidden px-4 pb-3 pt-6"><DndToast :show="dnd" /></div>

    <!-- Status -->
    <div class="flex h-11 items-center gap-2 rounded-full border py-1 pl-1 pr-4" :class="s.pill">
      <span class="flex size-8 items-center justify-center rounded-full text-white" :class="s.dot"><PhoneOff v-if="dnd" :size="16" /><Phone v-else :size="16" /></span>
      <span class="text-sm font-medium" :class="s.text">{{ s.label }}</span>
    </div>

    <!-- Call controls -->
    <div class="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
      <span
        class="flex h-10 min-w-16 items-center justify-center rounded-full px-3 text-sm tabular-nums"
        :class="inCall ? 'border border-gray-200 bg-white font-medium text-gray-900' : 'bg-gray-50 text-gray-400'"
      >{{ formatDuration(seconds) }}</span>
      <button type="button" :class="control" :disabled="!inCall" :title="muted ? 'Unmute' : 'Mute'" @click="emit('mute')">
        <MicOff v-if="muted" :size="18" class="text-error-500" /><Mic v-else :size="18" />
      </button>
      <button type="button" :class="control" :disabled="!inCall" :title="held ? 'Resume' : 'Hold'" @click="emit('hold')">
        <Play v-if="held" :size="18" /><Pause v-else :size="18" />
      </button>
      <button
        type="button"
        class="mx-1 flex size-12 items-center justify-center rounded-full text-white"
        :class="inCall ? 'bg-error-500 hover:bg-error-700' : 'bg-success-500 hover:bg-success-700'"
        :title="inCall ? 'Hang up' : 'Call'"
        @click="emit(inCall ? 'hang-up' : 'call')"
      >
        <PhoneOff v-if="inCall" :size="20" /><Phone v-else :size="20" />
      </button>
      <button type="button" :class="control" :disabled="!inCall" title="Keypad" @click="emit('keypad')"><Grip :size="18" /></button>
      <button type="button" :class="control" :disabled="!inCall" title="Transfer" @click="emit('transfer')"><Shuffle :size="18" /></button>
    </div>

    <!-- Tools -->
    <div class="ml-auto flex items-center gap-2">
      <button type="button" :class="[control, 'relative']" title="Missed calls" @click="emit('history')">
        <Clock :size="18" />
        <span v-if="missed" class="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-error-500 text-[11px] font-semibold text-white">{{ missed }}</span>
      </button>
      <button type="button" :class="control" title="Call queue" @click="emit('queue')"><List :size="18" /></button>
      <button type="button" :class="[control, dnd && '!border-error-500 !bg-error-500 !text-white hover:!bg-error-700']" :title="dnd ? 'Turn off Do not disturb' : 'Do not disturb'" @click="emit('dnd')"><Moon :size="18" /></button>
      <button type="button" :class="control" title="Audio devices" @click="emit('devices')"><Headphones :size="18" /></button>
    </div>
  </div>
</template>
