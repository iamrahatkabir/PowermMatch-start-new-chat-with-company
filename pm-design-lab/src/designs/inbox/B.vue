<script setup>
// Version B preview. The UI lives in start-chat/StartChatTabs.vue — this file only
// connects it to the prototype inbox (fake data + fake state).
import { clientCompanies, contactDirectory } from '@/mock'
import { provideInbox } from './parts/useInbox'
import InboxLayout from './parts/InboxLayout.vue'
import StartChatTabs from './start-chat/StartChatTabs.vue'

const inbox = provideInbox()
</script>

<template>
  <InboxLayout>
    <template #menu>
      <StartChatTabs
        :companies="clientCompanies"
        :candidates="contactDirectory.candidates"
        :applicants="contactDirectory.applicants"
        @select-contact="inbox.startWithContact"
        @select-person="inbox.startWithPerson"
      />
    </template>
  </InboxLayout>
</template>
