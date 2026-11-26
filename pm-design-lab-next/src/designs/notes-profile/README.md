# Notes in profile

Goal: a Notes tab on the candidate profile page (the page companies see). Built from the owner's screenshot.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | Preview wrapper: yellow top bar, profile column left, tabs (Profile details · Interviews · Notes) right. Only the Notes tab has content. |

## UI (copy these)
```
profile/CandidateProfile.tsx ← left column: photo (Watch Video badge), age/city/experience, Interested / Not Interested, How it Works?, match card with score rings, Requirements
notes/ProfileNotes.tsx       ← Notes tab: note cards (avatar, name, time right, text, Reply) + "Add a new note" box
notes/time.ts                ← profileNoteTime(): '8:30, 27 September, 2026'
```
- `CandidateProfile` props: `candidate: ProfileCandidate`, `onInterested?()`, `onNotInterested?()`, `onPlayVideo?()`, `onHowItWorks?()`. Score ring colour: green ≥ 80, amber ≥ 50, red below.
- `ProfileNotes` props: `notes: ProfileNote[]`, `colleagues: Agent[]`, `draft` + `onDraftChange(v)`, `onAddNote(text, mentions)`, `onReply?(note)`, `focusKey?`.
- Reuses `MentionText` and `NoteComposer` (variant "reply" + `placeholder`) from `notes-inbox/notes/`, so @mentions work the same: typing @ opens the agent list, Enter sends.
- Prototype: Reply puts `@Author ` in the new-note box and focuses it. New notes are added at the bottom with the current time.

## Data (`src/mock/notes.ts`)
- `profileCandidate: ProfileCandidate` — name, photo, age, city, experienceYears, match, `factors: { label, score, text }[]`, `requirements: { icon, label, value?, detail? }[]`.
- `profileNotes: ProfileNote[]` — `{ id, author, authorPhoto?, time, text, mentions? }`.

## Differences from the screenshot
- Copy is in English (lab rule): "Watch Video" instead of "Se min video", match texts translated with sample numbers.
- No orange in the palette: photo ring, badge and requirement icons use `warning-500`.
- Note cards have the standard 1px gray border (lab rule).
