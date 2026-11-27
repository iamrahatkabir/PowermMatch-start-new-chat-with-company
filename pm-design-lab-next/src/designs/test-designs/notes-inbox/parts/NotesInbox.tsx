'use client'
// TEST COPY of Notes in inbox (Test designs). Shares sharedNotes + profileUrl with the real design so tagged notes still reach the profile designs.
// Prototype for every Notes in inbox version: plugs the notes UI (notes/) into the prototype inbox (reused from
// the inbox design). noteTypes: 'ai' (A: AI tags the note after posting, author can change it),
// 'ai-top' (B: same as A, nothing to set while writing; the badge sits inside the note at the bottom right),
// 'manual' (C: agent picks the type from a dropdown before saving), 'chips' (D: four type chips next to Save note, one must be picked), none = no types.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { agents, clientCompanies, contactDirectory, noteColleagues, notesThread, taggableEntities, taggedNoteExample } from '@/mock'
import type { NoteTag, NoteType, ThreadItem } from '@/mock'
import type { InboxState } from '@/designs/inbox/parts/useInbox'
import { InboxProvider, useCreateInbox } from '@/designs/inbox/parts/useInbox'
import { InboxLayout } from '@/designs/inbox/parts/InboxLayout'
import { StartChatSections } from '@/designs/inbox/start-chat/StartChatSections'
import { NoteBubble } from '../notes/NoteBubble'
import { NoteComposer } from '../notes/NoteComposer'
import { NoteThreadPanel } from '../notes/NoteThreadPanel'
import { AssignToJoin } from '../notes/AssignToJoin'
import { mentionsIn, noteTime, tagsIn } from '../notes/mentions'
import { profileUrl } from '@/designs/notes-inbox/notes/profileUrl'
import { newNoteId, sharedNotes } from '@/designs/notes-inbox/notes/sharedNotes'
import { NoteTypeTag } from '../notes/NoteTypeTag'
import { NoteTypePicker } from '../notes/NoteTypePicker'
import { NoteTypeChips } from '../notes/NoteTypeChips'
import { EditingBar } from '../notes/EditingBar'
import { guessNoteType, type NoteTypeMode } from '../notes/noteTypes'

