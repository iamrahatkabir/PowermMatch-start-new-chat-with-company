# Company profile notes

Goal: notes on the **internal** company profile (agents/recruiters, inside the PowerMatch app). Built from the owner's screenshot (Reno Power ApS.), with the latest profile notes design. Desktop only.

| Version | File | What it is |
|---|---|---|
| A | `A.tsx` | App shell (Companies active), breadcrumb (Team › Company › name), logo + name + "Source: Meta Ads", tabs with counts (Company Details · Tasks 3 · Notes · Jobs 3 · Employees · Matches · Settings · Payment), full-width Notes tab, Thread panel on the right. AI note type, badge at the bottom right of the card. |

Prototype: `parts/CompanyNotesPage.tsx` → shared `notes-profile/parts/ProfileNotesPage.tsx` (content area scrolls as one, Thread panel sticks; also used by Applicant/Candidate profile notes).

## UI (copy these)
```
profile/CompanyHeader.tsx ← breadcrumb + logo (falls back to a building icon) + name + source. Props: company: CompanyHeader, onBack?()
notes-profile/profile/ProfileTabs.tsx ← (shared) tabs with an optional count chip (99+ max), dark underline on the active tab. Props: tabs: { key, label, count? }[], value, onChange(key)
```
- Notes, filters, Active/Archived, pin/archive, paging, edit/delete, Thread panel: same as Notes in profile (`notes-profile/parts/ProfileNotesSection.tsx` + `notes-profile/notes/*`). The Notes tab count = active (not archived) notes.

## Data (`src/mock/notes.ts`)
- `notesCompany: CompanyHeader` — name 'Reno Power ApS.', logo `/mock/reno-power-logo.svg`, source, counts { tasks, jobs }.
- `companyProfileNotes` — 66 notes: cn1 pinned (mentions Patrick Andre), cn2 worst case (long name, long text + link, 3 mentions, 24 replies, unread), 64 generated company notes (`co…`, some archived, one pinned, some with replies).

## Differences from the screenshot
- English copy (lab rule): "Source: Meta Ads", nav labels in English.
- Logo is a placeholder in PowerMatch colours (warning/info), on a `warning-50` circle.

## Tagging
Same as Notes in profile (see `notes-profile/README.md` → Tagging). This profile's own name is left out of the @ list; mock tagged-in note: `cn-tag` (from James Adam).

Reno Power ApS. is the same company as the inbox company conversation (`cv-ancorless`, renamed from Ancorless Bangladesh): tagging it in any inbox chat, or writing a tagged note in its own chat, shows the note on this Notes tab.

## AI summary
At the top of Notes: "AI Summary of latest 20 notes" with type chips, refresh, fold arrow and up to 6 key points. Shared with the other profile designs — see `notes-profile/README.md` → AI summary.
