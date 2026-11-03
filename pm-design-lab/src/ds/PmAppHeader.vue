<script setup>
import { Bell, ChevronDown, ChevronLeft } from 'lucide-vue-next'
const collapsed = defineModel('collapsed', { type: Boolean, default: false })
</script>

<template>
  <header class="relative flex h-16 shrink-0 items-center border-b border-gray-200 bg-white pr-6">
    <div class="flex h-full items-center px-5 transition-[width] duration-200 ease-pm" :class="collapsed ? 'w-[72px]' : 'w-60'">
      <img v-if="collapsed" src="/brand/logo-symbol.svg" alt="powermatch" class="h-6 w-auto" />
      <img v-else src="/brand/logo-mark.svg" alt="powermatch" class="h-5 w-auto" />
    </div>
    <button
      type="button"
      class="absolute top-1/2 hidden size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:text-gray-900 lg:flex"
      :class="collapsed ? 'left-[72px]' : 'left-60'"
      :title="collapsed ? 'Expand menu' : 'Collapse menu'"
      @click="collapsed = !collapsed"
    >
      <ChevronLeft :size="16" :class="collapsed && 'rotate-180'" />
    </button>
    <div class="ml-auto flex items-center gap-5">
      <button type="button" class="text-gray-600 hover:text-gray-900" title="Notifications"><Bell :size="20" /></button>
      <button type="button" class="flex items-center gap-2.5 text-sm text-gray-900">
        <PmAvatar name="Las Sabir" src="https://randomuser.me/api/portraits/men/75.jpg" :size="32" />
        <span class="hidden sm:inline">Las Sabir</span>
        <ChevronDown :size="16" class="text-gray-500" />
      </button>
    </div>
  </header>
</template>
