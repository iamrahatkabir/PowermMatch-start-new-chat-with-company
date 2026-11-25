'use client'
// Version D: email cards with a Reply button, and the same email composer as B (built into ConversationThread).
// Ship ../inbox/email/simple/EmailCardReply.jsx (email in the thread).
import { EmailsInbox } from './parts/EmailsInbox'
import { EmailCardReply } from '../inbox/email/simple/EmailCardReply'

export default function VariantD() {
  return <EmailsInbox emailComponent={EmailCardReply} />
}
