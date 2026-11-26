# Company profile notes

Goal: notes on the **internal** company profile (agents/recruiters, inside the PowerMatch app). Built from the owner's screenshot (Reno Power ApS.), with the latest profile notes design. Desktop only.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | App shell (Companies active), breadcrumb (Team › Company › name), logo + name + "Source: Meta Ads", tabs with counts (Company Details · Tasks 3 · Notes · Jobs 3 · Employees · Matches · Settings · Payment), full-width Notes tab, Thread panel on the right. AI note type, badge at the bottom right of the card. |

Prototype: `parts/CompanyNotesPage.tsx` (content area scrolls as one, Thread panel sticks).

## UI (copy these)
```
profile/CompanyHeader.tsx ← breadcrumb + logo (falls back to a building icon) + name + source. Props: company: CompanyHeader, onBack?()
profile/ProfileTabs.tsx   ← tabs with an optional count chip (99+ max), dark underline on the active tab. Props: tabs: { key, label, count? }[], value, onChange(key)
```
- Notes, filters, Active/Archived, pin/archive, paging, edit/delete, Thread panel: same as Notes in profile (`notes-profile/parts/ProfileNotesSection.tsx` + `notes-profile/notes/*`). The Notes tab count = active (not archived) notes.

## Data (`src/mock/notes.ts`)
- `notesCompany: CompanyHeader` — name 'Reno Power ApS.', logo `/mock/reno-power-logo.svg`, source, counts { tasks, jobs }.
- `companyProfileNotes` — 66 notes: cn1 pinned (mentions Patrick Andre), cn2 worst case (long name, long text + link, 3 mentions, 24 replies, unread), 64 generated company notes (`co…`, some archived, one pinned, some with replies).

## Differences from the screenshot
- English copy (lab rule): "Source: Meta Ads", nav labels in English.
- Logo is a placeholder in PowerMatch colours (warning/info), on a `warning-50` circle.
