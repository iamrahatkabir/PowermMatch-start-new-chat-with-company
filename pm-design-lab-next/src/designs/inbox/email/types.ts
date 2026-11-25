// Props every "email in the thread" component receives from ConversationThread
// (EmailMessage, EmailMessageModal, EmailMessageExpand, EmailThreadRoot, EmailCardReply, EmailChatBubble).
// Each component uses the ones it needs and ignores the rest.
import type { Attachment, ThreadItem } from '@/mock/inbox-types'

export type EmailInThreadProps = {
  subject: string
  body?: string
  dir?: 'in' | 'out'
  from?: string
  to?: string
  quoted?: string
  attachments?: Attachment[]
  failed?: string
  sending?: boolean
  /** Only passed when the thread groups replies (Emails version A). */
  replies?: ThreadItem[]
  onReply?: () => void
  onDownload?: (file: Attachment) => void
  onRetry?: () => void
  onOpenThread?: () => void
}

/** What ConversationThread's `renderEmailComposer` receives (replaces the Email tab composer). */
export type EmailComposerSlotProps = {
  to: { name?: string; email?: string }
  sender: { name: string; email: string; phone: string }
  replyTo: ThreadItem | null
  lastEmail: ThreadItem | null
  disabled: boolean
  sendEmail: (email: { subject: string; body: string; attachments?: Attachment[] }) => void
  cancelReply: () => void
}
