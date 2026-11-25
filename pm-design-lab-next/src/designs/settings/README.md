# Admin Settings (developer handoff)

Telephony admin settings, merged in from the separate **PowerMatch Design Lab** app (`/Users/rahatkabirifty/PowerMatch Design Lab`, Next.js + TypeScript). Kept in TypeScript (the original typed source) and moved into this lab.

| File | What it is |
|---|---|
| `A.jsx` | Version A preview: the settings shell with the four pages; the sidebar switches pages as views. |
| `parts/settings-shell.jsx` | App chrome from the original: 248px sidebar + top bar (bell, Las Sabir) + grey page area. Props `view`, `onNav(view)`, children. |
| `parts/sidebar.jsx` | Sidebar with the inert main nav and the open **Admin settings** group (Numbers & hours, Queues & wrap-up, User management, Compliance & data). |
| `pages/*.jsx` | The four pages (were `/settings/<page>` routes): numbers-hours (Phone numbers · Business hours · Voicemail tabs), queues-wrap-up (Queues · Wrap-up outcomes tabs), user-management, compliance-data. |
| `screens/` | Feature components (tables, popups, business hours, voicemail, wrap-up preview). |
| `ui/` | This design's own UI kit (modal, confirm dialog, toast, button, select, multi-select, date/time pickers, audio upload, voice recorder, icon picker…). |
| `data/` | Sample data: phone numbers, queues & wrap-up outcomes, users. |

