# Notes in inbox

Goal: internal notes inside an inbox conversation, with @mentions of colleagues. Built from the owner's screenshot (chat column only; inbox sidebar ignored).

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | **AI note type.** Notes with @mentions, replies, threads + note type set by AI: after posting, the note shows "Detecting type…" then the type. The author can click it to change it (fixes an AI mistake). |
| B | `B.tsx` | **AI note type v2.** Same as A (always automatic, nothing to set while writing), but the type badge sits inside the note bubble at the bottom right, on the replies / Reply row (white on yellow), also in the Thread panel. The author can still change it there. Explores badge placement. |
| C | `C.tsx` | **Manual note type.** Same notes, but the agent picks the type: a "Note type" picker next to Save note; Save stays disabled until a type is picked (tooltip "Choose a note type first"). The author can change it later from the tag. |
| D | `D.tsx` | **Manual note type v2.** Four type chips (Payroll + CS, Sales form, Screening, Sales) next to Save note, one click to pick; Save stays disabled until one is picked. Chips wrap when the column is narrow. |

All four are thin wrappers around `parts/NotesInbox.tsx` (prototype: the current inbox from `inbox/parts` with the notes UI plugged in), prop `noteTypes?: NoteTypeMode` (A 'ai', B 'ai-top', C 'manual', D 'chips'; leaving it out shows no types). After posting, every version shows the same type badge under the note (author can change it).

Note types: Payroll + CS · Sales form · Screening · Sales.

