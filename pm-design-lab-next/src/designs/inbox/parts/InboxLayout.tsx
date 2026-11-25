'use client'
import type { ComponentType, ReactNode } from 'react'
import { PmAppShell } from '@/ds'
import { useInbox } from './useInbox'
import { ConversationList } from './ConversationList'
import { ConversationThread, type ConversationThreadProps } from './ConversationThread'
import { CandidatePanel } from './CandidatePanel'
import { CompanyPanel } from './CompanyPanel'
import { NotificationSettingsView } from './NotificationSettingsView'
import type { EmailComposerSlotProps, EmailInThreadProps } from '../email/types'

export type InboxLayoutProps = {
  navCollapsed?: boolean
  emailComponent?: ComponentType<EmailInThreadProps>
  groupReplies?: boolean
  threadPanel?: ComponentType
  menu?: ReactNode
  renderEmailComposer?: (p: EmailComposerSlotProps) => ReactNode
  defaultTab?: string
  renderNote?: ConversationThreadProps['renderNote']
  renderNoteComposer?: ConversationThreadProps['renderNoteComposer']
}

// The full inbox. Variants pass their "Start new conversation" menu in the `menu` prop (a node).
// Email designs can swap the Email tab's composer through the renderEmailComposer prop (see ConversationThread).
// Nav: Inbox → All shows conversations, Inbox → Notification settings shows settings.
// Emails version A: groupReplies hides email replies in the conversation; threadPanel (a component) is shown instead of
// the contact panel while an email thread is open (state.emailThreadId).
const views = ['inbox-all', 'inbox-notifications']

export function InboxLayout({ navCollapsed = true, emailComponent, groupReplies, threadPanel: ThreadPanel, menu, renderEmailComposer, defaultTab, renderNote, renderNoteComposer }: InboxLayoutProps) {
  const { state, selected, update } = useInbox()
  const onNav = (key: string) => views.includes(key) && update((s) => { s.view = key })

  return (
    <PmAppShell active={state.view} flush navCollapsed={navCollapsed} onNav={onNav}>
      {state.view === 'inbox-notifications' ? (
        <NotificationSettingsView />
      ) : (
        <div className="flex h-full bg-white">
          <ConversationList menu={menu} />
          <ConversationThread {...(emailComponent ? { emailComponent } : {})} groupReplies={groupReplies} renderEmailComposer={renderEmailComposer} defaultTab={defaultTab} renderNote={renderNote} renderNoteComposer={renderNoteComposer} />
          {ThreadPanel && state.emailThreadId ? <ThreadPanel /> : selected.kind === 'company' ? <CompanyPanel /> : <CandidatePanel />}
        </div>
      )}
    </PmAppShell>
  )
}
