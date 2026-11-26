# Changelog

Newest first. Each entry: what changed, where, and the instruction behind it. Keep entries short.

## 2026-11-26
- **Notes in inbox (A):** edit/delete only for the author (notes and replies). Replies in the Thread panel get hover edit/delete next to Reply. Added a Las Sabir reply to the mock. Owner asked: "replies editable too, only author can edit or delete".
- **Notes in inbox (A):** hover a note to see edit and delete icons; edit is inline (Save/Cancel), delete removes it. Owner asked: "edit and delete option on hover, just icons".
- **Notes in profile (A):** built from the owner's screenshot: candidate profile (photo, facts, Interested buttons, match rings, requirements) and a Notes tab with note cards, Reply and "Add a new note" with @mentions. Copy in English. Owner asked: "build this in notes in profile".
- **Notes in inbox (A):** unassigned conversations show "Assign to yourself to join this conversation" + Assign to me on Chat/Email/SMS (tabs greyed); notes work without assigning. Inbox gets `renderLockedComposer`. Owner asked: "chat/SMS/email need assigning, notes are independent".
- **Notes in inbox (A):** reply to a specific reply in the Thread panel: "Replying to …" bar above the box, sent reply shows a quote block. New `NoteReply.quote`. Owner asked: "reply to specific note".
- **Notes in inbox (A):** Reply and "N replies" open a Thread side panel (note, replies with hover Reply, Reply box with @mentions and Send), as in the owner's image. Sent replies update the replies row. Inbox gets `renderSidePanel`; replies now have `mentions`. Owner asked: "clicking reply or replies opens this sidebar".
- **Notes in inbox (A):** second note (Las Sabir) now has the Reply link, like the owner's first image. Owner asked: "update the second note with a reply button".
- **Notes in inbox (A):** "5 replies" text now medium weight. Owner asked: "5 replies text is with medium weight".
- **Notes in inbox (A):** notes with replies show a replies row (2 photos, +N, "5 replies", "Last reply 14:31") instead of Reply, as in the owner's image. First note has 5 replies (`ThreadItem.noteReplies`). Owner asked: "build the notes with replies as the image".
- **Notes in inbox (A):** @ list matches the owner's image: opens above the typed @, shows all agents (scrolls), bigger rows with small photos. @ button replaced by Attach file. Added Rahat Kabir Ifty and Adam James to `noteColleagues`. Owner asked: "typing @ shows names of agent we can mention".
- **Notes in inbox (A):** second note added (Las Sabir, no Reply link). New `ThreadItem.canReply: false`. Owner asked: "build another note without reply".
- **Notes in inbox (A):** @mentions in a note now sit on a light blue chip (`bg-info-50`, rounded). Owner asked: "the name has a background color".

## 2026-11-25
- **Notes in inbox (A):** chat column built from the owner's screenshot: note bubble with @mentions and Reply, yellow Note composer with colleague list and Save note, James Adam open (voicemail + note, Unassigned). Inbox gets `renderNote` / `renderNoteComposer` slots and `assigneeId: null` = Unassigned. Owner asked: "ignore the inbox sidebar and build this in the chat".
- **Docs:** root `CLAUDE.md` points new sessions to the lab; notes-inbox README, lab `CLAUDE.md` and inbox README now describe the notes setup and `defaultTab`. Owner asked to track everything so new sessions don't re-read code.
- **Notes in inbox (A):** all chat messages removed from conversations (threads start empty). Owner asked: "remove all the chats for now".
- **Notes in inbox (A):** opens with the Start new conversation menu closed and the Note tab active. Inbox gets an optional `defaultTab` prop (also used when switching conversations). Owner asked: "should not show popup and email tab, should show notes tab".
- **Notes in inbox (A):** now shows the current inbox (reused from the inbox design) as the base for notes. Owner asked: "Build the current inbox first in notes in inbox".
- **TypeScript:** whole lab converted from JavaScript to strict TypeScript (`.tsx`/`.ts`, typed props, `tsconfig.json`). Admin Settings uses its original typed source. Owner asked: "Go with typescript".
- **Reply style:** replies are now short (few bullets, plain words). Rule in `CLAUDE.md`.
- **Docs:** added this `CHANGELOG.md`, the lab `README.md`, and the "Track every change" rule in `CLAUDE.md`.
- **New categories:** `Notes in inbox` (`notes-inbox`) and `Notes in profile` (`notes-profile`). Placeholders until designs are shared.
- **Admin Settings merged** from the separate PowerMatch Design Lab app (`src/designs/settings/`). pages became views, colours mapped to lab tokens. See its README.
- **Dev port:** `PORT=3001 npm run dev` when 3000 is taken by the other app.
- **Vue lab removed:** `pm-design-lab/` moved to the macOS Trash. This Next.js lab is the only one now.
- **Moved to Next.js + React:** whole lab converted from Vue (gallery, toolbar, `Pm*` components, mock data, Inbox, Emails, Dialer 2.0).
- **Emails:** thread version moved to **A**; others shifted to B–G.

## Before 2026-11-25 (Vue lab, carried over)
- **Dialer 2.0 A:** call bar at the bottom (status pill, timer, mute, hold, call/hang up, keypad, transfer, missed calls, queue, DND, audio). Do not disturb: red pill, red moon, toast for 2 s that slides out right. Busy/Away removed.
- **Emails A (threads):** replies live in a right-side Thread panel like notes. Email shows avatars + "N replies" + last reply time; no replies → blue "Reply" link. Clicking an email expands its full text in place. Sample: 3 replies to "Photos from my last projects", and "Question about the company car" with no replies.
- **Emails, other versions:** always open (B), counts + expand below (C), cards with hover Reply and one-line images/docs (D), expand in place (E), modal (F), chat-style (G). Reply buttons tertiary. Images 80px, 4 + "+N". No "Download all", no "N attachments • size" row.
- **Inbox A–D:** start a new conversation (sections, tabs, best match, search window), company chats open under the company name, notification settings view.
- **Lab toolbar:** draggable grip, double-click to reset.
