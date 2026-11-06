<script setup>
import { useInbox } from './useInbox'
import ConversationList from './ConversationList.vue'
import ConversationThread from './ConversationThread.vue'
import CandidatePanel from './CandidatePanel.vue'
import CompanyPanel from './CompanyPanel.vue'
import NotificationSettingsView from './NotificationSettingsView.vue'

// The full inbox. Variants pass their "Start new conversation" menu in the #menu slot.
// Email designs can swap the Email tab's composer through the #email-composer slot (see ConversationThread).
// Nav: Inbox → All shows conversations, Inbox → Notification settings shows settings.
defineProps({ navCollapsed: { type: Boolean, default: true }, emailComponent: Object })
const { state, selected } = useInbox()
const views = ['inbox-all', 'inbox-notifications']
const onNav = (key) => views.includes(key) && (state.view = key)
</script>

<template>
  <PmAppShell :active="state.view" flush :nav-collapsed="navCollapsed" @nav="onNav">
    <NotificationSettingsView v-if="state.view === 'inbox-notifications'" />
    <div v-else class="flex h-full bg-white">
      <ConversationList><template #menu><slot name="menu" /></template></ConversationList>
      <ConversationThread v-bind="emailComponent ? { emailComponent } : {}">
        <template v-if="$slots['email-composer']" #email-composer="props"><slot name="email-composer" v-bind="props" /></template>
      </ConversationThread>
      <CompanyPanel v-if="selected.kind === 'company'" />
      <CandidatePanel v-else />
    </div>
  </PmAppShell>
</template>
