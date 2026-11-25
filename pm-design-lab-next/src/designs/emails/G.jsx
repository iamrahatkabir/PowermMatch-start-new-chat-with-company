'use client'
// Version G: chat-style emails + a composer that replies to the newest email automatically.
// Ship ../inbox/email/simple/EmailChatBubble.jsx (email in the thread) and ../inbox/email/simple/EmailComposerQuick.jsx (composer).
import { EmailsInbox } from './parts/EmailsInbox'
import { EmailChatBubble } from '../inbox/email/simple/EmailChatBubble'
import { EmailComposerQuick } from '../inbox/email/simple/EmailComposerQuick'

export default function VariantG() {
  return (
    <EmailsInbox
      emailComponent={EmailChatBubble}
      renderEmailComposer={({ to, replyTo, lastEmail, disabled, sendEmail, cancelReply }) => (
        <EmailComposerQuick to={to} replyTo={replyTo} lastEmail={lastEmail} disabled={disabled} onSend={sendEmail} onCancelReply={cancelReply} />
      )}
    />
  )
}
