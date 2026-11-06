<script setup>
// PROTOTYPE ONLY: the inbox with Dianne Russell's email conversation open and the sidebar expanded.
// Versions pass their email composer in the #email-composer slot (A uses the built-in one).
import { clientCompanies, contactDirectory } from '@/mock'
import { provideInbox } from '../../inbox/parts/useInbox'
import InboxLayout from '../../inbox/parts/InboxLayout.vue'
import StartChatSections from '../../inbox/start-chat/StartChatSections.vue'

// emailComponent: a version's email-in-thread component (default: ../inbox/email/EmailMessage.vue)
defineProps({ emailComponent: Object })
const inbox = provideInbox({ selectedId: 'cv-dianne', menuOpen: false })
</script>

<template>
  <InboxLayout :nav-collapsed="false" :email-component="emailComponent">
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
