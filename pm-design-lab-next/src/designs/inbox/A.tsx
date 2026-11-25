'use client'
// Version A preview. The UI lives in start-chat/StartChatSections.jsx — this file only
// connects it to the prototype inbox (fake data + fake state).
import { clientCompanies, contactDirectory } from '@/mock'
import { InboxProvider, useCreateInbox } from './parts/useInbox'
import { InboxLayout } from './parts/InboxLayout'
import { StartChatSections } from './start-chat/StartChatSections'

export default function VariantA() {
  const inbox = useCreateInbox()
  return (
    <InboxProvider store={inbox}>
      <InboxLayout
        menu={
          <StartChatSections
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
