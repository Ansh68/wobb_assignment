# Wobb — Influencer Search

A polished influencer discovery platform built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. Find and shortlist top creators across Instagram, YouTube, and TikTok.

## Live Demo

> _Deploy link (Vercel/Netlify) — add here after deployment_

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

---

## What's Included

- **Search / Dashboard** — filter influencers by platform and search by username or full name
- **Profile Details** — click any profile to view extended data (followers, engagement rate, avg likes/views/comments)
- **My List** — select profiles across platforms, manage your shortlist, persists on refresh
- **Routing** — `react-router-dom` with `/` (search) and `/profile/:username` (details)

---

## What Changed (Submission Notes)

### 1. Bug Fixes

| Bug | File | Fix Applied |
|-----|------|-------------|
| Engagement rate displayed as `rate * 10000` (100× too large) | `ProfileDetailPage.tsx` | Changed to `rate * 100` via `formatEngagementRate()` |
| "Engagements" stat card showed the *rate* instead of the raw count | `ProfileDetailPage.tsx` | Now renders `formatInteger(user.engagements)` |
| Username search was case-sensitive | `dataHelpers.ts` | Applied `.toLowerCase()` to both sides |
| `ProfileCard` had a hardcoded `w-[700px]` breaking responsiveness | `ProfileCard.tsx` | Removed; uses CSS Grid / fluid layout |
| Dead `clickCount` state that only logged to console | `SearchPage.tsx` | Removed entirely |
| No memoization — profiles refiltered on every render | `SearchPage.tsx` | Added `useMemo` for both `allProfiles` and `filteredProfiles` |
| External profile link missing `rel="noopener noreferrer"` | `ProfileDetailPage.tsx` | Added |
| `SearchBar.tsx` was dead code — imported nowhere | `SearchBar.tsx` | Deleted |
| `formatFollowers` duplicated in 3 different files | Multiple | Consolidated in `utils/formatters.ts`; all components import from there |
| `data-search` debug attribute on card div | `ProfileCard.tsx` | Removed |
| Missing `account_type` field in TypeScript types | `types/index.ts` | Added as `account_type?: number` |
| `loadProfileByUsername` generic type mismatch | `profileLoader.ts` | Code already compensated; left as-is (correct behaviour) |

---

### 2. UI/UX Redesign

**Design direction:** Dark-mode premium dashboard (Vercel / Linear style) with purple gradient accents and glassmorphism.

**Changes:**
- **Design system** (`index.css`) — full CSS custom property token set: surfaces, borders, text, accent colors, platform brand colors, shadow layers, radius scale, transitions, animation keyframes
- **Typography** — Inter (Google Fonts) via `index.html` preconnect; replaces system-ui default
- **Navbar** (`Layout.tsx`) — sticky glassmorphism header, Wobb logo with gradient icon, "My List" button showing live count badge
- **Platform filter** (`PlatformFilter.tsx`) — pill buttons with brand colors (Instagram pink, YouTube red, TikTok cyan), emoji icons, active glow effect, icon-adorned search input with clear button
- **Profile cards** (`ProfileCard.tsx`) — glass card design, platform indicator dot, hover lift animation, staggered entry animation, inline stats (followers + ER), responsive grid layout
- **Profile detail page** (`ProfileDetailPage.tsx`) — hero section with avatar glow + platform badge + background radial gradient, stats grid using `StatCard`, spinner loading state, styled error/empty states
- **Selected list panel** (`SelectedListPanel.tsx`) — slide-in side panel from the right, backdrop blur overlay, Escape key to close, body scroll lock, per-item remove, clear all
- **Verified badge** (`VerifiedBadge.tsx`) — replaced plain `✓` text with an SVG circle checkmark; configurable size
- **Empty states** — styled empty state UI for both profile list and selected list
- **SEO** (`index.html`) — proper `<title>`, `<meta name="description">`, and `lang` attribute

---

### 3. Zustand State Management

Replaced the intended React Context approach with **Zustand** for all global state.

**Store:** `src/store/useListStore.ts`

