'use client'
// PROTOTYPE ONLY: the inbox with Dianne Russell's email conversation open and the sidebar expanded.
// Versions pass their email composer as renderEmailComposer (A uses the built-in one).
import { clientCompanies, contactDirectory } from '@/mock'
import { useCreateInbox, InboxProvider } from '../../inbox/parts/useInbox'
import { InboxLayout } from '../../inbox/parts/InboxLayout'
import { StartChatSections } from '../../inbox/start-chat/StartChatSections'
import type { ComponentType, ReactNode } from 'react'
import type { ThreadItem } from '@/mock'
import type { EmailComposerSlotProps, EmailInThreadProps } from '../../inbox/email/types'

type Props = {
  emailComponent?: ComponentType<EmailInThreadProps>
  groupReplies?: boolean
  threadPanel?: ComponentType
  extraEmails?: ThreadItem[]
  renderEmailComposer?: (p: EmailComposerSlotProps) => ReactNode
}

// emailComponent: a version's email-in-thread component (default: ../inbox/email/EmailMessage.jsx)
// groupReplies + threadPanel: version A (replies live in a Thread panel, see EmailThreadSide.jsx)
// extraEmails: more emails added to the end of Dianne's conversation (version A's sample replies)
// renderEmailComposer({ to, sender, replyTo, lastEmail, disabled, sendEmail, cancelReply }): replaces the Email tab composer
export function EmailsInbox({ emailComponent, groupReplies, threadPanel, extraEmails = [], renderEmailComposer }: Props) {
  const inbox = useCreateInbox({
    selectedId: 'cv-dianne',
    menuOpen: false,
    init: (s) => s.threads['cv-dianne'].push(...structuredClone(extraEmails)),
  })

  return (
    <InboxProvider store={inbox}>
      <InboxLayout
        navCollapsed={false}
        emailComponent={emailComponent}
        groupReplies={groupReplies}
        threadPanel={threadPanel}
        renderEmailComposer={renderEmailComposer}
        menu={(
          <StartChatSections
            companies={clientCompanies}
            candidates={contactDirectory.candidates}
            applicants={contactDirectory.applicants}
            onSelectContact={inbox.startWithContact}
            onSelectPerson={inbox.startWithPerson}
          />
        )}
      />
    </InboxProvider>
  )
}
