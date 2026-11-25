'use client'
// Version B preview. The UI lives in start-chat/StartChatTabs.jsx — this file only
// connects it to the prototype inbox (fake data + fake state).
import { clientCompanies, contactDirectory } from '@/mock'
import { InboxProvider, useCreateInbox } from './parts/useInbox'
import { InboxLayout } from './parts/InboxLayout'
import { StartChatTabs } from './start-chat/StartChatTabs'

export default function VariantB() {
  const inbox = useCreateInbox()
  return (
    <InboxProvider store={inbox}>
      <InboxLayout
        menu={
          <StartChatTabs
            companies={clientCompanies}
            candidates={contactDirectory.candidates}
            applicants={contactDirectory.applicants}
            onSelectContact={inbox.startWithContact}
            onSelectPerson={inbox.startWithPerson}
          />
        }
      />
    </InboxProvider>
  )
}