## Notes UI (copy these)
```
notes/
  NoteBubble.tsx    ← a note in the thread: light yellow bubble on the right, mentions as blue text on a light blue chip (`bg-info-50`), Reply link, "note icon · avatar · author • time"
  NoteComposer.tsx  ← Note tab composer: yellow area, "Use @ to mention…", attach + link buttons, Save note. variant="reply" = white "Reply…" box with Send; `placeholder` overrides the hint (used by notes-profile)
  NoteThreadPanel.tsx ← "Thread" side panel: the note, "N replies", replies (hover shows Reply), Reply box
  AssignToJoin.tsx  ← Chat/Email/SMS composer when not assigned: disabled "Assign to yourself to join this conversation" + Assign to me (`onAssign()`)
  EditingBar.tsx    ← bar on top of the composer while editing a note or reply there: pencil icon · "Esc to cancel" · X (`onCancel()`); `label` ("Editing note" / "Editing reply") is only the icon's accessible name
  EditBox.tsx       ← inline edit: text area + Cancel / Save (Enter saves, Esc cancels); not used by notes or replies now (kept for inline edit via `onEdit`)
  ClampedText.tsx   ← note text cut to N lines (default 2) ending in "… See more"; line 2 is filled to the right edge (cut mid-word if needed, trailing punctuation dropped). A hidden copy measures how much text fits (re-measures on resize); open, "See less" follows the text. Link only shows when the text is longer. Props: `text`, `mentions?`, `lines?`, `className?`
  MentionText.tsx   ← text with @mentions as blue chips (used by bubble and panel)
  NoteTypeTag.tsx   ← type chip under the note (label only on a `gray-50` fill, no border, no AI icon or colour dots; "Detecting type…" while AI works). With `onChange` it opens a shadcn DropdownMenu to change the type. Props: `type?`, `detecting?`, `onYellow?` (white badge inside a note), `onChange?(t)`. Also exports `NoteTypeMenu`
  NoteTypeChips.tsx ← D: four chips (shadcn ToggleGroup, single), placed in the composer's `tools` slot next to Save. Props: `value`, `onChange(t)`
  NoteTypePicker.tsx ← C: composer button "Note type ▾" → same menu. Props: `value`, `onChange(t)`
  noteTypes.ts      ← NOTE_TYPES (key, label), noteTypeLabel, guessNoteType(text) = fake AI (keywords; Screening otherwise)
  mentions.ts       ← plain logic: splitMentions, mentionQuery, mentionsIn, noteTime ('26 Nov 14:32'), withoutMentions (quote text), caretPosition (where to open the list)
```
- `NoteBubble` props: `text`, `mentions?: string[]`, `author?`, `authorPhoto?`, `time?`, `replies?: NoteReply[]`, `unread?`, `onReply?()`, `onOpenReplies?()`, `onEdit?(text)`, `onDelete?()`, `raised?` (being edited: sits above the overlay with `z-50`, scrolls into view, light meta line, no hover icons), `meta?` (node at the end of the line under the bubble; A, C, D put the type badge there), `corner?` (node inside the bubble at the bottom right, on the replies / Reply row; B puts the badge there; replies row wraps first, badge never wraps). Note text shows 2 lines, the second filled to the right and ending in "… See more" (expands; "See less" folds). The Thread panel always shows the full note. Hovering a note shows edit (pencil) and delete (trash) icons left of the bubble. Edit (pencil, `onEditClick`) moves the note's text into the composer: Note tab opens, edit bar (pencil · Esc to cancel · X) on top, button reads "Save changes", the rest of the screen gets a `bg-gray-900/70` overlay, portaled to `<body>` (click it, X or Esc cancels; type tools are hidden while editing). The whole composer card (tabs + input) stays above it via InboxLayout's `raiseComposer`; tabs can't be switched while editing; the note being edited stays in place and is lifted above the overlay (`raised`), no copy; mentions are re-read from the text. `onEdit(text)` without `onEditClick` still edits inside the bubble. Delete removes the note straight away (no confirm) and closes its Thread panel. Only the note's author gets the icons (A passes onEdit/onDelete only when author = current user, Las Sabir). With replies it shows a replies row instead of Reply: 2 repliers' photos, `+N` for the other replies, "5 replies" (blue, medium weight, calls `onOpenReplies`), red "• Unread" when `unread` (also calls `onOpenReplies`), "Last reply 14:31". Unread = you're @mentioned and haven't opened the thread (`ThreadItem.unread`); A clears it when the thread opens. 
- `NoteThreadPanel` props: `note` ({ text, mentions, author, authorPhoto, time }), `replies`, `colleagues`, `onClose()`, `onSendReply(text, mentions)`, `focusKey?`, `currentUser?`, `onEditReply?(id, text)`, `onDeleteReply?(id)`, `noteCorner?` (inside the note block at the bottom right, B), `className?` (extra panel classes, e.g. sticky in notes-profile), `noteMeta?` (node at the right end of the note's author/time line; A/B put the type badge there, same as under the note — replies have no type; "author • time" truncates so the badge stays on one line). Hovering your own reply (author = `currentUser`) adds edit and delete icons next to Reply. Edit works like notes: the reply text moves into the Reply box (edit bar, "Save changes"), the reply stays in place on a white card above a `bg-gray-900/70` overlay and scrolls into view; overlay click, X or Esc cancels. Delete removes it straight away. Hovering a reply shows Reply: a "Replying to Name" bar (light blue, blue left line, ✕ cancels) appears above the box, and the sent reply shows that reply as a quote block (name + one line, mentions removed). `onSendReply(text, mentions, quote?)`; `NoteReply.quote` = `{ replyId, author, text }`.
- `NoteComposer` props (the @ list shows every colleague passed in; `variant?: 'note' | 'reply'`): `value` + `onChange(v)`, `onSave(text, mentions)`, `colleagues: Agent[]`, `disabled?`, `focusKey?` (change it to focus the box).
- Mentions are written as `@Full Name` in the text; `mentions` lists the names so they can be shown in blue (without the @).
- Behaviour: typing `@` opens a list of all agents just above the @ (scrolls after 5; typing filters; ↑ ↓, Enter/Tab picks, Esc closes). Bottom buttons: attach file, insert link. Enter saves, Shift+Enter new line. Save note turns yellow once there is text. Reply on a note or "N replies" opens the Thread panel in place of Candidate info (Reply also focuses the Reply box); ✕ closes it. Sent replies are added to the note, so the replies row updates. Rule: Chat, Email and SMS need the conversation assigned to you; notes don't. While unassigned, Chat/Email/SMS tabs are greyed and show `AssignToJoin`; the Note tab works normally. Assign to me unlocks everything and sets you as assignee.

## Prototype setup (A.tsx)
- `useCreateInbox({ selectedId: 'cv-james', menuOpen: false, init })` — every thread empty except James Adam (voicemail + one note from `notesThread`), James unassigned, no callback banner.
- `<InboxLayout defaultTab="note" renderNote renderNoteComposer renderLockedComposer renderSidePanel>` (renderLockedComposer draws AssignToJoin) (renderSidePanel returns the Thread panel while a note is open, else null) — the inbox slots that draw notes and the Note tab composer.
- Data: `noteColleagues`, `notesThread` in `src/mock/notes.ts`. `ThreadItem.mentions` holds the mentioned names; a note is `type: 'message', channel: 'note'`. `noteReplies` holds a note's replies (`NoteReply`: id, author, authorPhoto, time, text; first note has 5 and `unread: true`). The second note has no replies, so it shows the Reply link. `canReply: false` would hide the Reply link (not used in the mock now).

## Note type data
- `NoteComposer`: `header?` (node above the text, not used now; the @ list accounts for it), `tools?` (node left of Save: C puts the picker there, D the chips), `saveBlocked?` + `saveBlockedHint?`, `saveLabel?` (e.g. "Save changes"), `onEscape?()` (Esc when no @ list is open).
- `ThreadItem.noteType?: NoteType | null`, `noteTypeBy?: 'ai' | 'agent'` (`NoteType` in `inbox-types.ts`). Mock: Patrick's note = Screening, Las Sabir's note = Sales (both set by AI).

## Edge cases (checked at 1280px, 1440px and 375px)
- Mock worst case: note `n4` by Christoffer Østergaard-Andersen (long name), long text with a long link and line breaks, 3 mentions, 24 replies, unread, Payroll + CS.
- Long words/links break (`[overflow-wrap:anywhere]`); mention chips keep their look when they wrap (`box-decoration-break: clone`).
- Line under a note: long author name is cut with …; time and type badge never wrap. Thread panel: same for "author • time".
- Replies row wraps as whole pieces (avatars · count · Unread · Last reply) instead of breaking words.
- @ list: long names truncate; typing a name nobody has shows "No colleague found".
- Thread panel with no replies says "No replies yet". Below xl the Thread panel covers the screen (it used to be hidden).
