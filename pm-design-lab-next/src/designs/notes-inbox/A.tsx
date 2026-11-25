'use client'
// Notes in inbox — version A preview. The notes UI lives in notes/ (NoteBubble, NoteComposer);
// this file plugs it into the prototype inbox (reused from the inbox design).
import { useState } from 'react'
import { clientCompanies, contactDirectory, noteColleagues, notesThread } from '@/mock'
import { InboxProvider, useCreateInbox } from '@/designs/inbox/parts/useInbox'
import { InboxLayout } from '@/designs/inbox/parts/InboxLayout'
import { StartChatSections } from '@/designs/inbox/start-chat/StartChatSections'
import { NoteBubble } from './notes/NoteBubble'
import { NoteComposer } from './notes/NoteComposer'

export default function VariantA() {
  const inbox = useCreateInbox({
    selectedId: 'cv-james',
    menuOpen: false,
    init: (s) => {
      // No chat messages for now; James Adam has a voicemail and a note
      for (const id of Object.keys(s.threads)) s.threads[id] = []
      s.threads['cv-james'] = structuredClone(notesThread)
      const james = s.conversations.find((c) => c.id === 'cv-james')
      if (james) { james.assigneeId = null; james.callback = null }
    },
  })
  const [draft, setDraft] = useState('')
  const [focusKey, setFocusKey] = useState(0)

  return (
    <InboxProvider store={inbox}>
      <InboxLayout
        defaultTab="note"
        menu={
          <StartChatSections
            companies={clientCompanies}
            candidates={contactDirectory.candidates}
            applicants={contactDirectory.applicants}
            onSelectContact={inbox.startWithContact}
            onSelectPerson={inbox.startWithPerson}
          />
        }
        renderNote={(m, { openNoteTab }) => (
          <NoteBubble
            text={m.text ?? ''}
            mentions={m.mentions}
            author={m.author}
            authorPhoto={m.authorPhoto}
            time={m.time}
            onReply={() => {
              // Reply = new note that mentions the note's author
              openNoteTab()
              setDraft(m.author ? `@${m.author} ` : '')
              setFocusKey((k) => k + 1)
            }}
          />
        )}
        renderNoteComposer={({ saveNote }) => (
          <NoteComposer
            value={draft}
            onChange={setDraft}
            colleagues={noteColleagues}
            focusKey={focusKey}
            onSave={(text, mentions) => { saveNote(text, { mentions }); setDraft('') }}
          />
        )}
      />
    </InboxProvider>
  )
}
