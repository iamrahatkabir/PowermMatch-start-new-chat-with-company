# PowerMatch Design Lab

## How to reply
Keep replies medium length: only what's needed to understand what changed or what to decide. No intros, recaps of the request, or extra detail. Use short bullets when listing several things.

## One version by default
Build **one** version (variant A) of any design. Only create more variants (B, C, …, switchable in the toolbar) when the user explicitly asks for more versions.

Vue 3 + Vite + Tailwind v4 sandbox for designing PowerMatch UI in several variants and comparing them. Frontend only, dummy data, no backend.
Everything you need is in this file. **Do not** read `src/ds/*`, `src/lab/*`, `src/styles/main.css`
or the design system artifact unless a task changes them — their APIs are summarised below.

## Layout
- `src/designs/<slug>/meta.js` — `{ title, question, variants: { A: 'label', … } }`
- `src/designs/<slug>/A.vue`, `B.vue`, … — one page per variant (auto-discovered, no registration)
- `src/designs/<slug>/parts/*.vue` — pieces shared by that design's variants. A variant imports the parts it keeps and replaces only the part being tested (e.g. `inbox/B.vue` swaps `ConversationThread` for its own version).
- `src/mock/index.js` — shared mock data. Import from `@/mock`; add to it rather than inventing data inline.
- `npm run new <slug> [count]` scaffolds a design; `npm run new <slug> +` copies the last variant to the next letter.
- Routes: `/` gallery · `/d/<slug>?v=B` one variant (toolbar; keys 1–9, ← →, H hides it; drag its grip to move it, double-click the grip to reset)

## Working rules (keep token use low)
- New variant: run the scaffold script, then edit only that variant file + `meta.js`. Read at most one sibling variant, and only if the task says to build on it.
- Variants never import another variant file — share through `parts/`.
- **Developer handoff structure** (every design): put each version's actual UI in its own self-contained component (props in, events out, no prototype store or mock imports), plain-JS logic in its own `.js` file, and keep `A.vue`, `B.vue`… as thin preview wrappers. Prototype-only code stays in `parts/`. Each design gets a `README.md` saying which file is which version, its props/events and data shapes. Example: `src/designs/inbox/`.
- `PmAppShell` emits `nav(key)` when a nav item is clicked; a design uses it to switch views inside the same design (e.g. inbox: All ↔ Notification settings). Don't create a separate design for a page that belongs to an existing area — add it as a view of that design.
- Inbox design: see `src/designs/inbox/README.md`. Versions live in `start-chat/StartChat*.vue`; the prototype store is `parts/useInbox.js` (`provideInbox()`, `startWithContact`, `startWithPerson`, `switchContact`, `send`).
- Rule for company chats: a conversation with a contact person always opens under the **company's** name; the contact is shown as "Current" in Company info. If 2+ designs need the same new piece, add a `Pm*` component in `src/ds/` (auto-registered globally) and add one line to the table below.
- Don't run `npm run build` or take screenshots after every edit. If a **new design folder** shows unstyled in the dev server, restart the dev server (Tailwind's watcher misses new folders). Verify once at the end of a task, or when asked.

## Components (global — use without importing)
| Component | Props / slots |
|---|---|
| `PmAppShell` | `nav-collapsed` starts the nav as icons. Real product chrome (top header + collapsible grouped nav). `active` = nav key: overview · inbox-all · inbox-support · inbox-upcoming · inbox-communication · inbox-archive · inbox-notifications · interviews · time · payroll · contracts · invoicing · candidates · companies · jobs-all · jobs-applicants · journeys · numbers · career-page. `title`/`subtitle` add a page title bar; `flush` = no padding, full height (for multi-column screens). Slots: default, `#actions` |
| `PmButton` | `variant` primary·secondary·outline (transparent, bordered)·ghost·danger·dark, `size` sm·md·lg, `icon` (icon name), `block` |
| `PmInput` | `v-model`, `label`, `placeholder`, `type`, `error`, `hint`; slots `#prefix` `#suffix` |
| `PmSelect` | `v-model`, `label`, `options: [{ value, label }]` |
| `PmStatusPill` | `tone` success·warning·error·info·neutral·brand, `dot` (default true), `bordered` (outlined style used in side panels) |
| `PmMatchChip` | `score` (always green) |
| `PmAvatar` | `name` (initials) or `src`, `size` (px), `palette` 0–3 |
| `PmToggle` | `v-model` (boolean), `label` (accessible name). Yellow when on |
| `PmCard` | `padding` (Tailwind class, default `p-5`) |
| `PmTabs` | `v-model`, `tabs: [{ key, label, count? }]` |
| `PmSectionHeader` | `icon`, `title`, `subtitle`; slot `#actions` |
| `PmIconTile` | `icon`, `tone` brand·gray, `size` |
| `PmIcon` | `name`, `size` (default 20) |
| `PmAppHeader` / `PmSidebar` / `PmTopBar` / `PmLogo` | used inside `PmAppShell`; use them directly only for custom layouts |

Mock data (`@/mock`) — each status map is `{ key: { tone, label } }`, ready for `PmStatusPill`:
- `candidates` + `STATUS` · `jobs` + `JOB_STATUS` · `companies`
- `interviews` + `INTERVIEW_STATUS` · `contracts` + `CONTRACT_STATUS` · `timesheets` + `TIMESHEET_STATUS` (these reference `candidateId` / `jobId`)
- `notifications`, `todos`, `kpis`, `currentUser`
- Notification settings (`src/mock/notifications.js`): `notificationSounds`, `notificationSettings`
- Inbox (`src/mock/inbox.js`): `clientCompanies` (with `contacts`, `jobs`, `invoices`), `contactDirectory` (candidates/applicants), `conversations` + `CONVERSATION_KIND`, `threads` (by conversation id), `agents`, `candidateProfile`, `PROFILE_STATUS`
- Helpers: `candidateById(id)`, `jobById(id)`, `dkk(n)`

UI icons: **Lucide** (`import { Phone, Mail } from 'lucide-vue-next'`, use `:size="16|18|20"`, colored via `text-gray-600`). This matches the current product.
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
- Layout: 64px top header, 240px nav (collapsible to 72px, hidden < lg), active nav item `bg-gray-100 font-semibold`, forms as a 2-column grid collapsing to 1. Must work at 375px wide.

## Sharing
- `npm run build` → static `dist/` you can drop on Vercel or Netlify to share review links (SPA fallbacks already in place).
- Source of truth for tokens: the PowerMatch design system artifact (https://claude.ai/artifact/P53rwd7rZwvNk1kqUknKoD). Re-sync only when it changes.
