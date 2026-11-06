# Emails (developer handoff)

Email conversations inside the inbox: an email thread and the email composer.

| File | What it is |
|---|---|
| `../inbox/email/EmailMessage.vue` | One email in the thread: bold subject, body clamped to 2 lines, **View details** expands it. Links in the body are clickable. **Ship this.** |
| `../inbox/parts/ConversationThread.vue` | Prototype thread + composer. The Email tab adds a **Subject** field, uses "Write description here", and needs both subject and body before Send. Enter adds a new line in emails (Enter sends in chat/SMS). |
| `A.vue` | Preview wrapper: opens Dianne Russell's email conversation with the sidebar expanded. |

## EmailMessage

```vue
<EmailMessage subject="RE: Application Received by PowerMatch" :body="email.body" dir="in" />
```

- `subject`, `body` (plain text, line breaks kept), `dir`: `'in'` (left, gray) or `'out'` (right, light blue).

## Behaviour notes
- Opening a conversation puts the composer on that conversation's channel (email → Email tab, SMS → SMS tab, otherwise Chat).
- Sending an email counts as reaching out, so it clears a **Callback requested** state (see `../inbox/README.md`).
- The assignee picker shows who handles the conversation; **Assign to me** sets it to the current user.
