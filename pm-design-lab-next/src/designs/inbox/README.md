# Inbox — Start new conversation (developer handoff)

**Problem:** company contact persons can't be searched. Today you search the company, open it, then pick a contact.
**Goal:** search a contact person directly. Picking one opens the **company's** conversation with that person as the current contact; other contacts can be switched to from the Company info panel.

## Where the code is

| Version | Component (copy this) | What it does |
|---|---|---|
| A | `start-chat/StartChatSections.jsx` | Sections: Company · Candidate · Applicant. A "Contact person" section appears while searching. |
| B | `start-chat/StartChatTabs.jsx` | Filter tabs (All · Companies · Candidates · Applicants, + Contact persons while searching). Companies expand in place. |
| C | `start-chat/StartChatBestMatch.jsx` | While searching, the top result is a card with company, role, phone and a Start chat button. Enter starts it. |
| D | `start-chat/StartChatSearchWindow.jsx` | Centered search window: results left, preview right. ↑ ↓ / Enter / Esc. |

Each version is **self-contained**: data comes in through props, choices go out through `onX` callbacks. None of them touch app state or call an API.

```
start-chat/
  StartChat*.jsx   ← one file per version (the part you ship)
  search.js        ← plain-JS search logic, shared by all versions (swap for a server search if needed)
  ui/              ← small shared pieces: MenuShell (popover + search field), MenuSection, MenuRow,
                     EntityAvatar (company / contact initials / photo), Highlight (marks the search match)
A.jsx … D.jsx      ← preview wrappers only: plug a version into the clickable prototype
parts/             ← PROTOTYPE ONLY: fake inbox (list, thread, side panels, in-memory state)
```

## Using a version

```jsx
import { StartChatSections } from './start-chat/StartChatSections'

<StartChatSections
  companies={companies}
  candidates={candidates}
  applicants={applicants}
  onSelectContact={(companyId, contactId) => openCompanyChat(companyId, contactId)}
  onSelectPerson={(person, kind) => openPersonChat(person, kind)}
/>
```

Version D also calls `onClose` (backdrop, ✕ button). The others are closed by the parent (the `+` button / Esc / clicking outside), and reset their search each time they're mounted.

### Props

```js
companies: [{
  id, name, logo?, contractsLabel,           // contractsLabel e.g. "2 contracts"
  contacts: [{ id, name, role, phone }],
}]
candidates: [{ id, name, photo, meta }]       // meta e.g. "Carpenter • ProBuild Christensen A/S"
applicants: [{ id, name, photo, meta }]
```

### Callbacks

| Callback | Arguments | Expected behaviour in the app |
|---|---|---|
| `onSelectContact` | `companyId, contactId` | Open the company's conversation (create it if none). If the current contact is different, set it and add a "Conversation switched to {name}" line. |
| `onSelectPerson` | `person, kind` (`'candidate'` \| `'applicant'`) | Open or create that person's conversation. |
| `onClose` (D only) | — | Hide the window. |

The prototype's version of this behaviour is in `parts/useInbox.js` (`startWithContact`, `switchContact`, `startWithPerson`) for reference.

## Dependencies
- React 19 (Next.js App Router, `'use client'` components), Tailwind v4 with the PowerMatch theme (`src/styles/globals.css`)
- Design system components used inside: `PmInput`, `PmButton`, `PmTabs` (B), `PmAvatar` (imported from `@/ds`)
- Icons: `lucide-react`

## Callback requested

A missed call where the caller asked to be called back puts the conversation in a **Callback requested** state:
- List row: red "Missed call • Callback requested".
- Open chat: yellow banner under the header ("Callback requested • Missed call at {time}") and a missed-call entry in the thread.
- **The state stays until a recruiter reaches out** by call, chat, SMS or email. Internal notes don't clear it.
- Prototype logic: `handleCallback()` in `parts/useInbox.js`; data: `conversation.callback = { missedAt }`.

---

# Inbox — Notification settings

Shown inside the inbox when **Inbox → Notification settings** is clicked in the nav (all versions).

| File | What it is |
|---|---|
| `notification-settings/NotificationSettings.jsx` | The page content. Self-contained: settings in via `value` + `onChange`, callbacks out. **Ship this.** |
| `notification-settings/playTone.js` | Prototype-only sound preview (Web Audio beeps). Replace with real sound files. |
| `parts/NotificationSettingsView.jsx` | Prototype wiring: dummy data, sound preview, browser permission. |

```jsx
<NotificationSettings
  value={settings}
  onChange={setSettings}
  sounds={sounds}
  permission={permission}
  onTestSound={(value) => playSound(value)}
  onFixPermission={async () => setPermission(await Notification.requestPermission())}
  onSave={(settings) => api.saveNotificationSettings(settings)}
/>
```

- `settings`: `{ inboundRingtone, inboundBrowserNotification, outboundRingtone, messageSound, messageBrowserNotification }` — sound fields hold a sound `value`, toggles are booleans.
- `sounds`: `[{ value, label }]`. A sound with value `'none'` disables its Test button.
- `permission`: `'granted' | 'denied' | 'default' | 'unsupported'`. When `'denied'` the browser won't ask again, so the page explains how to allow it manually.
- Edits stay local until **Save changes** (disabled until something changed). Save calls `onSave` and `onChange`.
- Uses `PmSelect`, `PmButton`, `PmToggle` and `lucide-react`.

## Prototype options
- `raiseComposer?: boolean` (InboxLayout → ConversationThread): lifts the whole composer card (tabs + input) to `z-50` above a page overlay and stops tab switching; used by Notes in inbox while editing a note.
- `useCreateInbox({ selectedId, menuOpen, init })` — open conversation, show the Start new conversation menu at start (default yes), `init(state)` to change the fresh state.
- `<InboxLayout defaultTab>` — composer tab at start and after switching conversation (chat · email · sms · note). Default: the conversation's channel. Used by `notes-inbox`.
- `<InboxLayout renderNote renderNoteComposer>` — optional: draw notes (`channel: 'note'`) and replace the Note tab composer (no assign overlay there). Used by `notes-inbox`.
- `conversation.assigneeId: null` shows "Unassigned" in the thread header.
- `<InboxLayout renderSidePanel>` — optional: called each render; a node replaces the contact panel, null keeps it. Used by `notes-inbox` for the note Thread panel.
- `<InboxLayout renderLockedComposer>` — optional: replaces the Chat/Email/SMS composer (and the Assign overlay) while not assigned; Note tab stays usable. Used by `notes-inbox`.
