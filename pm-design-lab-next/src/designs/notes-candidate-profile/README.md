# Applicant/Candidate profile notes

Goal: notes on the **internal** applicant/candidate profile (what agents/recruiters see, inside the PowerMatch app). Desktop only.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | App shell (nav collapsed, Candidates active), person summary on the left, tabs (Overview · Applications · Documents · Notes) with the Notes tab open. Notes = the shared profile notes (AI note type, badge at the bottom right of the card). |

## UI (copy these)
```
profile/PersonSummary.tsx ← left column: photo, name, trade • years • age, Applicant/Candidate pill + status pill, Personal Info (phone, email, address), Recruitment (applied for, recruiter)
```
- `PersonSummary` props: `person: PersonProfile` (`kind: 'applicant' | 'candidate'` switches the pill text).
- The notes, filters, paging, pin/archive, edit/delete and Thread panel are the same as Notes in profile: `notes-profile/parts/ProfileNotesSection.tsx` (state) + `notes-profile/notes/*` (UI). See `src/designs/notes-profile/README.md`.
- Page layout: `notes-profile/parts/InternalProfilePage.tsx` (shared with Company profile notes): the content area scrolls as one (summary column has no scroll of its own), the Thread panel sticks to the right.

## Data (`src/mock/notes.ts`)
- `notesPerson: PersonProfile` — name (long: "Jonas Østergaard Nielsen"), photo, kind, trade, experienceYears, age, city, phone, email, address, status, appliedFor?, recruiter.
- `personNotes` — same 122 notes as Notes in profile (worst case).
