# Emails (developer handoff)

Email conversations inside the inbox: an email thread and the email composer.

| File | What it is |
|---|---|
| `../inbox/email/EmailMessage.vue` | One email in the thread: bold subject, body clamped to 2 lines, **View details** expands it (From/To, full body, quoted text) and shows **Reply**. Links in the body are clickable. **Ship this.** |
| `../inbox/email/EmailAttachments.vue` | Attachments of one email: image thumbnails + file cards with download. Used inside EmailMessage. **Ship this.** |
| `../inbox/email/ImagePreview.vue` | Full-screen image preview (← → / Esc, Download). Used inside EmailMessage. **Ship this.** |
| `../inbox/email/attachments.js` | Plain-JS helpers: file type, size format, image check, status labels. **Ship this.** |
| `../inbox/parts/fakeDownload.js` | Prototype only: makes Download save a dummy file. |
| `../inbox/parts/ConversationThread.vue` | Prototype thread + composer. The Email tab adds a **Subject** field, uses "Write description here", and needs both subject and body before Send. Enter adds a new line in emails (Enter sends in chat/SMS). |
| `A.vue` … `G.vue` | Preview wrappers: open Dianne Russell's email conversation with the sidebar expanded (via `parts/EmailsInbox.vue`). |

## Versions

| Version | Component (copy this) | What it is |
|---|---|---|
| A | `../inbox/email/EmailMessage.vue` with `always-open` | No View details: every email shows From / To, the full text, quoted text (••• button), files and Reply right away. |
| B | `../inbox/email/EmailMessageExpand.vue` | Same bubble as E (subject, attachment counts "8 images" / "2 files" at the top, 2 lines of body). **View details** (or a count) expands the email in place below it, no pop-up: From / To, full body, quoted text, images (click → full-screen preview), files with download, **Hide details** and **Reply**. |
| D | `../inbox/email/EmailMessage.vue` | View details expands the email in place; thumbnails and file cards are always shown. |
| E | `../inbox/email/EmailMessageModal.vue` + `EmailDetailsModal.vue` | The bubble shows subject, attachment counts at the top ("8 images", "2 files") and 2 lines of body. **View details** (or a count) opens a modal: subject, From / To, full body, quoted text, images (click → full-screen preview), files with download, **Close** and **Reply** (closes the modal and opens the reply composer). Esc or the backdrop closes it. |

