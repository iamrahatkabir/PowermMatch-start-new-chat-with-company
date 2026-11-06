<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | outline | ghost | danger | dark
  size: { type: String, default: 'md' },         // sm | md | lg
  icon: String,                                   // icon name from /brand/icons (optional)
  block: Boolean,
})
// Each variant sets its own border color (a shared border-transparent would override it)
const variants = {
  primary: 'bg-brand text-gray-900 border-transparent hover:bg-brand-dark',
  secondary: 'bg-white text-gray-700 border-gray-300 shadow-xs hover:bg-gray-50',
  outline: 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-900/5',
  ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100',
  danger: 'bg-white text-error-700 border-error-200 shadow-xs hover:bg-error-50',
  dark: 'bg-gray-900 text-white border-transparent hover:bg-gray-800',
}
const sizes = { sm: 'px-3 py-2', md: 'px-4 py-2.5', lg: 'px-5 py-3 text-base' }
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-55"
    :class="[variants[variant], sizes[size], block && 'w-full']"
  >
    <PmIcon v-if="icon" :name="icon" :size="16" />
    <slot />
  </button>
</template>
