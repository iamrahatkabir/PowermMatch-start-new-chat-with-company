'use client'
// Version C: same bubble as the modal version (subject, attachment counts, 2-line body), but View details
// expands the email in place below it. Ship ../inbox/email/EmailMessageExpand.jsx.
import { EmailsInbox } from './parts/EmailsInbox'
import { EmailMessageExpand } from '../inbox/email/EmailMessageExpand'

export default function VariantC() {
  return <EmailsInbox emailComponent={EmailMessageExpand} />
}
