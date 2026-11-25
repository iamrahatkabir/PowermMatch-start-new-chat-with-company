# Notes in inbox

Goal: internal notes inside an inbox conversation, with @mentions of colleagues. Built from the owner's screenshot (chat column only; inbox sidebar ignored).

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | Preview wrapper: the current inbox (reused from `inbox/parts`) with the notes UI plugged in. |

## Notes UI (copy these)
```
notes/
  NoteBubble.tsx    ← a note in the thread: light yellow bubble on the right, mentions in blue, Reply link, "note icon · avatar · author • time"
  NoteComposer.tsx  ← Note tab composer: yellow area, "Use @ to mention…", @ and link buttons, Save note
  mentions.ts       ← plain logic: splitMentions, mentionQuery, mentionsIn
```
- `NoteBubble` props: `text`, `mentions?: string[]`, `author?`, `authorPhoto?`, `time?`, `onReply?()`.
- `NoteComposer` props: `value` + `onChange(v)`, `onSave(text, mentions)`, `colleagues: Agent[]`, `disabled?`, `focusKey?` (change it to focus the box).
- Mentions are written as `@Full Name` in the text; `mentions` lists the names so they can be shown in blue (without the @).
- Behaviour: typing `@` (or the @ button) opens a colleague list (↑ ↓, Enter/Tab picks, Esc closes). Enter saves, Shift+Enter new line. Save note turns yellow once there is text. Reply on a note opens the Note tab with `@Author ` filled in. Notes can be saved without being assigned (no "Assign to me" overlay on the Note tab).

## Prototype setup (A.tsx)
- `useCreateInbox({ selectedId: 'cv-james', menuOpen: false, init })` — every thread empty except James Adam (voicemail + one note from `notesThread`), James unassigned, no callback banner.
- `<InboxLayout defaultTab="note" renderNote renderNoteComposer>` — the inbox slots that draw notes and the Note tab composer.
- Data: `noteColleagues`, `notesThread` in `src/mock/notes.ts`. `ThreadItem.mentions` holds the mentioned names; a note is `type: 'message', channel: 'note'`.
