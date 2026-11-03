<script setup>
import { useInbox } from './useInbox'
import ConversationList from './ConversationList.vue'
import ConversationThread from './ConversationThread.vue'
import CandidatePanel from './CandidatePanel.vue'
import CompanyPanel from './CompanyPanel.vue'

// The full inbox. Variants pass their "Start new conversation" menu in the #menu slot.
const { selected } = useInbox()
</script>

<template>
  <PmAppShell active="inbox-all" flush nav-collapsed>
    <div class="flex h-full bg-white">
      <ConversationList><template #menu><slot name="menu" /></template></ConversationList>
      <ConversationThread />
      <CompanyPanel v-if="selected.kind === 'company'" />
      <CandidatePanel v-else />
    </div>
  </PmAppShell>
</template>
