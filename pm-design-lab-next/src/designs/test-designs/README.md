# Test designs

Sandbox for testing designs only. When a design here is final, it moves to the design it belongs to (as a version or a view there) and is removed from here.

- Each experiment is a version (A, B, …); its label says what it is.
- Experiments may reuse pieces from other designs; nothing outside this folder imports from it.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | Applicant/Candidate profile notes (James Adam) + AI summary at the top of Notes. |
| B | `B.tsx` | Candidate profile, AI summary alt **Collapsible**: title + type chips + refresh + chevron on one line; all key points, up to 6 (bulleted, whole sentences up to ~150 characters, `longGist` in summary.ts, in a fixed 580px column so each ends within 2 lines; no "…"; 16px apart), meta on the right; no Show more; chevron folds it to the title line. |
| C | `C.tsx` | Candidate profile, AI summary alt **By type**: one gray box per note type ("Sales · 7 notes") with that type's key points, 2 columns. |
| D | `D.tsx` | Candidate profile, AI summary alt **Callout**: light yellow brand box (brand-bg), type chips under the title, numbered points with meta on the right. |
| E | `E.tsx` | Candidate profile, AI summary alt **Timeline**: date column on the left, blue dot + line, point with type chip and author. |
| F | `F.tsx` | Candidate profile, AI summary alt **Split**: left gray column (title, a bar per type, Updated + refresh at the bottom), right the points with dividers. |

All versions share their own note store `profile-notes/sharedNotes.ts` (sessionStorage key `pm-lab-test-designs-notes-v3`, filled with `profile-notes/seedNotes.ts` on first read) and links `profile-notes/profileUrl.ts` (candidate / applicant → A; company → the real Company profile notes design, since the company version was removed). Nothing mixes with the real designs. "Go to note" only shows on notes tagged from James Adam's chat; notes from other chats (Reno Power ApS., Poly Corporation) show "Tagged from …" without it.

When a test is final, move it to the design it belongs to (e.g. `notes-profile/`) and delete it here.

History: the Notes in inbox tagging test (companies / candidates / applicants on notes, context bar name link) was moved to Notes in inbox and the profile notes designs on 27.11.2026 and cleared from here.

## Test: AI summary of a profile's notes (A)
- **Where:** right under the "Notes" title, above the filters, on the candidate profile (James Adam). Same width as the notes. A company version (Reno Power ApS.) was tried and removed on 27.11.2026; it goes into Company profile notes once this design is final.
- **Label:** AI icon (`profile-notes/AiMagicIcon.tsx`, owner's ai-magic.svg, info-500) + title "AI Summary of latest 20 notes" (no badge or footer).
- **Content:** title "AI Summary of latest 20 notes" (only the 20 newest active notes are summarized; with 20 or fewer notes it says "AI Summary of N notes") with the notes-per-type chips on the same line (every type that has notes; they wrap if there's no room), and up to 6 key points: the newest note of every type, then pinned notes, then the newest of the rest; repeated texts skipped; shown newest first. Each point: first sentence (colleague @mentions at the start dropped), with type / author, date (no Pinned label).
- **Covers:** the 20 newest active notes (`LATEST` in `summary.ts`), every type in them; not changed by the filters; archived notes left out.
- **Updates:** when notes are added, edited, deleted, archived / restored or their type changes, it shows "Updating…" (refresh icon spins, old text dimmed) and regenerates after ~1.2 s. "Updated just now / N min ago" on the right.
- **Refresh:** the refresh icon regenerates it on demand.
- **No notes:** no active notes → no summary card.
- Code: `profile-notes/AiNotesSummary.tsx` (card), `profile-notes/summary.ts` (fake AI), `profile-notes/ProfileNotesSection.tsx` + `ProfileNotesPage.tsx` (copies of the notes-profile ones; the section passes the card into `ProfileNotes`' new optional `top` slot). Headers come from the real designs.
- Only changes outside this folder: `notes-profile/notes/ProfileNotes.tsx` got optional `top` and `canGoToOrigin` props (unused by the real designs, so they look the same).

## Dummy notes
- `profile-notes/seedNotes.ts`: 9 notes (19–27.11.2026, all four types), as if written in James Adam's chat (4), Reno Power ApS.'s chat (4, two tag James) and Poly Corporation's chat (1, tags James and Reno Power). The candidate profile shows James's own + the ones tagging him (7); the AI summary covers them. The 2 Reno Power notes that don't tag James aren't shown anywhere until there's a company version again.
- Loaded the first time the store is read in a browser tab; after that edits / deletes stick (clear the tab's sessionStorage to get them back).
- The inbox copy (A–D) that wrote them was removed on 27.11.2026.

## AI summary alternatives (B–F)
- Same information as A: AI icon + "AI Summary of latest 20 notes", notes per type, up to 6 key points (type, author, date), Updated + refresh, "Updating…" when notes change, hidden with no notes.
- Code: `profile-notes/AiSummaryVariants.tsx` (B–F layouts + `AiSummary` picker, `SummaryVariant`), `useAiSummary.ts` (shared state), `summaryParts.tsx` (title, chips, refresh, skeleton, point meta), `CandidatePage.tsx` (James Adam page used by A–F; `summary` prop). `ProfileNotesPage` / `ProfileNotesSection` copies take `summaryVariant`.