const me = agents.find((a) => a.id === 'ls')!
let replyId = 0

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
      // A note on James that tags Reno Power ApS. and Guy Hawkins: the same note object sits in all three threads
      const tagged = structuredClone(taggedNoteExample)
      s.threads['cv-james'].push(tagged)
      syncTags(s, tagged)
    },
  })
  // Tagged notes saved earlier (here or on a profile page) come back into their conversations
  useEffect(() => {
    inbox.update((s) => {
      for (const stored of sharedNotes.get()) {
        if (Object.values(s.threads).some((t) => t.some((x) => x.id === stored.id))) continue
        const n: ThreadItem = structuredClone(stored)
        s.threads[n.originId!] = [...(s.threads[n.originId!] ?? []), n]
        syncTags(s, n)
      }
    })
    // ?note=<id> (Go to note from a profile page): open the note's origin conversation and mark the note
    const noteParam = new URLSearchParams(window.location.search).get('note')
    const target = noteParam && Object.values(inbox.state.threads).flat().find((x) => x.id === noteParam)
    if (target && target.originId && inbox.state.conversations.some((c) => c.id === target.originId)) {
      inbox.select(target.originId)
      setTimeout(() => setFocusNoteId(target.id), 300)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // Shares a note with the profile designs when it tags someone (or was shared before): Reno Power ApS. etc. show it too
  const publish = (id: string) => {
    const n = Object.values(inbox.state.threads).flat().find((x) => x.id === id)
    if (!n || !(n.tags?.length || sharedNotes.has(id))) return
    const createdAt = sharedNotes.get().find((x) => x.id === id)?.createdAt ?? new Date().toISOString().slice(0, 16)
    sharedNotes.upsert({ ...n, createdAt })
  }
  // Tagging: a note lives in its origin conversation and in every tagged company / candidate / applicant
  // conversation (the same object, so edits, type changes and replies show everywhere).
  const [focusNoteId, setFocusNoteId] = useState<string | null>(null) // "Go to note": scroll to it and mark it
  useEffect(() => {
    if (!focusNoteId) return
    const t = setTimeout(() => setFocusNoteId(null), 2000)
    return () => clearTimeout(t)
  }, [focusNoteId])
  // Everyone that can be tagged: companies, candidates and applicants with a conversation, plus the profile designs'
  // own (Jonas)
  const fromConversations: NoteTag[] = inbox.state.conversations
    .filter((c) => c.kind !== 'unknown')
    .map((c) => ({ id: c.id, name: c.name, kind: c.kind as NoteTag['kind'], photo: c.photo }))
  const allEntities: NoteTag[] = [...fromConversations, ...taggableEntities.filter((e) => !fromConversations.some((c) => c.id === e.id))]
  const convName = (id: string) => allEntities.find((e) => e.id === id)?.name ?? ''
  // Go to note: the origin conversation, or the profile page when it was written on a profile
  const goToOrigin = (m: ThreadItem) => {
    const id = m.originId!
    if (inbox.state.conversations.some((c) => c.id === id)) { openProfile(id); setFocusNoteId(m.id); return }
    const e = allEntities.find((x) => x.id === id)
    if (e) router.push(profileUrl(e.kind))
  }
  const entities = allEntities.filter((e) => e.id !== inbox.state.selectedId) // the @ list never offers the profile you're on
  // Tags in a text: read against everyone (an edit made on a tagged profile keeps that profile's own tag), never the origin
  const readTags = (text: string, originId: string) => tagsIn(text, allEntities).filter((t) => t.id !== originId)
  const openProfile = (id: string) => { setThreadNoteId(null); inbox.select(id) }
  // Tag chips open the profile page: company → Company profile notes, candidate / applicant → Applicant/Candidate profile notes
  const router = useRouter()
  const tagLinks = (m: ThreadItem) => Object.fromEntries((m.tags ?? []).map((t) => [t.name, () => router.push(profileUrl(t.kind))]))
  const chips = (m: ThreadItem) => [...(m.mentions ?? []), ...(m.tags ?? []).map((t) => t.name)]
  const [draft, setDraft] = useState('')
  // Editing a note happens in the composer: its text moves into the input, the rest of the screen gets an overlay
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [composerFocus, setComposerFocus] = useState(0)
  const cancelEdit = () => { setEditId(null); setEditText('') }
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
      onChange={m.author !== me.name ? undefined : (t) => { inbox.update(() => { m.noteType = t; m.noteTypeBy = 'agent' }); publish(m.id) }}
    />
  )

  return (
    <InboxProvider store={inbox}>
      <InboxLayout
        defaultTab="note"
        raiseComposer={!!editId}
        // Context bar name → the notes profile designs (company → company profile, candidate / applicant → applicant profile)
        profileHref={(kind) => kind === 'unknown' ? undefined : profileUrl(kind)}
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
            mentions={chips(m)}
            links={tagLinks(m)}
            highlight={m.id === focusNoteId}
            origin={m.originId && m.originId !== inbox.state.selectedId ? { name: convName(m.originId), onGo: () => goToOrigin(m) } : undefined}
            author={m.author}
            authorPhoto={m.authorPhoto}
            time={m.time}
            replies={m.noteReplies}
            unread={m.unread}
            onReply={m.canReply === false ? undefined : () => openThread(m, true)}
            onOpenReplies={() => openThread(m, false)}
            // Only the note's author can edit or delete it
            raised={m.id === editId}
            onEditClick={m.author !== me.name ? undefined : () => { openNoteTab(); setEditId(m.id); setEditText(m.text ?? ''); setComposerFocus((k) => k + 1) }}
            meta={noteTypes !== 'ai-top' && typeBadge(m)}
            corner={noteTypes === 'ai-top' && typeBadge(m)}
            onDelete={m.author !== me.name ? undefined : () => {
              // Deleting removes it from the origin and every tagged conversation
              inbox.update((s) => { for (const id of Object.keys(s.threads)) s.threads[id] = s.threads[id].filter((x) => x.id !== m.id) })
              sharedNotes.remove(m.id)
              if (threadNoteId === m.id) setThreadNoteId(null)
              if (editId === m.id) cancelEdit()
            }}
          />
        )}
        renderNoteComposer={({ saveNote }) => (
          <>
          {/* Edit mode: overlay over everything except the composer card (tabs + input, lifted via raiseComposer) and the
              note being edited. Portaled to <body> so it isn't trapped inside the lifted card. Click it to cancel. */}
          {editId && createPortal(<div className="fixed inset-0 z-40 bg-gray-900/70" onClick={cancelEdit} />, document.body)}
          <div>
          <NoteComposer
            value={editId ? editText : draft}
            onChange={editId ? setEditText : setDraft}
            colleagues={noteColleagues}
            entities={entities}
            focusKey={composerFocus}
            header={editId && <EditingBar onCancel={cancelEdit} />}
            saveLabel={editId ? 'Save changes' : undefined}
            onEscape={editId ? cancelEdit : undefined}
            tools={editId ? null :
              noteTypes === 'manual' ? <NoteTypePicker value={draftType} onChange={setDraftType} />
              : noteTypes === 'chips' ? <NoteTypeChips value={draftType} onChange={setDraftType} />
              : null
            }
            saveBlocked={!editId && (noteTypes === 'manual' || noteTypes === 'chips') && !draftType}
            saveBlockedHint="Choose a note type first"
            onSave={(text, mentions) => {
              if (editId) {
                inbox.update((s) => {
                  const n = s.threads[s.selectedId]?.find((x) => x.id === editId)
                  if (n) { n.originId ??= s.selectedId; n.text = text; n.mentions = mentions; n.tags = readTags(text, n.originId); syncTags(s, n) }
                })
                publish(editId)
                cancelEdit()
                return
              }
              const id = newNoteId('note')
              const origin = inbox.state.selectedId
              const tagged = { tags: readTags(text, origin), originId: origin }
              if (noteTypes === 'manual' || noteTypes === 'chips') saveNote(text, { id, mentions, ...tagged, time: noteTime(), noteType: draftType, noteTypeBy: 'agent' })
              else if (noteTypes === 'ai' || noteTypes === 'ai-top') {
                saveNote(text, { id, mentions, ...tagged, time: noteTime(), noteType: null, noteTypeBy: 'ai' })
                // Fake AI: the type appears a moment after posting
                setTimeout(() => {
                  inbox.update((s) => {
                    const n = Object.values(s.threads).flat().find((x) => x.id === id)
                    if (n && !n.noteType) n.noteType = guessNoteType(text)
                  })
                  publish(id)
                }, 1500)
              } else saveNote(text, { id, mentions, ...tagged, time: noteTime() })
              // Copy the new note into every tagged conversation
              inbox.update((s) => { const n = s.threads[origin]?.find((x) => x.id === id); if (n) syncTags(s, n) })
              publish(id)
              setDraft('')
              setDraftType(null)
            }}
          />
          </div>
          </>
        )}
        renderLockedComposer={({ assignToMe }) => <AssignToJoin onAssign={assignToMe} />}
        renderSidePanel={() => {
          const note = findNote()
          if (!note) return null
          return (
            <NoteThreadPanel
              key={note.id}
              note={{ text: note.text ?? '', mentions: chips(note), author: note.author, authorPhoto: note.authorPhoto, time: note.time }}
              noteLinks={tagLinks(note)}
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

// Puts the note in its origin conversation and every tagged one, and takes it out of conversations no longer tagged
function syncTags(s: InboxState, note: ThreadItem) {
  const keep = new Set([note.originId, ...(note.tags ?? []).map((t) => t.id)])
  for (const t of note.tags ?? []) s.threads[t.id] ??= []
  for (const id of Object.keys(s.threads)) {
    const has = s.threads[id].some((x) => x.id === note.id)
    if (keep.has(id) && !has) s.threads[id] = [...s.threads[id], note]
    if (!keep.has(id) && has) s.threads[id] = s.threads[id].filter((x) => x.id !== note.id)
  }
}
