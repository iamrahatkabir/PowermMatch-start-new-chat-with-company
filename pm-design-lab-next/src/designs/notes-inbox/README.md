# Notes in inbox

Goal: internal notes inside an inbox conversation, with @mentions of colleagues. Built from the owner's screenshot (chat column only; inbox sidebar ignored).

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | Preview wrapper: the current inbox (reused from `inbox/parts`) with the notes UI plugged in. |

## Notes UI (copy these)
```
notes/
  NoteBubble.tsx    ← a note in the thread: light yellow bubble on the right, mentions as blue text on a light blue chip (`bg-info-50`), Reply link, "note icon · avatar · author • time"
  NoteComposer.tsx  ← Note tab composer: yellow area, "Use @ to mention…", attach + link buttons, Save note. variant="reply" = white "Reply…" box with Send; `placeholder` overrides the hint (used by notes-profile)
  NoteThreadPanel.tsx ← "Thread" side panel: the note, "N replies", replies (hover shows Reply), Reply box
  AssignToJoin.tsx  ← Chat/Email/SMS composer when not assigned: disabled "Assign to yourself to join this conversation" + Assign to me (`onAssign()`)
  EditBox.tsx       ← inline edit: text area + Cancel / Save (Enter saves, Esc cancels); used by notes and replies
  MentionText.tsx   ← text with @mentions as blue chips (used by bubble and panel)
  mentions.ts       ← plain logic: splitMentions, mentionQuery, mentionsIn, noteTime ('26 Nov 14:32'), withoutMentions (quote text), caretPosition (where to open the list)
```
- `NoteBubble` props: `text`, `mentions?: string[]`, `author?`, `authorPhoto?`, `time?`, `replies?: NoteReply[]`, `unread?`, `onReply?()`, `onOpenReplies?()`, `onEdit?(text)`, `onDelete?()`. Hovering a note shows edit (pencil) and delete (trash) icons left of the bubble. Edit turns the bubble into a text box (Enter/Save saves, Esc/Cancel cancels); mentions are re-read from the text. Delete removes the note straight away (no confirm) and closes its Thread panel. Only the note's author gets the icons (A passes onEdit/onDelete only when author = current user, Las Sabir). With replies it shows a replies row instead of Reply: 2 repliers' photos, `+N` for the other replies, "5 replies" (blue, medium weight, calls `onOpenReplies`), red "• Unread" when `unread` (also calls `onOpenReplies`), "Last reply 14:31". Unread = you're @mentioned and haven't opened the thread (`ThreadItem.unread`); A clears it when the thread opens. 
- `NoteThreadPanel` props: `note` ({ text, mentions, author, authorPhoto, time }), `replies`, `colleagues`, `onClose()`, `onSendReply(text, mentions)`, `focusKey?`, `currentUser?`, `onEditReply?(id, text)`, `onDeleteReply?(id)`. Hovering your own reply (author = `currentUser`) adds edit and delete icons next to Reply; edit is inline (same `EditBox` as notes), delete removes it straight away. Hovering a reply shows Reply: a "Replying to Name" bar (light blue, blue left line, ✕ cancels) appears above the box, and the sent reply shows that reply as a quote block (name + one line, mentions removed). `onSendReply(text, mentions, quote?)`; `NoteReply.quote` = `{ replyId, author, text }`.
- `NoteComposer` props (the @ list shows every colleague passed in; `variant?: 'note' | 'reply'`): `value` + `onChange(v)`, `onSave(text, mentions)`, `colleagues: Agent[]`, `disabled?`, `focusKey?` (change it to focus the box).
- Mentions are written as `@Full Name` in the text; `mentions` lists the names so they can be shown in blue (without the @).
- Behaviour: typing `@` opens a list of all agents just above the @ (scrolls after 5; typing filters; ↑ ↓, Enter/Tab picks, Esc closes). Bottom buttons: attach file, insert link. Enter saves, Shift+Enter new line. Save note turns yellow once there is text. Reply on a note or "N replies" opens the Thread panel in place of Candidate info (Reply also focuses the Reply box); ✕ closes it. Sent replies are added to the note, so the replies row updates. Rule: Chat, Email and SMS need the conversation assigned to you; notes don't. While unassigned, Chat/Email/SMS tabs are greyed and show `AssignToJoin`; the Note tab works normally. Assign to me unlocks everything and sets you as assignee.

## Prototype setup (A.tsx)
- `useCreateInbox({ selectedId: 'cv-james', menuOpen: false, init })` — every thread empty except James Adam (voicemail + one note from `notesThread`), James unassigned, no callback banner.
- `<InboxLayout defaultTab="note" renderNote renderNoteComposer renderLockedComposer renderSidePanel>` (renderLockedComposer draws AssignToJoin) (renderSidePanel returns the Thread panel while a note is open, else null) — the inbox slots that draw notes and the Note tab composer.
- Data: `noteColleagues`, `notesThread` in `src/mock/notes.ts`. `ThreadItem.mentions` holds the mentioned names; a note is `type: 'message', channel: 'note'`. `noteReplies` holds a note's replies (`NoteReply`: id, author, authorPhoto, time, text; first note has 5 and `unread: true`). The second note has no replies, so it shows the Reply link. `canReply: false` would hide the Reply link (not used in the mock now).
