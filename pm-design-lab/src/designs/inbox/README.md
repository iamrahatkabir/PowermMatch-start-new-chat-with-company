# Inbox — Start new conversation (developer handoff)

**Problem:** company contact persons can't be searched. Today you search the company, open it, then pick a contact.
**Goal:** search a contact person directly. Picking one opens the **company's** conversation with that person as the current contact; other contacts can be switched to from the Company info panel.

## Where the code is

| Version | Component (copy this) | What it does |
|---|---|---|
| A | `start-chat/StartChatSections.vue` | Sections: Company · Candidate · Applicant. A "Contact person" section appears while searching. |
| B | `start-chat/StartChatTabs.vue` | Filter tabs (All · Companies · Candidates · Applicants, + Contact persons while searching). Companies expand in place. |
| C | `start-chat/StartChatBestMatch.vue` | While searching, the top result is a card with company, role, phone and a Start chat button. Enter starts it. |
| D | `start-chat/StartChatSearchWindow.vue` | Centered search window: results left, preview right. ↑ ↓ / Enter / Esc. |

Each version is **self-contained**: data comes in through props, choices go out as events. None of them touch app state or call an API.

```
start-chat/
  StartChat*.vue   ← one file per version (the part you ship)
  search.js        ← plain-JS search logic, shared by all versions (swap for a server search if needed)
  ui/              ← small shared pieces: MenuShell (popover + search field), MenuSection, MenuRow,
                     EntityAvatar (company / contact initials / photo), Highlight (marks the search match)
A.vue … D.vue      ← preview wrappers only: plug a version into the clickable prototype
parts/             ← PROTOTYPE ONLY: fake inbox (list, thread, side panels, in-memory state)
```

## Using a version

```vue
<StartChatSections
  :companies="companies"
  :candidates="candidates"
  :applicants="applicants"
  @select-contact="(companyId, contactId) => openCompanyChat(companyId, contactId)"
  @select-person="(person, kind) => openPersonChat(person, kind)"
/>
```

Version D also emits `close` (backdrop, ✕ button). The others are closed by the parent (the `+` button / Esc / clicking outside), and reset their search each time they're mounted.

### Props

```js
companies: [{
  id, name, logo?, contractsLabel,           // contractsLabel e.g. "2 contracts"
  contacts: [{ id, name, role, phone }],
}]
candidates: [{ id, name, photo, meta }]       // meta e.g. "Carpenter • ProBuild Christensen A/S"
applicants: [{ id, name, photo, meta }]
```

### Events

| Event | Arguments | Expected behaviour in the app |
|---|---|---|
| `select-contact` | `companyId, contactId` | Open the company's conversation (create it if none). If the current contact is different, set it and add a "Conversation switched to {name}" line. |
| `select-person` | `person, kind` (`'candidate'` \| `'applicant'`) | Open or create that person's conversation. |
| `close` (D only) | — | Hide the window. |

The prototype's version of this behaviour is in `parts/useInbox.js` (`startWithContact`, `switchContact`, `startWithPerson`) for reference.

## Dependencies
- Vue 3 (`<script setup>`), Tailwind v4 with the PowerMatch theme (`src/styles/main.css`)
- Design system components used inside: `PmInput`, `PmButton`, `PmTabs` (B), `PmAvatar` (registered globally from `src/ds/`)
- Icons: `lucide-vue-next`

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
| `notification-settings/NotificationSettings.vue` | The page content. Self-contained: settings in via `v-model`, events out. **Ship this.** |
| `notification-settings/playTone.js` | Prototype-only sound preview (Web Audio beeps). Replace with real sound files. |
| `parts/NotificationSettingsView.vue` | Prototype wiring: dummy data, sound preview, browser permission. |

```vue
<NotificationSettings
  v-model="settings"
  :sounds="sounds"
  :permission="Notification.permission"
  @test-sound="(value) => playSound(value)"
  @fix-permission="async () => (permission = await Notification.requestPermission())"
  @save="(settings) => api.saveNotificationSettings(settings)"
/>
```

- `settings`: `{ inboundRingtone, inboundBrowserNotification, outboundRingtone, messageSound, messageBrowserNotification }` — sound fields hold a sound `value`, toggles are booleans.
- `sounds`: `[{ value, label }]`. A sound with value `'none'` disables its Test button.
- `permission`: `'granted' | 'denied' | 'default' | 'unsupported'`. When `'denied'` the browser won't ask again, so the page explains how to allow it manually.
- Edits stay local until **Save changes** (disabled until something changed). Save emits `save` and updates `v-model`.
- Uses `PmSelect`, `PmButton`, `PmToggle` and `lucide-vue-next`.
