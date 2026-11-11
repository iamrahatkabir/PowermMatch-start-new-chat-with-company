<script setup>
// PROTOTYPE ONLY: connects the Thread panel (../inbox/email/thread/EmailThreadPanel.vue) to the fake inbox.
// Finds the open email and its replies, and sends a reply as a new email "RE: <subject>" in the conversation.
import { computed } from 'vue'
import { agents, candidateProfile } from '@/mock'
import { useInbox } from '../../inbox/parts/useInbox'
import { fakeDownload } from '../../inbox/parts/fakeDownload'
import { groupReplies } from '../../inbox/email/thread/threads'
import { replySubject } from '../../inbox/email/simple/compose'
import EmailThreadPanel from '../../inbox/email/thread/EmailThreadPanel.vue'

const { state, selected, send } = useInbox()
const items = computed(() => state.threads[selected.value.id])
const rootMsg = computed(() => items.value.find((m) => m.id === state.emailThreadId))
const replyMsgs = computed(() => groupReplies(items.value).replies[state.emailThreadId] ?? [])

// Incoming emails have no author photo in the mock → use the conversation's photo
const photoOf = (m) => m.authorPhoto ?? (m.dir === 'in' ? selected.value.photo : undefined)
const toView = (m) => ({ ...m, body: m.text, authorPhoto: photoOf(m) })
const root = computed(() => rootMsg.value && toView(rootMsg.value))
const replies = computed(() => replyMsgs.value.map(toView))

const me = agents.find((a) => a.id === 'ls')
function onSend({ body, attachments }) {
  const email = selected.value.email ?? candidateProfile.email
  send(body, 'email', replySubject(rootMsg.value.subject), {
    from: `${me.name} <las@powermatch.dk>`,
    to: `${selected.value.name} <${email}>`,
    attachments,
  })
}
</script>

<template>
  <EmailThreadPanel
    v-if="root"
    :root="root"
    :replies="replies"
    :disabled="!selected.assignedToMe"
    @close="state.emailThreadId = null"
    @send="onSend"
    @download="fakeDownload"
  />
</template>