E uses the bubble `EmailMessageModal.vue`; its `details` prop picks which details component opens (default `EmailDetailsModal`). Shared pieces: `EmailBody.vue` (text, links, quoted text), `EmailAttachments.vue` (`stacked`, `small` options), `ImagePreview.vue`, `useModalKeys.js` (Esc closes; ← → don't switch lab versions).
B and E have the same props and events as `EmailMessage` (`failed` / `sending` aren't shown).

### C and F: simple emails
C changes the email in the thread (composer stays the same as A). F changes **both** the email in the thread and the composer. Files in `../inbox/email/simple/`.

| Version | Email in the thread | Composer |
|---|---|---|
| C | `EmailCardReply.vue`: white card with the subject and a tertiary **Reply** button on top that shows on hover, then text (6 lines + Show more) and files. | The built-in composer, same as A. |
| F | `EmailChatBubble.vue`: looks like a chat message. Subject is a small label, the whole text is visible (8 lines + Show more), files right under it. Reply link on hover. | `EmailComposerQuick.vue`: just type and Send. It replies to the newest email, so the subject is filled in ("RE: …"); click it to change, or **New email** for a fresh subject. Ctrl/⌘ + Enter sends. |

Shared: `simple/EmailFiles.vue` (thumbnails + file chips with download, image preview), `simple/FileChips.vue` (files added in the composer), `simple/compose.js` (RE: subject, picked file → attachment, links, sender name).
Composer API (F): props `to`, `lastEmail` (newest email `{ subject }`), `replyTo` (email whose Reply was clicked), `disabled`; events `send({ subject, body, attachments })`, `cancel-reply`. Files can be dropped on the composer.

### G: replies in a thread (like notes)
Files in `../inbox/email/thread/`.

| File | What it is |
|---|---|
| `EmailThreadRoot.vue` | The first email of a thread, in the conversation: subject, 3 lines of body, small image thumbnails / files, a **"N replies • Last reply …"** row with reply avatars. Replies are not listed in the conversation. Without replies (empty state, like notes) it ends with a blue **Reply** link that opens the Thread panel. Clicking the email itself expands it in place (From / To, full text); click again to collapse. Props `subject`, `body`, `dir`, `from`, `to`, `attachments`, `replies`; events `open-thread`, `download`. |
| `EmailThreadPanel.vue` | Right-hand **Thread** panel (replaces the contact panel while open): the first email with From / To, "N replies", every reply (avatar, name • time, text, files, image preview), and a **Reply…** box with attach + Send (Ctrl/⌘ + Enter). No subject field, replies are sent as "RE: <subject>". Props `root`, `replies`, `disabled`; events `close`, `send({ body, attachments })`, `download`. |
| `threads.js` | `threadKey(subject)` (strips RE: / Fwd: / SV:), `groupReplies(items)` → `{ replies: { [rootId]: [] }, isReply: Set }`. The first email with a subject starts the thread; later emails with the same subject are its replies. |

Prototype glue: `parts/EmailThreadSide.vue` (finds the open thread, sends replies into the fake inbox). Sample data added only in G (`EmailsInbox` `extra-emails`): `emailThreadSamples` in `@/mock`, with 3 replies to "Photos from my last projects" and a new email without replies ("Question about the company car"). `ConversationThread` gets `group-replies`, `InboxLayout` gets `thread-panel`; the open thread is `state.emailThreadId` in `useInbox`.

## Swapping the email in the thread
`<EmailsInbox :email-component="MyEmail" />` makes the thread render `MyEmail` instead of `EmailMessage` (same props and events). Versions A and D use `EmailMessage` (A with `alwaysOpen`).

## Swapping the composer
`ConversationThread` has an `#email-composer` slot (passed through `InboxLayout` and `parts/EmailsInbox.vue`). A new composer version can fill it to replace the Email tab's content. It gets `to`, `sender`, `replyTo`, `lastEmail`, `disabled`, `sendEmail({ subject, body, attachments })` and `cancelReply()`. Versions A–E and G use the built-in composer.

## EmailMessage

```vue
<EmailMessage
  :subject="email.subject" :body="email.body" dir="in"
  :from="email.from" :to="email.to" :quoted="email.quoted"
  :attachments="email.attachments" :failed="email.failedReason" :sending="email.sending"
  @reply="openReply(email)"
  @download="(file) => download(file.url, file.name)"
  @retry="resend(email.id)"
/>
```

| Prop | Type | Notes |
|---|---|---|
| `subject` | string | Required. Truncated to one line until expanded. |
| `body` | string | Plain text, line breaks kept. Optional (attachment-only emails). |
| `dir` | `'in'` \| `'out'` | in = left, gray · out = right, light blue |
| `from`, `to` | string | e.g. `Las Sabir <las@powermatch.dk>`. Shown when expanded. |
| `quoted` | string | Earlier message quoted in the email. Hidden behind a **•••** button when expanded. |
| `attachments` | `[{ id, name, size, url?, status? }]` | `size` in bytes. `status`: `'expired'` or `'blocked'` (virus scan) → shown, not downloadable. |
| `failed` | string | Outgoing email bounced: shows the reason and **Retry**. Hides Reply. |
| `sending` | boolean | Shows "Sending" instead of Reply. |

Events: `reply`, `download(file)`, `retry`.

## Email edge cases (examples in Dianne Russell's conversation)

| Case | How it looks |
|---|---|
| Files attached | Cards with a type icon (PDF red, Word blue, Excel green, zip gray), name, type • size, download button. 2 per row. |
| Long file name | Truncated with the full name on hover. |
| 2+ attachments | No count or total size row, no Download all. Files download one by one. |
| One image | One large 4:3 thumbnail. |
| Several images | Square grid, 3 per row, max 6; the 6th shows **+N** for the rest. Hover shows a download button; click opens the preview. |
| Image can't load (e.g. HEIC, broken link) | Gray tile "Image can't be shown"; still in the preview/download set. |
| Attachment-only email (no body) | Subject + attachments, Reply shown straight away (nothing to expand). Not in the mock thread. |
| Expired file | `status: 'expired'`: grayed card, "No longer available", no download. Not in the mock thread. |
| Blocked file (virus scan) | `status: 'blocked'`: grayed card, red "Blocked: may be unsafe", no download. Not in the mock thread. |
| Sender and recipient | From / To rows when expanded. |
| Quoted earlier message | `quoted` prop: **•••** button when expanded; shows the quote with a left border. Not in the mock thread. |
| Bounced outgoing email | Supported via the `failed` prop (red "Not delivered. {reason}" box with **Retry**), but not shown in the mock thread. |

Paperclip icon next to the subject marks emails with attachments. Attachments stay visible when the email is collapsed.

## Replying
- Reply switches the composer to the Email tab. The subject row becomes a fixed **↩ RE: {subject}** (no "RE: RE:") with **✕** to cancel and write a new email instead.
- Only the description is needed to send a reply. The reply is sent with the RE: subject.

## Layout
- Emails are full width of the thread minus a 48px gap on the opposite side (in: gap on the right, out: gap on the left). Chat and SMS bubbles stay at 70%.

## Behaviour notes
- Opening a conversation puts the composer on that conversation's channel (email → Email tab, SMS → SMS tab, otherwise Chat).
- Sending an email counts as reaching out, so it clears a **Callback requested** state (see `../inbox/README.md`).
- The assignee picker shows who handles the conversation; **Assign to me** sets it to the current user.
