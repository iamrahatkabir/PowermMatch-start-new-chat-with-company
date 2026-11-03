<script setup>
defineProps({
  tone: { type: String, default: 'neutral' }, // success | warning | error | info | neutral | brand
  dot: { type: Boolean, default: true },
  bordered: Boolean, // outlined style used in side panels (Scheduled, Signed…)
})
const tones = {
  success: ['bg-success-50 text-success-700', 'bg-success-500', 'border-success-200'],
  warning: ['bg-warning-50 text-warning-700', 'bg-warning-500', 'border-warning-200'],
  error: ['bg-error-50 text-error-700', 'bg-error-500', 'border-error-200'],
  info: ['bg-info-50 text-info-700', 'bg-info-500', 'border-info-200'],
  neutral: ['bg-gray-100 text-gray-700', 'bg-gray-500', 'border-gray-300'],
  brand: ['bg-brand-bg text-brand-text border-brand', 'bg-brand-deep', 'border-brand'],
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium" :class="[tones[tone][0], bordered && tones[tone][2]]">
    <span v-if="dot" class="size-1.5 rounded-full" :class="tones[tone][1]" />
    <slot />
  </span>
</template>
