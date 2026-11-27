# Test designs

Sandbox for testing designs only. When a design here is final, it moves to the design it belongs to (as a version or a view there) and is removed from here.

- Each experiment is a version (A, B, …); its label says what it is.
- Experiments may reuse pieces from other designs; nothing outside this folder imports from it.

| Version | File | What it is |
|---|---|---|
| A–D | `A.tsx` … `D.tsx` | Copy of Notes in inbox A–D (AI note type, AI v2, Manual, Manual v2). Own copy of the notes UI and prototype in `notes-inbox/` (`notes/` + `parts/`), so edits here don't change the real Notes in inbox or the profile designs. |

When a test is final, move the changed files back to `src/designs/notes-inbox/` (or wherever it belongs) and delete the copy here.
