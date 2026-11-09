<script setup>
// Version E: View details opens a modal — the email in the thread is ../inbox/email/EmailMessageModal.vue
// (with EmailDetailsModal.vue). Ship those files.
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailMessageModal from '../inbox/email/EmailMessageModal.vue'
</script>

<template>
  <EmailsInbox :email-component="EmailMessageModal" />
</template>
