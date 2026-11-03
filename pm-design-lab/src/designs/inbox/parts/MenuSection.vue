<script setup>
defineProps({ title: String, count: Number })
</script>

<template>
  <div class="px-2 pb-1 pt-3 text-xs font-medium text-gray-500">{{ title }}<template v-if="count != null"> ({{ count }})</template></div>
</template>
