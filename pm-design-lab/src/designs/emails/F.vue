<script setup>
// Version F: email cards with a Reply button + a Reply / New email composer.
// Ship ../inbox/email/simple/EmailCardReply.vue (email in the thread) and ../inbox/email/simple/EmailComposerReplyNew.vue (composer).
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailCardReply from '../inbox/email/simple/EmailCardReply.vue'
import EmailComposerReplyNew from '../inbox/email/simple/EmailComposerReplyNew.vue'
</script>

<template>
  <EmailsInbox :email-component="EmailCardReply">
    <template #email-composer="{ to, replyTo, lastEmail, disabled, sendEmail, cancelReply }">
      <EmailComposerReplyNew :to="to" :reply-to="replyTo" :last-email="lastEmail" :disabled="disabled" @send="sendEmail" @cancel-reply="cancelReply" />
    </template>
  </EmailsInbox>
</template>