## Differences from the original app
- Pages are views inside one design instead of Next.js routes (`next/link` / `usePathname` → `view` + `onNav`).
- Colours use this lab's tokens: `ink` → `gray-900`, `muted` → `gray-500`, `line` → `gray-200`, `canvas` → `gray-50`, `success`/`success-soft` → `success-500`/`success-50`, `danger`/`danger-soft` → `error-500`/`error-50`, `brand` → the lab's `brand` (#F8E965 instead of #f5e04a).
- Font is the lab's Inter (no `next/font`).
- Assets copied to `public/`: `powermatch-logo.svg`, `avatars/placeholder.png`.

## Rules carried over
- **"Save changes" only appears when something has changed**, on every page and popup. Use `useUnsavedChanges` (`ui/use-unsaved-changes.ts`). Changing a field back hides the button; saving shows a toast and resets the baseline.
- Keep the first Queues & wrap-up tab named **"Queues"**.
- Inputs and selects are 40px tall (`h-10`), table rows 52px, sidebar 248px, popups 520px wide.

## Where things are
**Sample data (`data/`)**: replace these with real APIs later.
- `phone-numbers.ts`: owned numbers (label, routedTo, type Mobile/Landline, active) and `availableNumbers` offered for purchase.
- `queues.ts`: queues (name, phoneNumbers[], channels, members), wrap-up outcomes per channel, `OutcomeIcon` type, `queueLabel()`, `formatCreatedAt()`.
- `users.ts`: members (name, email, lastLogin, memberSince, photo), `photoFor()`, `PLACEHOLDER_PHOTO`.

**Shared UI (`ui/`)**: reuse these before writing new ones.
- `modal.jsx`: popup on native `<dialog>` (title, subtitle, footer; Esc/backdrop close; `data-autofocus` picks the focused field).
- `confirm-dialog.jsx`: red "Delete X?" confirmation that stacks over a popup.
- `toast.jsx`: bottom-right success toast, auto-hides after 5s.
- `button.jsx`: `Button` (variants `primary` yellow, `outline`, `danger` red) and `IconButton`.
- `form.jsx`: `TextInput`, `TextArea`, and `FormPage`/`Section`/`FieldRow` for the centred form pages.
- `select.jsx`: `Select`, the standard single-choice dropdown in the design style (grey halo, ✓ on the chosen option). Props: `options`, `value`, `onChange(value)`, `label`, `placeholder`. Use it for every plain dropdown; there are no native `<select>`s.
- `tab-bar.jsx`: `TabBar` (underlined page tabs), `SegmentedControl`, `PillTabs` (full-width grey track).
- `data-display.jsx`: `Chip`, `ChipList` (+N), `Avatar` (photo or initials), `AvatarStack`, `StatusBadge`, `TableCard`, table class strings `th`/`tr`.
- `switch.jsx`: yellow toggle.
- `use-unsaved-changes.ts`: `useUnsavedChanges(value)` returns `{ dirty, markSaved }` by comparing against the last saved snapshot as JSON. Pass plain data only; compare icons by name.
- `use-floating-menu.ts`: shared dropdown open/close/position (fixed, flips upward when there isn't room, closes on outside click or scroll).
- `avatar-select.jsx`: single-choice dropdown with avatars (Agent field).
- `date-picker.jsx`: `DatePicker`, a date field with a Monday-first month calendar. The chosen day is a yellow circle and today is grey. It supports keyboard navigation and `invalid`/`errorId`. Dates are stored as `"YYYY-MM-DD"` and shown as "Apr 2, 2026" (`formatDate`, `toIso`, `fromIso`). Used for holidays.
- `audio-upload.jsx`: `AudioUpload`, a drop zone for one audio file of any common format (MP3, WAV, M4A, AAC, OGG, Opus, FLAC, WebM, AIFF, WMA, AMR…) up to 10 MB ("Click to upload or drag and drop"). Formats the browser can't play still upload, with a note that preview isn't available. Wrong type or size shows a red error. Once uploaded, it shows a file card with name, size and length, a play/pause preview with a progress bar, Replace, and remove. The uploaded-state design is my own (none was provided).
- `voice-recorder.jsx`: `VoiceRecorder`, which records from the microphone in the design's three states:
  - a Record button;
  - while recording, a stop button, a live green waveform and a timer;
  - afterwards, play/pause with a waveform that fills green as it plays, the length, and a delete button.
  A blocked microphone shows a red message. The value is `{ blob, duration, levels }`. To test without a mic, override `navigator.mediaDevices.getUserMedia` to return an oscillator stream.
- `time-select.jsx`: `TimeSelect`, a time field with a dropdown in 15-minute steps (00:00–23:45). The chosen time is ticked and centred when it opens. `timeOptions(step)` builds the list. `invalid` + `errorId` show the red error state. Used in Business hours.
- `multi-select.jsx`: checkbox dropdown with "N selected ×" (numbers, channels, members; disabled rows with a tag).
- `icon-picker.jsx`: `IconSelect` field + dropdown over all ~2,100 Lucide icons with search. The full set is loaded lazily on first open.

**Feature components (`screens/`)**
- Numbers & hours: `phone-numbers-table.jsx`, `add-numbers-modal.jsx` (select → setting up → added/failed + retry; failure is simulated ~30%), `edit-number-modal.jsx`, `business-hours.jsx`, `voicemail-settings.jsx`.
- Queues: `queues-table.jsx`, `queue-modal.jsx` (create/edit/delete).
- User management: page in `pages/user-management.jsx`, invite popup `invite-members-modal.jsx`.
- Wrap-up: `wrap-up-outcomes.jsx` (table + state), `wrap-up-preview.jsx` (drag-to-reorder card), `outcome-modal.jsx` (add/edit/delete), `outcome-marker.jsx` (draws an outcome's icon).

## Behaviour decisions
- **Toasts:** every save, add and delete shows one, e.g. "Changes to X have been saved.", "X has been deleted successfully!".
- **Deletes:** always go through `ConfirmDialog`.
- **Popup footers:** an edit popup always shows Delete (if the item is deletable), but Save changes appears only after an edit. A popup with nothing to show has no footer at all. In create popups, Save appears once you start typing and stays disabled until there's a name.
- **Business hours:**
  - A range whose end time is at or before its start time gets a red end field and the message "End time must be later than start time." underneath.
  - Save changes stays disabled while any open day has an error. Closed days aren't checked.
  - Monday's sample middle range is 12:00–13:00; the design's 12:00–12:00 would be an error.
  - Holidays use date pickers. A holiday ending before it starts shows "End date can’t be before start date." and blocks Save; a one-day holiday is fine.
  - Save changes stays disabled while any holiday is missing its name, start date or end date. There's no message for this, only the disabled button.
  - Sample holidays use real 2026 dates: Easter Apr 2–6, Whitsun May 24–25, Sankt Hans Jun 23, Christmas Dec 24–26.
- **Voicemail:** the greeting type options are:
  - "Typed text, read aloud": shows the text box.
  - "An uploaded audio file": shows `AudioUpload`. Save stays disabled until a file is uploaded. Files only count as a change while this option is chosen. Nothing is actually uploaded; the file stays in the browser.
  - "Record a greeting now": shows `VoiceRecorder`. Save stays disabled until a recording exists.
- **Phone numbers:**
  - Bought numbers are added as inactive "New number", routed to "--".
  - The Edit popup's Route to has Queues / Agents tabs.
  - The column is titled "Queue/Agent".
- **Queues:**
  - A number already routed to a different queue is disabled in the picker, with a tag like "Feeding sales".
  - A queue can have several numbers; the table shows the first number plus "+N".
- **Wrap-up outcomes:**
  - Columns are Buttons and Created at.
  - The **preview has its own button order**, separate from the table order.
  - **Save changes** only appears when the preview order differs from the last saved order.
  - Drag drops into the grid cell nearest the pointer; the blue line marks the exact landing slot. Arrow keys also move a focused button.
  - Outcomes with `isDefault: true` (Resolved, Info sent, Follow-up, Callback later, Wrong number, Kept note) **can't be deleted**. Their name, icon and options can still be edited.
  - Each outcome stores a Lucide icon `{ name, Icon }` and three switches: asks for date & time, requires a note, auto archive.
- **User management, Add members** (`invite-members-modal.jsx`):
  - One or more emails, separated by commas (new lines, spaces and semicolons also work).
  - Bad addresses and existing members show red errors. The address still being typed isn't flagged until it's followed by a separator or the box loses focus.
  - Send invitation stays disabled until every email is valid. Cmd/Ctrl+Enter sends.
  - Invitees are added at the top as "Invitation sent", named after the part of the email before the @, with the toast "Invitations sent to N people."
- **User management, bin icon:** always asks first.
  - Pending invites (no "Member since") get "Cancel invitation?" / "Yes! Cancel" and the toast "Invitation to {email} has been cancelled."
  - Members get "Remove agent?" / "Do you really want to remove **Name**?" / "Yes! Remove" and the toast "{Name} has been removed."
- **Avatars:** everyone with a photo uses one placeholder face cropped from the mock (`public/avatars/placeholder.png`); real photos go in `public/avatars/` via `users.ts`.
- **Logo:** `public/powermatch-logo.svg` (the real one).

## Not built yet
- Nothing persists (no backend); every Save only updates local state.
- Voicemail, Compliance and Business hours saves only update local state, then show a toast. Invitations aren't actually emailed.
- Tabs seen in designs but not built: Numbers & hours → Routing settings, Outbound & smart rotation; Queues → Answer-time targets.
- Sidebar items outside Admin settings are inert.
