<script setup>
import { Building2 } from 'lucide-vue-next'
// type: company | contact | person (default)
defineProps({ type: { type: String, default: 'person' }, name: String, photo: String, logo: String, size: { type: Number, default: 40 } })
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
</script>

<template>
  <span
    v-if="type === 'company'"
    class="flex shrink-0 items-center justify-center rounded-full"
    :class="logo === 'poly' ? 'bg-success-500 text-white' : 'border border-gray-200 bg-gray-50 text-gray-600'"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <Building2 :size="Math.round(size * 0.45)" />
  </span>
  <span
    v-else-if="type === 'contact'"
    class="flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white font-medium text-gray-600"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.36)}px` }"
  >{{ initials(name) }}</span>
  <PmAvatar v-else :name="name" :src="photo" :size="size" />
</template>
