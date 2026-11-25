'use client'
// Version A: email replies live in a thread, like notes. The conversation shows only the first email of each
// thread with "N replies • Last reply …"; clicking it opens the Thread panel on the right with all replies
// and a reply box. Ship ../inbox/email/thread/ (EmailThreadRoot.jsx, EmailThreadPanel.jsx, threads.js).
import { emailThreadSamples } from '@/mock'
import { EmailsInbox } from './parts/EmailsInbox'
import { EmailThreadSide } from './parts/EmailThreadSide'
import { EmailThreadRoot } from '../inbox/email/thread/EmailThreadRoot'

export default function VariantA() {
  return <EmailsInbox emailComponent={EmailThreadRoot} groupReplies threadPanel={EmailThreadSide} extraEmails={emailThreadSamples} />
}
