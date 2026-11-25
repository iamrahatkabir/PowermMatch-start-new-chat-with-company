// Plain-JS helpers for threaded emails (version A). No React.

// "RE: Fwd: Application Received" → "application received" — emails with the same key are one thread
export const threadKey = (subject = '') => subject.replace(/^\s*((re|fw|fwd|sv|vs)\s*:\s*)+/i, '').trim().toLowerCase()

// Splits a conversation's items into thread roots and their replies.
// The first email with a subject starts the thread; later emails with the same subject are its replies.
// Returns { replies: { [rootId]: email[] }, isReply: Set<emailId> }
export function groupReplies<T extends { id: string; subject?: string }>(items: T[]): { replies: Record<string, T[]>; isReply: Set<string> } {
  const rootByKey: Record<string, T> = {}
  const replies: Record<string, T[]> = {}
  const isReply = new Set<string>()
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
