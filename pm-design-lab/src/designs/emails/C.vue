<script setup>
// Version C: email cards with a Reply button, and the same email composer as A (built into ConversationThread).
// Ship ../inbox/email/simple/EmailCardReply.vue (email in the thread).
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailCardReply from '../inbox/email/simple/EmailCardReply.vue'
</script>

<template>
  <EmailsInbox :email-component="EmailCardReply" />
</template>
