'use client'
// Version D preview. The UI lives in start-chat/StartChatSearchWindow.jsx — this file only
// connects it to the prototype inbox (fake data + fake state).
import { clientCompanies, contactDirectory } from '@/mock'
import { InboxProvider, useCreateInbox } from './parts/useInbox'
import { InboxLayout } from './parts/InboxLayout'
import { StartChatSearchWindow } from './start-chat/StartChatSearchWindow'

export default function VariantD() {
  const inbox = useCreateInbox()
  return (
    <InboxProvider store={inbox}>
      <InboxLayout
        menu={
          <StartChatSearchWindow
            companies={clientCompanies}
            candidates={contactDirectory.candidates}
            applicants={contactDirectory.applicants}
            onSelectContact={inbox.startWithContact}
            onSelectPerson={inbox.startWithPerson}
            onClose={() => inbox.update((s) => { s.menuOpen = false })}
          />
        }
      />
    </InboxProvider>
  )
}
