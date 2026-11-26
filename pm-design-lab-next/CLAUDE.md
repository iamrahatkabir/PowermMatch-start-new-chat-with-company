# PowerMatch Design Lab

## How to reply
**Short answers.** The owner wants to read replies quickly.
- A few short bullets or 1–3 sentences. Plain, simple words.
- Say what changed (or the answer) and anything they must decide. Nothing else.
- No intros, no recap of the request, no file-by-file details unless asked.
- Link the page to look at (http://localhost:3000/d/<slug>?v=X).

## Track every change
After each task, add a dated entry at the top of `CHANGELOG.md`: what changed, which design/version, the owner's instruction in a few words. Update this file when a rule or structure changes, and the design's `README.md` when its versions, props or behaviour change. Keep entries short.

## One version by default
Build **one** version (variant A) of any design. Only create more variants (B, C, …, switchable in the toolbar) when the user explicitly asks for more versions.

Next.js 16 (App Router) + React 19 + **TypeScript** (strict) + Tailwind v4 sandbox for designing PowerMatch UI in several variants and comparing them. Frontend only, dummy data, no backend. Every design renders client-side only.
Everything you need is in this file. **Do not** read `src/ds/*`, `src/lab/*`, `app/*`, `src/styles/globals.css`
or the design system artifact unless a task changes them — their APIs are summarised below.

## Layout
- `src/designs/<slug>/meta.ts` — `const meta: DesignMeta = { title, question, variants: { A: 'label', … } }` (`DesignMeta` from `@/lab/types`)
- `src/designs/<slug>/A.tsx`, `B.tsx`, … — one page per variant, `export default function VariantA()`. Discovered automatically: `npm run dev` regenerates `src/lab/designs.generated.ts` (don't edit it) whenever a design or variant file is added; `npm run registry` does it by hand.
- `src/designs/<slug>/parts/*.tsx` — pieces shared by that design's variants. A variant imports the parts it keeps and replaces only the part being tested.
- Files that use hooks or event handlers start with `'use client'`.
- `src/mock/index.ts` — shared mock data. Import from `@/mock`; add to it rather than inventing data inline. Inbox data types (`Conversation`, `ThreadItem`, `Attachment`, …) are in `src/mock/inbox-types.ts`, also exported from `@/mock`.
- **Types:** every component has typed props (`type Props = {…}`), callbacks typed (`onX?: (v: string) => void`). No `any`, no `@ts-ignore`. Run `npx tsc --noEmit` before finishing a task; it must be clean.
- `npm run new <slug> [count]` scaffolds a design; `npm run new <slug> +` copies the last variant to the next letter.
- `npm run dev` → http://localhost:3000. If 3000 is taken (the owner's separate PowerMatch Design Lab app also uses it), run `PORT=3001 npm run dev`.
- Routes: `/` gallery · `/d/<slug>?v=B` one variant (toolbar; keys 1–9, ← →, H hides it; drag its grip to move it, double-click the grip to reset)

## Design for the worst case
Always design for edge cases, not just the happy path: long names, long text, many items, many selections, empty states, missing photos, big numbers. Long text truncates with … (or wraps where reading matters), badges/chips/buttons never wrap or get squeezed (`shrink-0`, `whitespace-nowrap`), lists scroll, rows show "+N" when they overflow. Put at least one worst-case example in the mock data and check it on desktop (1280px and 1440px) before finishing.

## Working rules (keep token use low)
- New variant: run the scaffold script, then edit only that variant file + `meta.ts`. Read at most one sibling variant, and only if the task says to build on it.
- Variants never import another variant file — share through `parts/`.
- **Developer handoff structure** (every design): put each version's actual UI in its own self-contained component (props in, `onX` callbacks out, no prototype store or mock imports), plain logic in its own `.ts` file, and keep `A.tsx`, `B.tsx`… as thin preview wrappers. Prototype-only code stays in `parts/`. Each design gets a `README.md` saying which file is which version, its props/callbacks and data shapes. Example: `src/designs/inbox/`.
- `PmAppShell` calls `onNav(key)` when a nav item is clicked; a design uses it to switch views inside the same design (e.g. inbox: All ↔ Notification settings). Don't create a separate design for a page that belongs to an existing area — add it as a view of that design.
- Inbox design: see `src/designs/inbox/README.md`. Versions live in `start-chat/StartChat*.tsx`; the prototype store is `parts/useInbox.ts` (`useCreateInbox()` + `<InboxProvider store>`, `useInbox()` → `startWithContact`, `startWithPerson`, `switchContact`, `send`, `update(fn)` for any other state change).
- Notes in inbox design (`src/designs/notes-inbox/`): reuses the inbox (`inbox/parts` + `StartChatSections`); notes UI in `notes-inbox/notes/` (NoteBubble, NoteComposer with @mentions, NoteThreadPanel) plugged in through InboxLayout's `renderNote` / `renderNoteComposer` / `renderLockedComposer` / `renderSidePanel`. Rule: chat/email/SMS need the ticket assigned to you; notes don't. Versions: A AI note type (set after posting, editable), B AI note type v2 (automatic, badge inside the note at the bottom right), C Manual note type (dropdown), D Manual note type v2 (chips next to Save note); all wrap `parts/NotesInbox.tsx`. See its `README.md`.
- Notes in profile design (`src/designs/notes-profile/`): candidate profile page with a Notes tab (`profile/CandidateProfile.tsx`, `notes/ProfileNotes.tsx`); reuses `MentionText` / `NoteComposer` from notes-inbox. See its `README.md`.
- Admin Settings design (`src/designs/settings/`): merged in from the separate PowerMatch Design Lab app; see its `README.md`. It keeps its own UI kit in `settings/ui/` (modal, select, toast, `useUnsavedChanges`…) — use those inside Settings, `@/ds` elsewhere. "Save changes" only appears when something changed.
- Rule for company chats: a conversation with a contact person always opens under the **company's** name; the contact is shown as "Current" in Company info. If 2+ designs need the same new piece, add a `Pm*` component in `src/ds/`, export it from `src/ds/index.ts`, and add one line to the table below.
- Don't run `npm run build` or take screenshots after every edit. Verify once at the end of a task, or when asked.

## New components: shadcn/ui
When a design needs a component that isn't in `@/ds` (or the design's own UI kit), take it from **shadcn/ui** (https://ui.shadcn.com/docs/components) instead of building it by hand. Keep using the `Pm*` components below for what they already cover.
- Installed (style `radix-nova`, `components.json`). Add one with `npx shadcn@latest add <name>`; files go in `src/components/ui/` and import `cn` from the `cn` package (shadcn's class merger; `@/lib/utils` re-exports it). Import as `@/components/ui/<name>`.
- **Colors are PowerMatch only:** shadcn's color variables (`--primary`, `--border`, …) are mapped to our tokens at the bottom of `src/styles/globals.css` (primary → `brand` with `gray-900` text, background → white, muted → `gray-50`/`gray-500`, border/input → `gray-200`/`gray-300`, ring → `gray-400`, destructive → `error-500`). Never add shadcn's default palette (slate, zinc, …) or its dark mode. Our radius, Inter font and brand rules still apply; if `shadcn init`/`add` ever rewrites `globals.css` or `app/layout.tsx` (fonts, radius), undo that part.
- Added so far: `button` (from init; prefer `PmButton` for buttons), `dropdown-menu`, `tooltip` (wrap with `TooltipProvider` locally; not in the layout), `toggle`, `toggle-group`. Add a line here when a shadcn component is added.

## Components (`import { PmButton, … } from '@/ds'`)
Controlled inputs use `value` + `onChange(value)`; named slots are props that take nodes (`actions`, `prefix`, `suffix`).

| Component | Props |
|---|---|
| `PmAppShell` | `navCollapsed` starts the nav as icons. Real product chrome (top header + collapsible grouped nav). `active` = nav key: overview · inbox-all · inbox-support · inbox-upcoming · inbox-communication · inbox-archive · inbox-notifications · interviews · time · payroll · contracts · invoicing · candidates · companies · jobs-all · jobs-applicants · journeys · numbers · career-page. `title`/`subtitle` add a page title bar; `flush` = no padding, full height (for multi-column screens). `onNav(key)`, `actions`, `className` (outer element), children |
| `PmButton` | `variant` primary·secondary·outline (transparent, bordered)·ghost·danger·dark, `size` sm·md·lg, `icon` (icon name), `block` |
| `PmInput` | `value` + `onChange`, `label`, `placeholder`, `type`, `error`, `hint`, `prefix`, `suffix` |
| `PmSelect` | `value` + `onChange`, `label`, `options: [{ value, label }]` |
| `PmStatusPill` | `tone` success·warning·error·info·neutral·brand, `dot` (default true), `bordered` (outlined style used in side panels) |
| `PmMatchChip` | `score` (always green) |
| `PmAvatar` | `name` (initials) or `src`, `size` (px), `palette` 0–3 |
| `PmToggle` | `checked` + `onChange(boolean)`, `label` (accessible name). Yellow when on |
| `PmCard` | `padding` (Tailwind class, default `p-5`), `className` |
| `PmTabs` | `value` + `onChange(key)`, `tabs: [{ key, label, count? }]` |
| `PmSectionHeader` | `icon`, `title`, `subtitle`, `actions` |
| `PmIconTile` | `icon`, `tone` brand·gray, `size` |
| `PmIcon` | `name`, `size` (default 20) |
| `PmAppHeader` / `PmSidebar` / `PmTopBar` / `PmLogo` | used inside `PmAppShell`; use them directly only for custom layouts |

Mock data (`@/mock`) — each status map is `{ key: { tone, label } }`, ready for `PmStatusPill`:
- `candidates` + `STATUS` · `jobs` + `JOB_STATUS` · `companies`
- `interviews` + `INTERVIEW_STATUS` · `contracts` + `CONTRACT_STATUS` · `timesheets` + `TIMESHEET_STATUS` (these reference `candidateId` / `jobId`)
- `notifications`, `todos`, `kpis`, `currentUser`
- Notes (`src/mock/notes.ts`): `noteColleagues`, `notesThread`, `profileCandidate`, `profileNotes`
- Notification settings (`src/mock/notifications.ts`): `notificationSounds`, `notificationSettings`
- Inbox (`src/mock/inbox.ts`): `clientCompanies` (with `contacts`, `jobs`, `invoices`), `contactDirectory` (candidates/applicants), `conversations` + `CONVERSATION_KIND`, `threads` (by conversation id), `agents`, `candidateProfile`, `PROFILE_STATUS`
- Helpers: `candidateById(id)`, `jobById(id)`, `dkk(n)`

UI icons: **Lucide** (`import { Phone, Mail } from 'lucide-react'`, use `size={16|18|20}`, colored via `text-gray-600`). Join classes with `cx()` from `@/lib/cx`. This matches the current product.
Legacy brand icons (`PmIcon name=`): arrow-down arrow-right billing briefcase building calendar calendar-outline check chevron-right clock clock-outline clock-yellow close companies contracts dashboard document featured-icon help interviews jobs logout menu notification plus plus-avatar report settings star user.

## Tokens → Tailwind classes
The default Tailwind palette is **removed**. Only these colors exist:
- `brand` #F8E965 · `brand-dark` (hover) · `brand-light` · `brand-bg` #FEFCE9 (icon tiles, active nav) · `brand-deep` (selected day) · `brand-text` (text on brand-bg)
- `gray-25…900` (Untitled UI). Headings `text-gray-900`, body `text-gray-600`, labels `text-gray-700`, muted `text-gray-500`
- `success|warning|error|info-50/200/500/700` (plus `info-25` for light call cards) — status pills and inline icons only
- `marketing`, `marketing-deep`, `marketing-accent` — landing pages only, never product UI
- `white`, `black`, `transparent`, `current`

Type (Inter): `text-xs` 12/18 · `text-sm` 14/20 · `text-base` 16/24 · `text-lg` 18/28 · `text-xl` 20/30 · `text-2xl` 24/32 · `text-3xl` 30/38. Headings `font-semibold`. Marketing: `font-display` + `text-display-1` (56) / `text-display-2` (44). Input text: `input-text`.
Radius: `rounded-lg` 8 (buttons, inputs) · `rounded-xl` 12 (inner cards) · `rounded-2xl` 16 (outer cards) · `rounded-full` (pills, avatars).
Shadow: `shadow-xs` (buttons) · `shadow-sm` (cards, rarely) · `shadow-lg`/`shadow-xl` (popovers, modals) · `shadow-focus` (focus ring). Modal scrim: `bg-gray-900/70`.
Spacing: the default 4px scale. Card padding `p-4`–`p-6`, gaps `gap-4`–`gap-6`, page padding `p-4 sm:p-8`.

## Brand rules
- Yellow is ≤5% of a screen: primary CTA, logo, active nav, small "New" badges, icon tiles. Match scores are green.
- Page background `bg-gray-50`, surfaces white, **always** a 1px `border-gray-200` (or `border-gray-300` on inputs). No shadow-only cards, no gradients, no glassmorphism.
- Hover changes color only (no lift or scale). Focus is the soft gray ring, never a colored ring.
- Copy: **English** everywhere (nav: Dashboard, Jobs, Employees, Interviews, Contracts, Time Tracking, Reports). Danish people, places and company names are fine. Title Case labels, 1–3 words, no trailing periods, no exclamation marks, **no emoji**. DKK, `dd.mm.yyyy`, 24h time.
- Real trade icons matter (Carpenter, Bricklayer, Electrician, Plumber, Painter); don't swap in generic briefcases when a trade is the subject.
- Layout: 64px top header, 240px nav (collapsible to 72px, hidden < lg), active nav item `bg-gray-100 font-semibold`, forms as a 2-column grid collapsing to 1.
- **Desktop only for internal tools.** Screens for internal agents/recruiters (inbox, notes, settings…) are designed and checked on desktop only (1280px+); ignore mobile. Mobile (375px) matters only for designs for companies, applicants or candidates.

## Sharing
- `npm run build` builds the app; deploy the folder to Vercel to share review links.
- Source of truth for tokens: the PowerMatch design system artifact (https://claude.ai/artifact/P53rwd7rZwvNk1kqUknKoD). Re-sync only when it changes.



