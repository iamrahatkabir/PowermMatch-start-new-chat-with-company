// Types for the inbox sample data (src/mock/inbox.ts), shared by the Inbox and Emails designs.
import type { PillTone } from '@/ds/PmStatusPill'

export type Agent = { id: string; name: string; initials: string; photo: string }

export type Contact = { id: string; name: string; role: string; phone: string }
export type CompanyJob = { id: string; title: string; open: number; hired: number; city: string; status: string }
export type Invoice = { id: string; amount: string; period: string; sent: string; status: string }
export type Company = {
  id: string
  name: string
  logo?: string
  contractsLabel: string
  email: string
  address: string
  contacts: Contact[]
  jobs: CompanyJob[]
  invoices: Invoice[]
}

/** A person in the "Start new conversation" directory. */
export type DirectoryPerson = { id: string; name: string; meta: string; photo?: string }

export type ConversationKind = 'candidate' | 'applicant' | 'company' | 'unknown'
export type Channel = 'call' | 'missed' | 'email' | 'chat' | 'sms' | 'voicemail' | 'note'

export type Conversation = {
  id: string
  kind: ConversationKind
  name: string
  channel: Channel | string
  preview: string
  time: string
  unread: number
  email?: string
  photo?: string
  companyId?: string
  currentContactId?: string
  personId?: string
  assignedToMe?: boolean
  assigneeId?: string | null // null = Unassigned
  starred?: boolean
  state?: 'waiting'
  callback?: { missedAt: string } | null
}

/** A file attached to an email. size in bytes. status: unavailable files are shown but can't be downloaded. */
export type Attachment = { id: string; name: string; size: number; url?: string; status?: 'expired' | 'blocked' }

/** One item in a conversation thread. Which fields are set depends on `type`. */
export type ThreadItem = {
  id: string
  type: 'system' | 'message' | 'call' | 'voicemail' | 'missed' | 'event'
  text?: string
  dir?: 'in' | 'out'
  channel?: Channel | string
  author?: string
  authorPhoto?: string
  bySystem?: boolean
  time?: string
  // email messages
  subject?: string
  from?: string
  to?: string
  quoted?: string
  attachments?: Attachment[]
  failed?: string
  sending?: boolean
  // calls / voicemail
  title?: string
  duration?: string
  position?: string
  progress?: number
  summary?: string
  icon?: string
  // internal notes (channel 'note'): names @mentioned in the text
  mentions?: string[]
  canReply?: boolean // false = note shows no Reply link
  noteReplies?: NoteReply[] // replies to a note (oldest first)
}

// time: 'dd Mon HH:MM' (e.g. '22 Mar 13:55'); mentions: names written as @Name in text;
// quote: the reply this one answers (shown as a quote block above the text)
export type NoteReplyQuote = { replyId: string; author: string; text: string }
export type NoteReply = { id: string; author: string; authorPhoto?: string; time: string; text: string; mentions?: string[]; quote?: NoteReplyQuote }

export type StatusMap = Record<string, { tone: PillTone; label: string }>


