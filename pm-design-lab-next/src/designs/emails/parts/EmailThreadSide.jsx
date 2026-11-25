'use client'
// PROTOTYPE ONLY: connects the Thread panel (../inbox/email/thread/EmailThreadPanel.jsx) to the fake inbox.
// Finds the open email and its replies, and sends a reply as a new email "RE: <subject>" in the conversation.
import { useMemo } from 'react'
import { agents, candidateProfile } from '@/mock'
import { useInbox } from '../../inbox/parts/useInbox'
import { fakeDownload } from '../../inbox/parts/fakeDownload'
import { groupReplies } from '../../inbox/email/thread/threads'
import { replySubject } from '../../inbox/email/simple/compose'
import { EmailThreadPanel } from '../../inbox/email/thread/EmailThreadPanel'

const me = agents.find((a) => a.id === 'ls')

export function EmailThreadSide() {
  const { state, selected, send, update } = useInbox()
  const items = state.threads[selected.id]
  const rootMsg = items.find((m) => m.id === state.emailThreadId)
  const replyMsgs = groupReplies(items).replies[state.emailThreadId] ?? []

  // Incoming emails have no author photo in the mock → use the conversation's photo
  const photoOf = (m) => m.authorPhoto ?? (m.dir === 'in' ? selected.photo : undefined)
  const toView = (m) => ({ ...m, body: m.text, authorPhoto: photoOf(m) })
  // Same object while the same thread is open (the panel scrolls to the top when root changes)
  const root = useMemo(() => rootMsg && toView(rootMsg), [rootMsg, selected.photo]) // eslint-disable-line react-hooks/exhaustive-deps
  const replies = replyMsgs.map(toView)

  function onSend({ body, attachments }) {
    const email = selected.email ?? candidateProfile.email
    send(body, 'email', replySubject(rootMsg.subject), {
      from: `${me.name} <las@powermatch.dk>`,
      to: `${selected.name} <${email}>`,
      attachments,
    })
  }

  if (!root) return null
  return (
    <EmailThreadPanel
      root={root}
      replies={replies}
      disabled={!selected.assignedToMe}
      onClose={() => update((s) => { s.emailThreadId = null })}
      onSend={onSend}
      onDownload={fakeDownload}
    />
  )
}
