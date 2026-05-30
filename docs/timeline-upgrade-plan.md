# Timeline Upgrades — Implementation Plan

## Problem

The timeline works but has dead code, a flat undifferentiated feed, no
at-a-glance trip context, no mobile refresh affordance, abrupt image loads, and
no way for regular members (not just admins) to invite friends. Seven scoped
upgrades make the timeline richer and more "scrapbook-like," reusing existing
patterns and components.

## Requirements (from Q&A)

- **#1** Remove `handlePostClick` — no post-detail view (also removes the
  orphaned `IncomingFeatureModal` usage).
- **#2 = a** Trip Stats strip with accurate numbers via a **Supabase RPC** (new
  migration): memory count, member count, first/last memory date.
- **#3 = a** Image lazy-load: `loading="lazy"` + shimmer/skeleton background +
  fade-in on load. No extra requests / no LQIP.
- **#4** Pull-to-refresh on mobile — **custom, no new dependency**.
- **#5** "N new memories ↑" pill at the top that scrolls up and reveals new
  realtime posts.
- **#6 = a+c** User-facing share modal: **refactor admin `InviteTeamModal` into
  one shared `ShareTeamModal`** used by both admin and the timeline header.
- **#7** Day/section dividers ("scrapbook pages") grouping the feed by day.
- **3 = a** Overall: no new dependencies; reuse existing components/theme.

## Background (codebase findings)

- Posts are paginated 10/page (`useTimelinePosts` / `postsService.getPosts`) ->
  loaded posts != all posts, so stats (#2) must come from the DB. Migrations
  live in `supabase/migrations/` (`001_init.sql`, `002_reaction.sql`); the
  pattern is `create function ... security definer` + `grant execute ... to
anon` (e.g. `verify_team_password`, `get_storage_usage`).
- `PublicTeam` already carries `invite_code`, so the share modal needs no
  backend — it reuses the admin invite-URL/QR logic. Admin `InviteTeamModal`
  (QR via `react-qr-code`, download, `navigator.share`) is the component to
  generalize.
- `PostCard` `onClick` is a no-op; `TimelinePage.handlePostClick` is empty and
  `IncomingFeatureModal` is rendered but never opened -> dead code.
- Images go through `getPostImageUrl` -> `ImageFrame` `<img>`. `ImageFrame` is
  the single place to add lazy/fade behavior (also benefits home/memory cards).
- Realtime subscription handles INSERT/UPDATE only (prepends new posts) — fine
  for #5; no DELETE handling needed (no delete feature).
- `useTimelinePosts` already exposes `newPostsCount` / `resetNewPostsCount`; #5
  needs a UI pill + a refetch path for #4.

## Proposed Solution

Mostly additive, component-scoped changes plus one DB migration and one
refactor.

```mermaid
flowchart TD
    H[TimelineHeader] -->|Share btn| SM[ShareTeamModal shared]
    AdminDash -->|reuse| SM
    H --> Stats[TripStatsStrip -> useTeamStats -> get_team_stats RPC]
    TP[TimelinePage] --> Pull[PullToRefresh wrapper -> refresh()]
    TP --> Pill[NewMemoriesPill -> scroll top + reset]
    TP --> Feed[Feed grouped by day -> DaySection dividers]
    Feed --> PC[PostCard - onClick removed]
    PC --> IF[ImageFrame - lazy + fade-in]
```

## Tasks

### Task 1: Remove dead post-click code

- Delete `handlePostClick`, the `PostCard onClick` prop wiring, and the unused
  `IncomingFeatureModal` from `TimelinePage`; drop the now-unused `onClick` from
  `PostCardProps` and its usages in `PostCard.tsx`. Remove `showIncomingModal`
  state if nothing else uses it.
- Keep heart/double-tap handlers intact (separate from card `onClick`).
- Verify: `pnpm build` passes; timeline renders, hearts work.

### Task 2: Image lazy-load + fade-in in `ImageFrame`

- Add `loading="lazy"` and fade-in-on-load to the `<img>` in
  `src/components/ui/image-frame.tsx`, over a shimmer/skeleton background
  (`bg-sand/20 animate-pulse`).
- Local `loaded` state -> `onLoad` sets opacity 0->100 with transition; keep
  `aspect-square` container (no layout shift). No new requests, no API change.
- Verify: `pnpm build` passes; images fade in with placeholder while loading.

### Task 3: Day/section dividers ("scrapbook pages")

- Group the feed by calendar day; render a handwritten divider before each group
  (e.g. "Aug 12, 2026" + small doodle), reusing `Divider`.
- Small pure helper groups already-sorted (desc) `posts` by
  `dayjs(created_at).format('YYYY-MM-DD')` preserving order; render groups in
  `TimelinePage`. Keep optimistic/realtime prepend working (new post joins the
  top-most day group).
- Verify: `pnpm build` passes; multi-day data shows correct dividers; same-day
  posts under one header.

### Task 4: `get_team_stats` migration + `useTeamStats` + Trip Stats strip

- Add `supabase/migrations/003_team_stats.sql`: `security definer` function
  `get_team_stats(p_team_id uuid)` returning `{ memory_count, member_count
(distinct author_name), first_memory_at, last_memory_at }`, `grant execute
... to anon`. Add `publicTeamService.getTeamStats` (or small `stats.service`),
  a `useTeamStats(teamId)` hook, and a `TripStatsStrip` rendered in/below
  `TimelineHeader`.
- Mirror existing RPC style (`verify_team_password`). Strip shows e.g. "📸 N
  memories · 👥 M friends · Aug 12–18" with graceful loading/empty (hide range
  if no posts). No client-side counting.