Features:
- Add profile to list (with duplicate detection by `user_id`)
- Remove individual profile
- Clear all
- `isSelected(userId)` selector
- **Persisted to `localStorage`** via `zustand/middleware/persist` — list survives page refresh
- Reorder support (`reorderProfiles`) for future drag-and-drop use

**Connected to:**
- `ProfileCard` — "Add to List" / "Added" toggle button
- `ProfileDetailPage` — primary "Add to List" / "Added to List" button
- `Layout` → `SelectedListPanel` — live count badge + panel management

---

## Libraries Added

| Library | Version | Purpose |
|---------|---------|------|
| `zustand` | `^5.x` | Global state management (selected list + persistence) |
| `lucide-react` | `^0.x` | Icon library — replaces all inline SVGs and emoji icons |
| `react-hot-toast` | `^2.x` | Toast notifications for Add/Remove list feedback |
| `clsx` | `^2.x` | Conditional CSS class merging utility |
| `@radix-ui/react-tooltip` | `^1.x` | Accessible tooltip primitives (via TooltipProvider in App) |

---

## Code Splitting & Performance

- **Lazy Loading** — Routes are implemented via `React.lazy()` and `Suspense` to reduce initial bundle size.
- **Data Fetching** — Used `import.meta.glob` for efficient static JSON loading; files are only read/parsed when the specific profile is requested.
- **Memoization** — Intensive filter calculations are wrapped in `useMemo`, and child list components are wrapped in `React.memo` to prevent unnecessary re-renders during high-frequency search typing.

---

## Project Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css              ← Design system tokens + animations
│
├── store/
│   └── useListStore.ts    ← [NEW] Zustand store (selected list)
│
├── components/
│   ├── Layout.tsx         ← Navbar + My List button + panel toggle
│   ├── PlatformFilter.tsx ← Platform pills + search input
│   ├── ProfileCard.tsx    ← Glassmorphism card + Add to List
│   ├── ProfileList.tsx    ← Responsive grid + empty state
│   ├── SelectedListPanel.tsx ← [NEW] Slide-in list management panel
│   ├── StatCard.tsx       ← [NEW] Reusable metric display card
│   └── VerifiedBadge.tsx  ← SVG checkmark badge
│
├── pages/
│   ├── SearchPage.tsx     ← Main search + filter page
│   └── ProfileDetailPage.tsx ← Full profile with stats grid
│
├── types/
│   └── index.ts
│
└── utils/
    ├── dataHelpers.ts     ← Data loading + case-insensitive filter
    ├── formatters.ts      ← Consolidated formatFollowers, formatEngagementRate, formatInteger
    └── profileLoader.ts   ← Lazy JSON loader via import.meta.glob
```

---

## Assumptions & Trade-offs

- **No real API** — all data is served from static JSON files in `src/assets/data/`. The app works entirely offline after load.
- **Platform context on Add to List** — when adding a profile from the search page, the currently selected platform tab is stored alongside the profile so the panel can display the correct platform badge.
- **List persistence** — `localStorage` is used via Zustand persist. This is session-persistent; a real app would sync to a backend.
- **Drag-to-reorder** — `react-beautiful-dnd` is installed and the `reorderProfiles` store action is implemented, but the panel currently uses a static list. This can be wired up in a future iteration without store changes.
- **Profile JSON coverage** — only 6 out of 30 influencers have a detailed profile JSON. Clicking the others shows a "not found" state (correct and expected behaviour).
- **Dark mode only** — the redesign targets dark mode exclusively for a premium feel. Light mode is not implemented.

---

## Remaining Improvements (Future Work)

- Add drag-to-reorder in `SelectedListPanel` using the existing `react-beautiful-dnd` dependency
- Pagination or infinite scroll for larger datasets
- Unit + integration tests (Vitest + React Testing Library)
- Deploy to Vercel / Netlify and add live URL
- Export selected list as CSV
- Sort / filter influencers by follower count or engagement rate
- Animated number counters on the profile detail stats

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build (runs `tsc -b && vite build`) |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

---


