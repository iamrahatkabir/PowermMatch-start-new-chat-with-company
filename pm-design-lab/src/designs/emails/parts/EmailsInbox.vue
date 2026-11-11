<script setup>
// PROTOTYPE ONLY: the inbox with Dianne Russell's email conversation open and the sidebar expanded.
// Versions pass their email composer in the #email-composer slot (A uses the built-in one).
import { clientCompanies, contactDirectory } from '@/mock'
import { provideInbox } from '../../inbox/parts/useInbox'
import InboxLayout from '../../inbox/parts/InboxLayout.vue'
import StartChatSections from '../../inbox/start-chat/StartChatSections.vue'

// emailComponent: a version's email-in-thread component (default: ../inbox/email/EmailMessage.vue)
// groupReplies + threadPanel: version G (replies live in a Thread panel, see EmailThreadSide.vue)
// extraEmails: more emails added to the end of Dianne's conversation (version G's sample replies)
const props = defineProps({ emailComponent: Object, groupReplies: Boolean, threadPanel: Object, extraEmails: { type: Array, default: () => [] } })
const inbox = provideInbox({ selectedId: 'cv-dianne', menuOpen: false })
inbox.state.threads['cv-dianne'].push(...structuredClone(props.extraEmails))
</script>

<template>
  <InboxLayout :nav-collapsed="false" :email-component="emailComponent" :group-replies="groupReplies" :thread-panel="threadPanel">
    <template #menu>
      <StartChatSections
        :companies="clientCompanies"
        :candidates="contactDirectory.candidates"
        :applicants="contactDirectory.applicants"
        @select-contact="inbox.startWithContact"
        @select-person="inbox.startWithPerson"
      />
    </template>
    <template v-if="$slots['email-composer']" #email-composer="props"><slot name="email-composer" v-bind="props" /></template>
  </InboxLayout>
</template>
