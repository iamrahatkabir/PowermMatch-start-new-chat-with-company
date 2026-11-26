'use client'
// Prototype for every Notes in inbox version: plugs the notes UI (notes/) into the prototype inbox (reused from
// the inbox design). noteTypes: 'ai' (A: AI tags the note after posting, author can change it),
// 'ai-top' (B: same as A, nothing to set while writing; the badge sits inside the note at the bottom right),
// 'manual' (C: agent picks the type from a dropdown before saving), 'chips' (D: four type chips next to Save note, one must be picked), none = no types.
import { useState } from 'react'
import { agents, clientCompanies, contactDirectory, noteColleagues, notesThread } from '@/mock'
import type { NoteType, ThreadItem } from '@/mock'
import { InboxProvider, useCreateInbox } from '@/designs/inbox/parts/useInbox'
import { InboxLayout } from '@/designs/inbox/parts/InboxLayout'
import { StartChatSections } from '@/designs/inbox/start-chat/StartChatSections'
import { NoteBubble } from '../notes/NoteBubble'
import { NoteComposer } from '../notes/NoteComposer'
import { NoteThreadPanel } from '../notes/NoteThreadPanel'
import { AssignToJoin } from '../notes/AssignToJoin'
import { mentionsIn, noteTime } from '../notes/mentions'
import { NoteTypeTag } from '../notes/NoteTypeTag'
import { NoteTypePicker } from '../notes/NoteTypePicker'
import { NoteTypeChips } from '../notes/NoteTypeChips'
import { guessNoteType } from '../notes/noteTypes'

const me = agents.find((a) => a.id === 'ls')!
let replyId = 0
let noteId = 0

export type NoteTypeMode = 'ai' | 'ai-top' | 'manual' | 'chips'
type Props = { noteTypes?: NoteTypeMode }

export function NotesInbox({ noteTypes }: Props) {
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
  const [draftType, setDraftType] = useState<NoteType | null>(null) // C, D: type picked in the composer
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

  // Note type badge (under the note and in its Thread panel). Only the author can change it (fixes an AI mistake in A)
  const typeBadge = (m: ThreadItem) => noteTypes && (
    <NoteTypeTag
      type={m.noteType}
      detecting={(noteTypes === 'ai' || noteTypes === 'ai-top') && m.noteTypeBy === 'ai' && !m.noteType}
      onYellow={noteTypes === 'ai-top'}
      onChange={m.author !== me.name ? undefined : (t) => inbox.update(() => { m.noteType = t; m.noteTypeBy = 'agent' })}
    />
  )

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
            meta={noteTypes !== 'ai-top' && typeBadge(m)}
            corner={noteTypes === 'ai-top' && typeBadge(m)}
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
            tools={
              noteTypes === 'manual' ? <NoteTypePicker value={draftType} onChange={setDraftType} />
              : noteTypes === 'chips' ? <NoteTypeChips value={draftType} onChange={setDraftType} />
              : null
            }
            saveBlocked={(noteTypes === 'manual' || noteTypes === 'chips') && !draftType}
            saveBlockedHint="Choose a note type first"
            onSave={(text, mentions) => {
              const id = `note-${++noteId}`
              if (noteTypes === 'manual' || noteTypes === 'chips') saveNote(text, { id, mentions, time: noteTime(), noteType: draftType, noteTypeBy: 'agent' })
              else if (noteTypes === 'ai' || noteTypes === 'ai-top') {
                saveNote(text, { id, mentions, time: noteTime(), noteType: null, noteTypeBy: 'ai' })
                // Fake AI: the type appears a moment after posting
                setTimeout(() => inbox.update((s) => {
                  const n = Object.values(s.threads).flat().find((x) => x.id === id)
                  if (n && !n.noteType) n.noteType = guessNoteType(text)
                }), 1500)
              } else saveNote(text, { id, mentions, time: noteTime() })
              setDraft('')
              setDraftType(null)
            }}
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
              noteMeta={noteTypes !== 'ai-top' && typeBadge(note)}
              noteCorner={noteTypes === 'ai-top' && typeBadge(note)}
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
