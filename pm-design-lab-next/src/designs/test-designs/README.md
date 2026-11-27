# Test designs

Sandbox for testing designs only. When a design here is final, it moves to the design it belongs to (as a version or a view there) and is removed from here.

- Each experiment is a version (A, B, …); its label says what it is.
- Experiments may reuse pieces from other designs; nothing outside this folder imports from it.

| Version | File | What it is |
|---|---|---|
| A–D | `A.tsx` … `D.tsx` | Copy of Notes in inbox A–D (AI note type, AI v2, Manual, Manual v2). Own copy of the notes UI and prototype in `notes-inbox/` (`notes/` + `parts/`), so edits here don't change the real Notes in inbox or the profile designs. |

When a test is final, move the changed files back to `src/designs/notes-inbox/` (or wherever it belongs) and delete the copy here.

## Test: tag companies / candidates / applicants on notes (all versions A–D)
- **Tagging:** typing `@` in a note (new or edit) opens one list (no tabs): Colleagues, then Companies, then Candidates, then Applicants, each heading once and at most 3 matches per category. Typing filters all of them. Anyone with a conversation can be tagged, except the profile you're on; several per note.
- **Where it shows:** the note lives in its origin conversation and in every tagged conversation (the same note object, so edits, type changes and replies show everywhere). On a tagged profile the note shows "Tagged from James Adam · Go to note"; Go to note opens the origin, scrolls to the note and marks it for 2 s.
- **Tag chips:** look like mentions; a tagged chip is a link to the profile page: company → Company profile notes, candidate / applicant → Applicant/Candidate profile notes (`profileUrl` in `parts/NotesInbox.tsx`). Same in the Thread panel.
- **Edit / delete:** editing re-reads the tags (removing a tag takes the note off that profile, adding one puts it there); deleting removes it from the origin and every tagged profile.
- Data: `ThreadItem.tags?: NoteTag[]` (`{ id = conversation id, name, kind, photo? }`), `ThreadItem.originId?`. Mock `taggedNoteExample`: a note on James Adam tagging Reno Power ApS. and Guy Hawkins.
- Changed copies: `notes-inbox/notes/NoteComposer.tsx` (`entities`, grouped @ list, `onSave(text, mentions, tags)`), `MentionText` / `ClampedText` (`links`), `NoteBubble` (`links`, `origin`, `highlight`), `NoteThreadPanel` (`noteLinks`), `mentions.ts` (`tagsIn`), `parts/NotesInbox.tsx` (`syncTags`).
- Prototype limit: tagged notes still live in the inbox conversations; the profile pages are the separate profile designs (always the same mock person / company).

## Test: context bar name opens the profile (all versions A–D)
- Hovering the name at the top of the right context bar underlines it and shows ↗; clicking opens the profile design: company → Company profile notes, candidate / applicant → Applicant/Candidate profile notes (same tab).
- Code: `inbox/parts/ProfileName.tsx` (shared), `CompanyPanel` / `CandidatePanel` take `profileHref`, `InboxLayout` takes `profileHref(kind)`; set in `parts/NotesInbox.tsx`. Without the prop the name stays plain text, so other inbox designs are unchanged.
