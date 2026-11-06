<script setup>
// Emails screen preview: the shared inbox with Dianne Russell's email conversation open
// and the composer on the Email tab. The email UI itself lives in ../inbox/email/.
import { clientCompanies, contactDirectory } from '@/mock'
import { provideInbox } from '../inbox/parts/useInbox'
import InboxLayout from '../inbox/parts/InboxLayout.vue'
import StartChatSections from '../inbox/start-chat/StartChatSections.vue'

const inbox = provideInbox({ selectedId: 'cv-dianne', menuOpen: false })
</script>

<template>
  <InboxLayout :nav-collapsed="false">
    <template #menu>
      <StartChatSections
        :companies="clientCompanies"
        :candidates="contactDirectory.candidates"
        :applicants="contactDirectory.applicants"
        @select-contact="inbox.startWithContact"
        @select-person="inbox.startWithPerson"
      />
    </template>
  </InboxLayout>
</template>
