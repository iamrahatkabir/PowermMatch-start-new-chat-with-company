# Company profile notes

Goal: notes on the **internal** company profile (agents/recruiters, inside the PowerMatch app). Desktop only.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | App shell (nav collapsed, Companies active), company summary on the left, tabs (Overview · Jobs · Contracts · Invoices · Notes) with the Notes tab open. Notes = the shared profile notes (AI note type, badge at the bottom right of the card). |

## UI (copy these)
```
profile/CompanySummary.tsx ← left column: logo, name, contracts pill, Company Info (email, address), Contact Persons (avatar, name, role, call button), Open Jobs (title, open • hired • city)
```
- `CompanySummary` props: `company: Company` (from `@/mock/inbox-types`). Long names truncate; lists show everything.
- Notes, filters, paging, pin/archive, edit/delete and Thread panel: same as Notes in profile (`notes-profile/parts/ProfileNotesSection.tsx` + `notes-profile/notes/*`). Page layout: `notes-profile/parts/InternalProfilePage.tsx`.

## Data (`src/mock/notes.ts`)
- Company: `clientCompanies[0]` (Ancorless Bangladesh) from `src/mock/inbox.ts`.
- `companyProfileNotes` — 66 notes: cn1 pinned (mentions Patrick Andre), cn2 worst case (long name, long text + link, 3 mentions, 24 replies, unread), 64 generated company notes (`co…`, some archived, one pinned, some with replies).
