// Search logic for "Start new conversation". Plain JavaScript — no Vue, no app state —
// so it can be reused as-is or replaced by a server-side search.

/** Case-insensitive "contains" match against any of the given fields. Empty query matches everything. */
export function matches(query, ...fields) {
  const q = query.trim().toLowerCase()
  return !q || fields.some((f) => f?.toLowerCase().includes(q))
}

/** Every contact person of every company, with their company attached. */
export function flattenContacts(companies) {
  return companies.flatMap((co) =>
    co.contacts.map((p) => ({ ...p, companyId: co.id, company: co.name, companyLogo: co.logo })),
  )
}

/**
 * Search all groups at once.
 * Contact persons are only returned while the user is searching (never in the default list).
 * A contact matches on their own name or their company's name.
 */
export function searchDirectory(query, { companies, candidates, applicants }) {
  const searching = query.trim().length > 0
  return {
    searching,
    contacts: searching ? flattenContacts(companies).filter((p) => matches(query, p.name, p.company)) : [],
    companies: companies.filter((c) => matches(query, c.name)),
    candidates: candidates.filter((p) => matches(query, p.name, p.meta)),
    applicants: applicants.filter((p) => matches(query, p.name, p.meta)),
  }
}

/** Sort comparator: names starting with the query first, then names containing it, then the rest. */
export function byNameRelevance(query) {
  const q = query.trim().toLowerCase()
  const rank = (name) => (name.toLowerCase().startsWith(q) ? 0 : name.toLowerCase().includes(q) ? 1 : 2)
  return (a, b) => rank(a.name) - rank(b.name)
}
