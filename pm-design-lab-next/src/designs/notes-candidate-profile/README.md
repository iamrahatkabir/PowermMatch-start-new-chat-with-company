# Applicant/Candidate profile notes

Goal: notes on the **internal** applicant/candidate profile (agents/recruiters, inside the PowerMatch app). Built from the owner's screenshot (originally Pranto Kumar Pashi; now **James Adam, candidate**, the same person as his Notes in inbox conversation `cv-james`), with the latest profile notes design. Desktop only.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | App shell (Candidates active), breadcrumb (Jobs icon › Applicants › name), photo + name + star rating + email, status dropdown + "Match Job" on the right, tabs with counts (Profile Details · Todo 4 · Notes · Activity), full-width Notes tab, Thread panel on the right. AI note type, badge at the bottom right of the card. |

Prototype: `parts/ApplicantNotesPage.tsx` → shared `notes-profile/parts/ProfileNotesPage.tsx` (app shell, header slot, tabs, notes, sticky Thread panel; also used by Company profile notes).

## UI (copy these)
```
profile/ApplicantHeader.tsx          ← breadcrumb ("Applicants" or "Candidates" from kind), photo, name, 0–5 stars (warning-500, empty gray-200), email, status dropdown (shadcn DropdownMenu), Match Job (brand button)
notes-profile/profile/ProfileTabs.tsx ← tabs with optional count chip (99+ max); shared with Company profile notes
```
- `ApplicantHeader` props: `person: PersonProfile`, `statuses: string[]`, `onStatusChange?(s)`, `onMatchJob?()`, `onBack?()`. Long names wrap; actions never shrink.
- Notes, filters, Active/Archived, pin/archive, paging, edit/delete, Thread panel: same as Notes in profile. The Notes tab count = active notes (99+ in the mock).

## Data (`src/mock/notes.ts`)
- `notesPerson: PersonProfile` — name, photo, email, kind ('applicant' | 'candidate'), rating, status, counts { todo }. `PERSON_STATUSES`: Looking for job, Not looking, Hired, Inactive.
- `personNotes` — the 122 profile notes (worst case), with "Jonas" replaced by "James". Tagging James Adam in any inbox chat (e.g. a company chat) puts the note on this Notes tab; notes written here that tag someone also show in James's inbox conversation.

## Differences from the screenshot
- English copy: "Søger job" → "Looking for job"; nav labels in English.

## Tagging
Same as Notes in profile (see `notes-profile/README.md` → Tagging). This profile's own name is left out of the @ list; mock tagged-in note: `pp-tag` (from Reno Power ApS.).

## AI summary
At the top of Notes: "AI Summary of latest 20 notes" with type chips, refresh, fold arrow and up to 6 key points. Shared with the other profile designs — see `notes-profile/README.md` → AI summary.
