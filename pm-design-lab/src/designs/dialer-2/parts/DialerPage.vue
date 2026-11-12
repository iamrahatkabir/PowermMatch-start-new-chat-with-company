<script setup>
// PROTOTYPE ONLY: an empty product page with the Dialer 2.0 call bar at the bottom, plus fake call state
// (Call starts a timer, Hang up stops it; mute / hold / Do not disturb toggle).
import { onBeforeUnmount, ref } from 'vue'
import DialerBar from '../dialer/DialerBar.vue'

const inCall = ref(false)
const seconds = ref(0)
const muted = ref(false)
const held = ref(false)
const dnd = ref(false)
let timer

function call() {
  inCall.value = true
  seconds.value = 0
  timer = setInterval(() => !held.value && seconds.value++, 1000)
}
function hangUp() {
  clearInterval(timer)
  inCall.value = muted.value = held.value = false
  seconds.value = 0
}
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <!-- The bar spans the full width under the nav; the app shell fills the space above it -->
  <div class="flex h-screen flex-col bg-white">
    <div class="min-h-0 flex-1 [&>div]:!h-full">
      <PmAppShell active="" :nav-collapsed="false" flush><div class="h-full bg-white" /></PmAppShell>
    </div>
    <DialerBar
      :in-call="inCall"
      :seconds="seconds"
      :muted="muted"
      :held="held"
      :missed="2"
      :dnd="dnd"
      @call="call"
      @hang-up="hangUp"
      @mute="muted = !muted"
      @hold="held = !held"
      @dnd="dnd = !dnd"
    />
  </div>
</template>
