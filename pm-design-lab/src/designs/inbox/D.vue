<script setup>
// Version D preview. The UI lives in start-chat/StartChatSearchWindow.vue — this file only
// connects it to the prototype inbox (fake data + fake state).
import { clientCompanies, contactDirectory } from '@/mock'
import { provideInbox } from './parts/useInbox'
import InboxLayout from './parts/InboxLayout.vue'
import StartChatSearchWindow from './start-chat/StartChatSearchWindow.vue'

const inbox = provideInbox()
</script>

<template>
  <InboxLayout>
    <template #menu>
      <StartChatSearchWindow
        :companies="clientCompanies"
        :candidates="contactDirectory.candidates"
        :applicants="contactDirectory.applicants"
        @select-contact="inbox.startWithContact"
        @select-person="inbox.startWithPerson"
        @close="inbox.state.menuOpen = false"
      />
    </template>
  </InboxLayout>
</template>
