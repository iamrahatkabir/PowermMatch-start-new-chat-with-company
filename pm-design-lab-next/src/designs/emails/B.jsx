'use client'
// Version B: no View details — every email is fully open (From / To, full text, quoted text, files)
// with Reply always visible. Ship ../inbox/email/EmailMessage.jsx and pass alwaysOpen.
import { EmailsInbox } from './parts/EmailsInbox'
import { EmailMessage } from '../inbox/email/EmailMessage'

const Email = (props) => <EmailMessage {...props} alwaysOpen />

export default function VariantB() {
  return <EmailsInbox emailComponent={Email} />
}
