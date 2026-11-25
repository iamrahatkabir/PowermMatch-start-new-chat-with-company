# Changelog

Newest first. Each entry: what changed, where, and the instruction behind it. Keep entries short.

## 2026-11-25
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
