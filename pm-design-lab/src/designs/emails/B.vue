<script setup>
// Version B: same bubble as the modal version (subject, attachment counts, 2-line body), but View details
// expands the email in place below it. Ship ../inbox/email/EmailMessageExpand.vue.
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailMessageExpand from '../inbox/email/EmailMessageExpand.vue'
</script>

<template>
  <EmailsInbox :email-component="EmailMessageExpand" />
</template>
