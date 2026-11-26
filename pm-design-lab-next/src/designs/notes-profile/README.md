# Notes in profile

Goal: a Notes tab on the candidate profile page (the page companies see). Built from the owner's screenshot.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | **AI note type.** AI sets the type after posting ("Detecting type…" then the type); badge in the card header next to the time. |
| B | `B.tsx` | **AI note type v2.** Same, but the badge sits at the bottom right of the card (replies / Reply row). |
| C | `C.tsx` | **Manual note type.** "Note type ▾" dropdown next to Send; Send disabled until a type is picked. |
| D | `D.tsx` | **Manual note type v2.** Four type chips next to Send; Send disabled until one is picked. |

All four are thin wrappers around `parts/NotesProfile.tsx` (prototype: yellow top bar, profile column left, tabs (Profile details · Interviews · Notes), Thread sidebar on the right when a thread is open; only the Notes tab has content), prop `noteTypes: NoteTypeMode` (same modes as Notes in inbox). Same rules as Notes in inbox: only the note's author can change the type from its badge; the Thread panel shows the badge too (A/C/D on the author/time line, B at the bottom right of the note); note text shows 2 lines then "… See more".

## UI (copy these)
```
profile/CandidateProfile.tsx ← left column: photo (Watch Video badge), age/city/experience, Interested / Not Interested, How it Works?, match card with score rings, Requirements
notes/ProfileNotes.tsx       ← Notes tab: note cards (avatar, name, [type badge] time right, text cut to 2 lines + "… See more", then Reply or a replies row: avatars · "5 replies" · red "• Unread" · "Last reply 14:31", [corner badge]) + "Add a new note" box
notes-inbox/notes/ClampedText, NoteTypeTag, NoteTypePicker, NoteTypeChips, noteTypes.ts ← reused from Notes in inbox
notes-inbox/notes/NoteThreadPanel.tsx ← Thread sidebar (reused from Notes in inbox; now has bg-white)
notes/time.ts                ← profileNoteTime(): '8:30, 27 September, 2026'
```
- `CandidateProfile` props: `candidate: ProfileCandidate`, `onInterested?()`, `onNotInterested?()`, `onPlayVideo?()`, `onHowItWorks?()`. Score ring colour: green ≥ 80, amber ≥ 50, red below.
- `ProfileNotes` props: `notes: ProfileNote[]`, `colleagues: Agent[]`, `draft` + `onDraftChange(v)`, `onAddNote(text, mentions)`, `onReply?(note)` (note without replies), `onOpenReplies?(note)` ("N replies"), `openNoteId?` (card with the open thread gets a `border-gray-400`), `focusKey?`, `headerBadge?(note)` (node left of the time), `cornerBadge?(note)` (node at the bottom right), `composerTools?` (next to Send), `saveBlocked?` + `saveBlockedHint?`, `canEdit?(note)` (author only), `onEditNote?(id, text, mentions)`, `onDeleteNote?(id)`.
- **Edit / delete (author only):** hovering your own note shows a small edit + delete toolbar at the card's top right. Edit moves the text into the "Add a new note" box (edit bar: pencil · Esc to cancel · X, button "Save changes", type tools hidden); the card stays in place and, with the box, sits above a `bg-gray-900/70` overlay (portaled to `<body>`); overlay click, X or Esc cancels. Delete removes the note straight away and closes its thread. Same as Notes in inbox.
- **Unread:** a note shows "• Unread" when you're @mentioned in it or its replies and haven't opened its thread (`ProfileNote.unread`). Clicking "• Unread" opens the thread, same as "N replies"; opening the thread clears it.
- Reuses `MentionText` and `NoteComposer` (variant "reply" + `placeholder`) from `notes-inbox/notes/`, so @mentions work the same: typing @ opens the agent list, Enter sends.
- Prototype: Reply or "N replies" opens the Thread sidebar (Reply also focuses its box) and marks the note read. Replies can quote a reply; your own (Las Sabir) can be edited (text moves into the Reply box, reply lifted above a dark overlay) or deleted. New notes are added at the bottom with the current time.

## Data (`src/mock/notes.ts`)
- `profileCandidate: ProfileCandidate` — name, photo, age, city, experienceYears, match, `factors: { label, score, text }[]`, `requirements: { icon, label, value?, detail? }[]`.
- `profileNotes: ProfileNote[]` — `{ id, author, authorPhoto?, time, text, mentions?, replies?: NoteReply[], unread?, noteType?: NoteType | null, noteTypeBy?: 'ai' | 'agent' }`. Types: pn1 Sales, pn2 Sales form, pn3 Screening, pn4 Payroll + CS. pn1 = 5 replies (read), pn2 = 5 replies, last one mentions you (unread), pn3 = no replies.

## Differences from the screenshot
- Copy is in English (lab rule): "Watch Video" instead of "Se min video", match texts translated with sample numbers.
- No orange in the palette: photo ring, badge and requirement icons use `warning-500`.
- Note cards have the standard 1px gray border (lab rule).

## Edge cases (checked at 1440px and 375px)
- Mock worst case: note `pn4` (long name, long text + link, 3 mentions, 24 replies, unread, long time).
- Long author name truncates next to the time; long words/links break; replies row wraps as whole pieces.
- Phones: the page scrolls as one (profile, then tabs and notes); the Thread panel covers the screen. From lg the two columns scroll on their own.
- Long candidate name wraps; long requirement values align right and wrap.