- Verify: `pnpm build` passes. Migration must be applied to Supabase
  (`supabase db push` or dashboard) — cannot be applied from the agent without
  DB access/confirmation; strip shows real totals afterward.

### Task 5: Refactor admin `InviteTeamModal` -> shared `ShareTeamModal`

- Generalize the modal to accept a minimal prop shape (`name` + `invite_code`,
  present on both `Team` and `PublicTeam`); move to
  `src/components/share/share-team-modal.tsx`. Update admin dashboard to use it;
  add a Share button to `TimelineHeader` (beside Export/Quit) opening it for the
  current team.
- Keep QR/download/`navigator.share` logic; only narrow the prop type. No
  backend changes (invite_code already on `PublicTeam`).
- Verify: `pnpm build` passes; admin invite flow unchanged; timeline Share opens
  the same modal with correct invite URL/QR.

### Task 6: Pull-to-refresh (mobile, no dependency) + refresh in `useTimelinePosts`

- Add `refresh()` to `useTimelinePosts` (re-fetch page 0, reset
  pagination/new-count) and a lightweight custom pull-to-refresh wrapper around
  the feed that triggers it on mobile touch.
- Custom touch handlers active only when `window.scrollY === 0`; elastic/spinner
  indicator past a threshold; ignored on desktop. Reuse theme spinner styles.
- Verify: `pnpm build` passes; pulling down at top refreshes on mobile; desktop
  unaffected.

### Task 7: "N new memories ↑" pill + final wire-up

- Add `NewMemoriesPill` that appears at top of viewport when `newPostsCount >
0`, showing the count; tap -> smooth-scroll to top + `resetNewPostsCount()`.
  Compose cleanly with day-dividers and pull-to-refresh.
- Reuse badge/animation patterns from `ScrollToTopButton`; centered floating
  pill under the sticky header. Final pass to confirm all seven features coexist.
- Verify: full `pnpm build`; manual check — realtime new post shows pill, tap
  scrolls up and clears count, no awkward overlap on mobile.

## Verification

- Run `pnpm build` (tsc + vite) after each task; fix type errors.
- Apply `003_team_stats.sql` to Supabase, then verify the stats strip shows real
  numbers.
- Manually verify on mobile: pull-to-refresh, new-memories pill, day dividers,
  image fade-in, share modal.

## Out of Scope

- Post-detail/lightbox (per #1).
- Delete/edit of posts -> realtime DELETE handling stays out.
- Agent cannot apply the DB migration without DB access/confirmation.
