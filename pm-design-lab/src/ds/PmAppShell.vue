<script setup>
import { ref } from 'vue'
// Product chrome: top header + grouped left nav + main area.
// `title` adds a page title bar; `flush` removes main padding for full-height screens (inbox, chat);
// `navCollapsed` starts the nav as icons only.
const props = defineProps({ title: String, subtitle: String, active: String, flush: Boolean, navCollapsed: Boolean })
const collapsed = ref(props.navCollapsed)
</script>

<template>
  <div class="flex h-screen flex-col bg-white">
    <PmAppHeader v-model:collapsed="collapsed" />
    <div class="flex min-h-0 flex-1">
      <PmSidebar :active="active" :collapsed="collapsed" />
      <div class="flex min-w-0 flex-1 flex-col overflow-y-auto bg-gray-50">
        <PmTopBar v-if="title" :title="title" :subtitle="subtitle"><template #actions><slot name="actions" /></template></PmTopBar>
        <main class="min-h-0 flex-1" :class="!flush && 'p-4 sm:p-8'"><slot /></main>
      </div>
    </div>
  </div>
</template>
