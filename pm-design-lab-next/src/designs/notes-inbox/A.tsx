'use client'
// Notes in inbox — version A preview. The notes UI lives in notes/ (NoteBubble, NoteComposer,
// NoteThreadPanel); this file plugs it into the prototype inbox (reused from the inbox design).
import { useState } from 'react'
import { agents, clientCompanies, contactDirectory, noteColleagues, notesThread } from '@/mock'
import type { ThreadItem } from '@/mock'
import { InboxProvider, useCreateInbox } from '@/designs/inbox/parts/useInbox'
import { InboxLayout } from '@/designs/inbox/parts/InboxLayout'
import { StartChatSections } from '@/designs/inbox/start-chat/StartChatSections'
import { NoteBubble } from './notes/NoteBubble'
import { NoteComposer } from './notes/NoteComposer'
import { NoteThreadPanel } from './notes/NoteThreadPanel'
import { AssignToJoin } from './notes/AssignToJoin'
import { mentionsIn, noteTime } from './notes/mentions'

const me = agents.find((a) => a.id === 'ls')!
let replyId = 0

export default function VariantA() {
  const inbox = useCreateInbox({
    selectedId: 'cv-james',
    menuOpen: false,
    init: (s) => {
      // No chat messages for now; James Adam has a voicemail and two notes
      for (const id of Object.keys(s.threads)) s.threads[id] = []
      s.threads['cv-james'] = structuredClone(notesThread)
      const james = s.conversations.find((c) => c.id === 'cv-james')
      if (james) { james.assigneeId = null; james.callback = null }
    },
  })
  const [draft, setDraft] = useState('')
  // Note whose Thread panel is open (id in the open conversation) + a counter to focus its Reply box
  const [threadNoteId, setThreadNoteId] = useState<string | null>(null)
  const [threadFocus, setThreadFocus] = useState(0)

  const openThread = (m: ThreadItem, focus: boolean) => {
    setThreadNoteId(m.id)
    if (m.unread) inbox.update(() => { m.unread = false }) // opening the thread marks it read
    if (focus) setThreadFocus((k) => k + 1)
  }
  // Read on every InboxLayout render, so it always sees the current store state
  const findNote = (): ThreadItem | undefined =>
    threadNoteId ? inbox.state.threads[inbox.state.selectedId]?.find((m) => m.id === threadNoteId) : undefined

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
        renderNote={(m) => (
          <NoteBubble
            text={m.text ?? ''}
            mentions={m.mentions}
            author={m.author}
            authorPhoto={m.authorPhoto}
            time={m.time}
            replies={m.noteReplies}
            unread={m.unread}
            onReply={m.canReply === false ? undefined : () => openThread(m, true)}
            onOpenReplies={() => openThread(m, false)}
            // Only the note's author can edit or delete it
            onEdit={m.author !== me.name ? undefined : (text) => inbox.update(() => { m.text = text; m.mentions = mentionsIn(text, noteColleagues.map((c) => c.name)) })}
            onDelete={m.author !== me.name ? undefined : () => {
              inbox.update((s) => { s.threads[s.selectedId] = s.threads[s.selectedId].filter((x) => x.id !== m.id) })
              if (threadNoteId === m.id) setThreadNoteId(null)
            }}
          />
        )}
        renderNoteComposer={({ saveNote }) => (
          <NoteComposer
            value={draft}
            onChange={setDraft}
            colleagues={noteColleagues}
            onSave={(text, mentions) => { saveNote(text, { mentions, time: noteTime() }); setDraft('') }}
          />
        )}
        renderLockedComposer={({ assignToMe }) => <AssignToJoin onAssign={assignToMe} />}
        renderSidePanel={() => {
          const note = findNote()
          if (!note) return null
          return (
            <NoteThreadPanel
              key={note.id}
              note={{ text: note.text ?? '', mentions: note.mentions, author: note.author, authorPhoto: note.authorPhoto, time: note.time }}
              replies={note.noteReplies ?? []}
              colleagues={noteColleagues}
              focusKey={threadFocus}
              onClose={() => setThreadNoteId(null)}
              currentUser={me.name}
              onEditReply={(id, text) => inbox.update(() => {
                const r = note.noteReplies?.find((x) => x.id === id)
                if (r) { r.text = text; r.mentions = mentionsIn(text, noteColleagues.map((c) => c.name)) }
              })}
              onDeleteReply={(id) => inbox.update(() => { note.noteReplies = note.noteReplies?.filter((x) => x.id !== id) })}
              onSendReply={(text, mentions, quote) =>
                inbox.update(() => {
                  note.noteReplies = [...(note.noteReplies ?? []), { id: `reply-${++replyId}`, author: me.name, authorPhoto: me.photo, time: noteTime(), text, mentions, quote }]
                })
              }
            />
          )
        }}
      />
    </InboxProvider>
  )
}
