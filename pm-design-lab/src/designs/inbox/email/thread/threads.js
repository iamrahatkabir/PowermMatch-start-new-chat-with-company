// Plain-JS helpers for threaded emails (version G). No Vue.

// "RE: Fwd: Application Received" → "application received" — emails with the same key are one thread
export const threadKey = (subject = '') => subject.replace(/^\s*((re|fw|fwd|sv|vs)\s*:\s*)+/i, '').trim().toLowerCase()

// Splits a conversation's items into thread roots and their replies.
// The first email with a subject starts the thread; later emails with the same subject are its replies.
// Returns { replies: { [rootId]: email[] }, isReply: Set<emailId> }
export function groupReplies(items) {
  const rootByKey = {}
  const replies = {}
  const isReply = new Set()
  for (const m of items) {
    if (!m.subject) continue
    const key = threadKey(m.subject)
    const root = rootByKey[key]
    if (!root) {
      rootByKey[key] = m
      replies[m.id] = []
    } else {
      replies[root.id].push(m)
      isReply.add(m.id)
    }
  }
  return { replies, isReply }
}
