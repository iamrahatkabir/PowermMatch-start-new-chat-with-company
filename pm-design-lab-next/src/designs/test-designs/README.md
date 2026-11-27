# Test designs

Sandbox for testing designs only. When a design here is final, it moves to the design it belongs to (as a version or a view there) and is removed from here.

- Each experiment is a version (A, B, …); its label says what it is.
- Experiments may reuse pieces from other designs; nothing outside this folder imports from it.

| Version | File | What it is |
|---|---|---|
| A–D | `A.tsx` … `D.tsx` | Copy of Notes in inbox A–D (AI note type, AI v2, Manual, Manual v2) as it is on 27.11.2026: tagging companies / candidates / applicants, shared tagged notes, and the context bar name (hover ↗) that opens Company profile notes or Applicant/Candidate profile notes. Own copy of the notes UI and prototype in `notes-inbox/` (`notes/` + `parts/`), so edits here don't change the real design. |

The copy imports `sharedNotes.ts` and `profileUrl.ts` from the real `notes-inbox/notes/` (not copied), so tagged notes still reach the profile designs. "Go to note" on a profile opens the real Notes in inbox, not this copy. Shared inbox pieces (`inbox/parts/…`, e.g. `CompanyPanel`, `ProfileName`) are not copied; to test changes to them, copy them here first.

When a test is final, move the changed files back to `src/designs/notes-inbox/` (or wherever it belongs) and delete the copy here.

History: the Notes in inbox tagging test (companies / candidates / applicants on notes, context bar name link) was moved to Notes in inbox and the profile notes designs on 27.11.2026 and cleared from here.
