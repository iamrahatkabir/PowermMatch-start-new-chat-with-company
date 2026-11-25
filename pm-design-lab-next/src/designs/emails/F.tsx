'use client'
// Version F: View details opens a modal — the email in the thread is ../inbox/email/EmailMessageModal.jsx
// (with EmailDetailsModal.jsx). Ship those files.
import { EmailsInbox } from './parts/EmailsInbox'
import { EmailMessageModal } from '../inbox/email/EmailMessageModal'

export default function VariantF() {
  return <EmailsInbox emailComponent={EmailMessageModal} />
}
