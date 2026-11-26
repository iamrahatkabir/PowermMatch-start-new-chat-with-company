'use client'
// Prototype for every Notes in profile version: profile column, tabs, Notes tab and Thread panel with fake state.
// noteTypes (same as Notes in inbox): 'ai-top' (A: AI sets the type after posting, badge at the bottom right of the card),
// 'ai' (B: same, badge next to the time), 'manual' (C: dropdown next to Send),
// 'chips' (D: four chips next to Send). Only the note's author can change the type from the badge.
// Active / Archived tabs; Active = pinned first, then newest first; 6 per page with a pager under the list.
// Anyone can pin or archive; archiving unpins. Pinning jumps to page 1 (where pinned notes are).
import { useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import { agents, noteColleagues, profileCandidate, profileNotes } from '@/mock'
import type { NoteType, ProfileNote } from '@/mock'
import { CandidateProfile } from '../profile/CandidateProfile'
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
const tabs = [
  { key: 'details', label: 'Profile details' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'notes', label: 'Notes' },
]
let noteId = 0
let replyId = 0

type Props = { noteTypes: NoteTypeMode }

export function NotesProfile({ noteTypes }: Props) {
  const [tab, setTab] = useState('notes')
  const [notes, setNotes] = useState<ProfileNote[]>(profileNotes)
  // Newest first, 6 per page
  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)
  const main = useRef<HTMLElement>(null)
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
  const goToPage = (p: number) => { setPage(p); main.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }) }
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-16 shrink-0 items-center bg-brand px-8">
        <img src="/brand/logo-mark.svg" alt="PowerMatch" className="h-6 w-auto brightness-0" />
      </header>
      {/* The whole page scrolls (no inner scroll in the profile column); the Thread panel sticks to the screen */}
      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        <aside className="shrink-0 border-b border-gray-200 bg-white lg:w-[480px] lg:border-b-0 lg:border-r">
          <CandidateProfile candidate={profileCandidate} />
        </aside>
        <main ref={main} className="min-w-0 flex-1 scroll-mt-4 px-4 py-8 sm:px-10">
          <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                className={cx('-mb-px shrink-0 whitespace-nowrap border-b-2 px-2 pb-3 text-base', t.key === tab ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900')}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="pt-10">
            {tab === 'notes' ? (
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
            ) : (
              <p className="text-sm text-gray-500">Not part of this design</p>
            )}
          </div>
        </main>
        {thread && (
          <NoteThreadPanel
            className="xl:sticky xl:top-0 xl:h-screen xl:self-start"
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
        )}
      </div>
    </div>
  )
}
