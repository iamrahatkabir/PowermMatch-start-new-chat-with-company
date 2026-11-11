<script setup>
// Version G: email replies live in a thread, like notes. The conversation shows only the first email of each
// thread with "N replies • Last reply …"; clicking it opens the Thread panel on the right with all replies
// and a reply box. Ship ../inbox/email/thread/ (EmailThreadRoot.vue, EmailThreadPanel.vue, threads.js).
import { emailThreadSamples } from '@/mock'
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailThreadSide from './parts/EmailThreadSide.vue'
import EmailThreadRoot from '../inbox/email/thread/EmailThreadRoot.vue'
</script>

<template>
  <EmailsInbox :email-component="EmailThreadRoot" group-replies :thread-panel="EmailThreadSide" :extra-emails="emailThreadSamples" />
</template>
