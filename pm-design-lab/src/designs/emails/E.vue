<script setup>
// Version E: chat-style emails + a composer that replies to the newest email automatically.
// Ship ../inbox/email/simple/EmailChatBubble.vue (email in the thread) and ../inbox/email/simple/EmailComposerQuick.vue (composer).
import EmailsInbox from './parts/EmailsInbox.vue'
import EmailChatBubble from '../inbox/email/simple/EmailChatBubble.vue'
import EmailComposerQuick from '../inbox/email/simple/EmailComposerQuick.vue'
</script>

<template>
  <EmailsInbox :email-component="EmailChatBubble">
    <template #email-composer="{ to, replyTo, lastEmail, disabled, sendEmail, cancelReply }">
      <EmailComposerQuick :to="to" :reply-to="replyTo" :last-email="lastEmail" :disabled="disabled" @send="sendEmail" @cancel-reply="cancelReply" />
    </template>
  </EmailsInbox>
</template>
