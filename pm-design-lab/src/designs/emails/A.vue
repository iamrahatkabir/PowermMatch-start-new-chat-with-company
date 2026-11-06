<script setup>
// Version A: no View details — every email is fully open (From / To, full text, quoted text, files)
// with Reply always visible. Ship ../inbox/email/EmailMessage.vue and pass always-open.
import { h } from 'vue'
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailMessage from '../inbox/email/EmailMessage.vue'

const Email = (props, { attrs }) => h(EmailMessage, { ...attrs, alwaysOpen: true })
</script>

<template>
  <EmailsInbox :email-component="Email" />
</template>
