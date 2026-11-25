'use client'
// Version C preview. The UI lives in start-chat/StartChatBestMatch.jsx — this file only
// connects it to the prototype inbox (fake data + fake state).
import { clientCompanies, contactDirectory } from '@/mock'
import { InboxProvider, useCreateInbox } from './parts/useInbox'
import { InboxLayout } from './parts/InboxLayout'
import { StartChatBestMatch } from './start-chat/StartChatBestMatch'

export default function VariantC() {
  const inbox = useCreateInbox()
  return (
    <InboxProvider store={inbox}>
      <InboxLayout
        menu={
          <StartChatBestMatch
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
