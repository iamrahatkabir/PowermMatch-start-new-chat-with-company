<script setup>
// Version D: split modal — same email in the thread as C (../inbox/email/EmailMessageModal.vue),
// opening ../inbox/email/EmailDetailsSplit.vue instead of the centered modal. Ship both files.
import { h } from 'vue'
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailMessageModal from '../inbox/email/EmailMessageModal.vue'
import EmailDetailsSplit from '../inbox/email/EmailDetailsSplit.vue'

const Email = (props, { attrs }) => h(EmailMessageModal, { ...attrs, details: EmailDetailsSplit })
</script>

<template>
  <EmailsInbox :email-component="Email" />
</template>
