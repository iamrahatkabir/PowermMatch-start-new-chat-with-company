# Notes in profile

Goal: a Notes tab on the candidate profile page (the page companies see). Built from the owner's screenshot.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | Preview wrapper: yellow top bar, profile column left, tabs (Profile details · Interviews · Notes) in the middle, Thread sidebar on the right when a note's thread is open. Only the Notes tab has content. |

## UI (copy these)
```
profile/CandidateProfile.tsx ← left column: photo (Watch Video badge), age/city/experience, Interested / Not Interested, How it Works?, match card with score rings, Requirements
notes/ProfileNotes.tsx       ← Notes tab: note cards (avatar, name, time right, text, then Reply or a replies row: avatars · "5 replies" · red "• Unread" · "Last reply 14:31") + "Add a new note" box
notes-inbox/notes/NoteThreadPanel.tsx ← Thread sidebar (reused from Notes in inbox; now has bg-white)
notes/time.ts                ← profileNoteTime(): '8:30, 27 September, 2026'
```
- `CandidateProfile` props: `candidate: ProfileCandidate`, `onInterested?()`, `onNotInterested?()`, `onPlayVideo?()`, `onHowItWorks?()`. Score ring colour: green ≥ 80, amber ≥ 50, red below.
- `ProfileNotes` props: `notes: ProfileNote[]`, `colleagues: Agent[]`, `draft` + `onDraftChange(v)`, `onAddNote(text, mentions)`, `onReply?(note)` (note without replies), `onOpenReplies?(note)` ("N replies"), `openNoteId?` (card with the open thread gets a `border-gray-400`), `focusKey?`.
- **Unread:** a note shows "• Unread" when you're @mentioned in it or its replies and haven't opened its thread (`ProfileNote.unread`). Clicking "• Unread" opens the thread, same as "N replies"; opening the thread clears it.
- Reuses `MentionText` and `NoteComposer` (variant "reply" + `placeholder`) from `notes-inbox/notes/`, so @mentions work the same: typing @ opens the agent list, Enter sends.
- Prototype: Reply or "N replies" opens the Thread sidebar (Reply also focuses its box) and marks the note read. Replies can quote a reply; your own (Las Sabir) can be edited/deleted. New notes are added at the bottom with the current time.

## Data (`src/mock/notes.ts`)
- `profileCandidate: ProfileCandidate` — name, photo, age, city, experienceYears, match, `factors: { label, score, text }[]`, `requirements: { icon, label, value?, detail? }[]`.
- `profileNotes: ProfileNote[]` — `{ id, author, authorPhoto?, time, text, mentions?, replies?: NoteReply[], unread? }`. pn1 = 5 replies (read), pn2 = 5 replies, last one mentions you (unread), pn3 = no replies.

## Differences from the screenshot
- Copy is in English (lab rule): "Watch Video" instead of "Se min video", match texts translated with sample numbers.
- No orange in the palette: photo ring, badge and requirement icons use `warning-500`.
- Note cards have the standard 1px gray border (lab rule).
