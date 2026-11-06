# Emails (developer handoff)

Email conversations inside the inbox: an email thread and the email composer.

| File | What it is |
|---|---|
| `../inbox/email/EmailMessage.vue` | One email in the thread: bold subject, body clamped to 2 lines, **View details** expands it (From/To/Cc, full body, quoted text) and shows **Reply**. Links in the body are clickable. **Ship this.** |
| `../inbox/email/EmailAttachments.vue` | Attachments of one email: image thumbnails + file cards with download. Used inside EmailMessage. **Ship this.** |
| `../inbox/email/ImagePreview.vue` | Full-screen image preview (← → / Esc, Download). Used inside EmailMessage. **Ship this.** |
| `../inbox/email/attachments.js` | Plain-JS helpers: file type, size format, image check, status labels. **Ship this.** |
| `../inbox/parts/fakeDownload.js` | Prototype only: makes Download save a dummy file. |
| `../inbox/parts/ConversationThread.vue` | Prototype thread + composer. The Email tab adds a **Subject** field, uses "Write description here", and needs both subject and body before Send. Enter adds a new line in emails (Enter sends in chat/SMS). |
| `A.vue` | Preview wrapper: opens Dianne Russell's email conversation with the sidebar expanded. |

## EmailMessage

```vue
<EmailMessage
  :subject="email.subject" :body="email.body" dir="in"
  :from="email.from" :to="email.to" :cc="email.cc" :quoted="email.quoted"
  :attachments="email.attachments" :failed="email.failedReason" :sending="email.sending"
  @reply="openReply(email)"
  @download="(file) => download(file.url, file.name)"
  @download-all="(files) => downloadZip(email.id)"
  @retry="resend(email.id)"
/>
```

| Prop | Type | Notes |
|---|---|---|
| `subject` | string | Required. Truncated to one line until expanded. |
| `body` | string | Plain text, line breaks kept. Optional (attachment-only emails). |
| `dir` | `'in'` \| `'out'` | in = left, gray · out = right, light blue |
| `from`, `to` | string | e.g. `Las Sabir <las@powermatch.dk>`. Shown when expanded. |
| `cc` | string[] | Shown when expanded. |
| `quoted` | string | Earlier message quoted in the email. Hidden behind a **•••** button when expanded. |
| `attachments` | `[{ id, name, size, url?, status? }]` | `size` in bytes. `status`: `'expired'` or `'blocked'` (virus scan) → shown, not downloadable. |
| `failed` | string | Outgoing email bounced: shows the reason and **Retry**. Hides Reply. |
| `sending` | boolean | Shows "Sending" instead of Reply. |

Events: `reply`, `download(file)`, `download-all(files)` (only available files), `retry`.

## Email edge cases (examples in Dianne Russell's conversation)

| Case | How it looks |
|---|---|
| Files attached | Cards with a type icon (PDF red, Word blue, Excel green, zip gray), name, type • size, download button. 2 per row. |
| Long file name | Truncated with the full name on hover. |
| 2+ attachments | "N attachments • total size" with **Download all** (one zip). |
| One image | One large 4:3 thumbnail. |
| Several images | Square grid, 3 per row, max 6; the 6th shows **+N** for the rest. Hover shows a download button; click opens the preview. |
| Image can't load (e.g. HEIC, broken link) | Gray tile "Image can't be shown"; still in the preview/download set. |
| Attachment-only email (no body) | Subject + attachments, Reply shown straight away (nothing to expand). Not in the mock thread. |
| Expired file | `status: 'expired'`: grayed card, "No longer available", no download. Not in the mock thread. |
| Blocked file (virus scan) | `status: 'blocked'`: grayed card, red "Blocked: may be unsafe", no download. Not in the mock thread. |
| Cc recipients | From / To / Cc rows when expanded. |
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
