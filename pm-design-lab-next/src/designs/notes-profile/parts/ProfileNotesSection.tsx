'use client'
// The notes of one profile with all their behaviour (prototype state): Active / Archived, filters, pin, archive,
// edit / delete, paging (6 per page, pinned first, newest first), note types, Thread panel.
// Used by Notes in profile, Applicant/Candidate profile notes and Company profile notes. The page decides the layout:
//   <ProfileNotesSection initial={notes} noteTypes="ai-top">{({ notes, thread }) => <>…{notes}…{thread}</>}</ProfileNotesSection>
// noteTypes: 'ai-top' (badge at the bottom right of the card), 'ai' (badge next to the time), 'manual' (dropdown next to
// Send), 'chips' (four chips next to Send). Only the author can change the type, edit or delete; anyone can pin or archive.
import { useState, type ReactNode, type RefObject } from 'react'
import { agents, noteColleagues } from '@/mock'
import type { NoteType, ProfileNote } from '@/mock'
import { ProfileNotes, type NotesView } from '../notes/ProfileNotes'
import { NotesPagination } from '../notes/NotesPagination'
import { pageCountOf } from '../notes/pagination'
import { NotesFilters } from '../notes/NotesFilters'
import { applyFilters, emptyFilter, isFiltered, type NotesFilter } from '../notes/filters'
import { profileNoteTime } from '../notes/time'
import { NoteThreadPanel } from '@/designs/notes-inbox/notes/NoteThreadPanel'
import { mentionsIn, noteTime } from '@/designs/notes-inbox/notes/mentions'
import { NoteTypeTag } from '@/designs/notes-inbox/notes/NoteTypeTag'
import { NoteTypePicker } from '@/designs/notes-inbox/notes/NoteTypePicker'
import { NoteTypeChips } from '@/designs/notes-inbox/notes/NoteTypeChips'
import { guessNoteType, type NoteTypeMode } from '@/designs/notes-inbox/notes/noteTypes'

const me = agents.find((a) => a.id === 'ls')!
let noteId = 0
let replyId = 0

type Props = {
  initial: ProfileNote[]
  noteTypes: NoteTypeMode
  /** Scrolled into view when the page changes (the notes area) */
  scrollTo?: RefObject<HTMLElement | null>
  /** Extra classes for the Thread panel (e.g. sticky) */
  threadClassName?: string
  /** Layout: where the notes list and the Thread panel (null when closed) go */
  children: (parts: { notes: ReactNode; thread: ReactNode }) => ReactNode
}

export function ProfileNotesSection({ initial, noteTypes, scrollTo, threadClassName, children }: Props) {
  const [notes, setNotes] = useState<ProfileNote[]>(initial)
  // Newest first, 6 per page
  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)
    const [view, setView] = useState<NotesView>('active')
  const [filter, setFilter] = useState<NotesFilter>(emptyFilter)
  const changeFilter = (f: NotesFilter) => { setFilter(f); setPage(1) }
  // Everyone who wrote a note on this profile, A–Z
  const authors = [...new Map(notes.map((n) => [n.author, { name: n.author, photo: n.authorPhoto }])).values()].sort((a, b) => a.name.localeCompare(b.name))
  // Active: pinned first, then newest first. Archived: newest first.
  const sorted = applyFilters(notes, filter)
    .filter((n) => (view === 'archived' ? n.archived : !n.archived))
    .sort((a, b) => (view === 'active' ? Number(!!b.pinned) - Number(!!a.pinned) : 0) || b.createdAt.localeCompare(a.createdAt))
  const currentPage = Math.min(page, pageCountOf(sorted.length, PAGE_SIZE)) // e.g. after deleting the last note of the last page
  const pageNotes = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const goToPage = (p: number) => { setPage(p); scrollTo?.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }
  const [draft, setDraft] = useState('')
  const [draftType, setDraftType] = useState<NoteType | null>(null) // C, D: type picked before sending
  const ai = noteTypes === 'ai' || noteTypes === 'ai-top'
  const picks = noteTypes === 'manual' || noteTypes === 'chips'
  const [focusKey, setFocusKey] = useState<number | undefined>(undefined)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [threadFocus, setThreadFocus] = useState(0)
  const thread = notes.find((n) => n.id === threadId)

  const patch = (id: string, fn: (n: ProfileNote) => ProfileNote) => setNotes((ns) => ns.map((n) => (n.id === id ? fn(n) : n)))
  // Opening the thread marks it read
  // Type badge; only the note's author can change it (e.g. to fix an AI mistake)
  const typeBadge = (n: ProfileNote) => (
    <NoteTypeTag
      type={n.noteType}
      detecting={ai && n.noteTypeBy === 'ai' && !n.noteType}
      onChange={n.author !== me.name ? undefined : (t) => patch(n.id, (x) => ({ ...x, noteType: t, noteTypeBy: 'agent' }))}
    />
  )

  function openThread(n: ProfileNote, focus: boolean) {
    setThreadId(n.id)
    patch(n.id, (x) => ({ ...x, unread: false }))
    if (focus) setThreadFocus((k) => k + 1)
  }

  const notesNode = (
    <ProfileNotes
      notes={pageNotes}
      view={view}
      filters={<NotesFilters value={filter} onChange={changeFilter} authors={authors} />}
      emptyText={isFiltered(filter) ? 'No notes match these filters' : undefined}
      emptyAction={isFiltered(filter) && <button type="button" className="text-sm font-medium text-info-500 hover:text-info-700" onClick={() => changeFilter(emptyFilter)}>Clear filter</button>}
      onViewChange={(v) => { setView(v); setPage(1) }}
      onTogglePin={(id) => { patch(id, (x) => ({ ...x, pinned: !x.pinned })); goToPage(1) }}
      onToggleArchive={(id) => patch(id, (x) => ({ ...x, archived: !x.archived, pinned: x.archived ? x.pinned : false }))}
      footer={<NotesPagination page={currentPage} total={sorted.length} pageSize={PAGE_SIZE} onPageChange={goToPage} />}
      colleagues={noteColleagues}
      draft={draft}
      onDraftChange={setDraft}
      focusKey={focusKey}
      openNoteId={threadId}
      onReply={(n) => openThread(n, true)}
      onOpenReplies={(n) => openThread(n, false)}
      headerBadge={noteTypes !== 'ai-top' ? typeBadge : undefined}
      cornerBadge={noteTypes === 'ai-top' ? typeBadge : undefined}
      composerTools={
        noteTypes === 'manual' ? <NoteTypePicker value={draftType} onChange={setDraftType} />
        : noteTypes === 'chips' ? <NoteTypeChips value={draftType} onChange={setDraftType} />
        : undefined
      }
      saveBlocked={picks && !draftType}
      saveBlockedHint="Choose a note type first"
      canEdit={(n) => n.author === me.name}
      onEditNote={(id, text, mentions) => patch(id, (x) => ({ ...x, text, mentions }))}
      onDeleteNote={(id) => { setNotes((ns) => ns.filter((x) => x.id !== id)); if (threadId === id) setThreadId(null) }}
      onAddNote={(text, mentions) => {
        const id = `new-${++noteId}`
        const base = { id, author: me.name, authorPhoto: me.photo, time: profileNoteTime(), createdAt: new Date().toISOString().slice(0, 16), text, mentions }
        if (picks) setNotes((ns) => [...ns, { ...base, noteType: draftType, noteTypeBy: 'agent' }])
        else {
          setNotes((ns) => [...ns, { ...base, noteType: null, noteTypeBy: 'ai' }])
          // Fake AI: the type appears a moment after posting
          setTimeout(() => patch(id, (x) => (x.noteType ? x : { ...x, noteType: guessNoteType(text) })), 1500)
        }
        setDraft('')
        setDraftType(null)
        goToPage(1) // the new note is the newest, so it's first on page 1
      }}
    />
  )

  const threadNode = thread && (
  <NoteThreadPanel
    className={threadClassName}
    key={thread.id}
    note={thread}
    replies={thread.replies ?? []}
    colleagues={noteColleagues}
    currentUser={me.name}
    // Thread panel looks like Notes in inbox A in every version: type badge at the right of the author/time line
    noteMeta={typeBadge(thread)}
    focusKey={threadFocus}
    onClose={() => setThreadId(null)}
    onSendReply={(text, mentions, quote) => patch(thread.id, (n) => ({
      ...n,
      replies: [...(n.replies ?? []), { id: `pr-${++replyId}`, author: me.name, authorPhoto: me.photo, time: noteTime(), text, mentions, quote }],
    }))}
    onEditReply={(id, text) => patch(thread.id, (n) => ({ ...n, replies: n.replies?.map((r) => (r.id === id ? { ...r, text, mentions: mentionsIn(text, noteColleagues.map((c) => c.name)) } : r)) }))}
    onDeleteReply={(id) => patch(thread.id, (n) => ({ ...n, replies: n.replies?.filter((r) => r.id !== id) }))}
  />
  )

  return <>{children({ notes: notesNode, thread: threadNode })}</>
}
