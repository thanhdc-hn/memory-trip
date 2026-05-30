# Memory Album Export — Implementation Plan

## Problem

Current export (`src/services/export.service.ts`) produces an HTML file with
external full-res image links — heavy, not a shareable artifact. Replace with a
beautiful, self-contained, scrapbook-style **PDF** that shares via the OS share
sheet (no browser needed) and is mobile-crash-safe.

## UX Flow (REVISED)

- Tapping **Export** in the timeline header navigates to a dedicated
  **`/export` page** (not an inline dialog / not inline timeline selection).
- The export page fetches the team's posts and renders a **2-column grid** of
  images **without the polaroid frame** (plain rounded thumbnails).
- The user **taps tiles to select/deselect** them (selection indicator overlay
  - live count). **Text-only posts are also shown**, as a framed handwritten
    note tile in the same selectable grid slot.
- A sticky bottom bar shows the count and a **"Create Album"** button that
  generates and shares the PDF. A back action returns to the timeline.

## Key Decisions

- **Output:** Multi-page PDF via `jsPDF`, **4 memories per page** (2×2 grid),
  ~10 pages at the 40 cap.
- **Captions:** Embed **Indie Flower** TTF (base64) from day one for the
  handwritten scrapbook feel.
- **Selection ceiling:** **40 max**, soft warning past 30.
- **Image transforms:** Supabase **width 500 / quality 90** via existing
  `storageService.getOptimizedUrl`, fetched **sequentially** → base64.
  ~150KB/photo; 40 photos ≈ 4–6MB PDF (mobile-safe).
- **Avoid** `html2canvas` (heavy, crash-prone). Lay out pages with jsPDF
  primitives directly.
- **Upload compression: UNCHANGED.** `src/features/posts/utils/compressImage.ts`
  keeps running on every upload (webp, maxSizeMB 2, maxWidthOrHeight 1920).
  Storage path stays `.webp`. Do NOT add a compression gate.

## PDF Layout Defaults

- A4 portrait, 2×2 grid; each cell = white polaroid frame, photo on top,
  handwritten caption + `@author · date` below.
- Subtle ±2° rotation per polaroid with cell padding (no overlap in grid).
- Cover page: team name + "N memories" + export date in Indie Flower.
- Long captions truncated to fit the cell.
- Note: the polaroid frame applies to the **PDF output**. The on-screen
  **export page grid is frameless** per the revised UX.

## Mobile Safety

- Sequential fetch (one image in memory at a time).
- 40-photo hard cap.
- Blob revoked after share.
- Work chunked to avoid UI freeze.
- AbortController on cancel.

## Existing Code Context

- `src/services/export.service.ts` — current HTML export; extended for PDF. Has
  `fetchAllPosts(teamId)` — source for the export-page grid.
- `src/services/storage.service.ts` — `getOptimizedUrl(imagePath, width=500, quality=90)`; reuse for transforms.
- `src/services/posts.service.ts` — `Post` type (`id, team_id, author_name, caption, image_path, created_at`).
- `src/components/timeline/ExportDialog.tsx` — replace with a navigation button to `/export`.
- `src/views/timeline/index.tsx` / `TimelineHeader.tsx` — Export button lives here.
- `src/routes/index.tsx` — add the `/export` route.
- `src/hooks/use-current-team.ts` — team context on the export page.
- `src/features/posts/utils/getPostImageUrl.ts` — example transform usage.
- `src/services/public-team.service.ts` — `PublicTeam` type used by export.
- UI primitives: `src/components/ui/button.tsx`, toast via `src/hooks/use-toast.ts`.

## Tasks

1. **Selection state** — `src/hooks/use-album-export.ts`: selection `Set<string>`,
   toggle, max 40, soft warning past 30, clear/reset. (No selection-mode flag
   needed now — the export page is itself the selection surface.)
2. **Export page + frameless grid** — add `/export` route and `ExportPage`:
   paginated infinite-scroll fetch (`fetchExportablePosts`, 20/page), render
   2-column frameless grid — image posts as rounded thumbnails, text-only posts
   as a framed handwritten note tile — tap to select/deselect with overlay
   indicator + live count, back action, sticky bottom "Create Album" bar.
3. **Export entry point** — change the timeline Export button (in `TimelineHeader`
   / `ExportDialog`) to navigate to `/export` instead of opening a dialog.
4. **Paginated grid fetch + sequential thumbnail fetcher** — in
   `export.service.ts`:
   - `fetchExportablePosts(teamId, page, pageSize=20)` — paginated (`.range`),
     oldest-first, **includes image AND text-only posts**; used by the export
     page grid (infinite scroll) so we never load every post at once.
   - `fetchPostThumbnails(posts, { onProgress, signal })` — sequential loop over
     image-bearing posts: Supabase URL @500/90 → fetch blob → base64, one image
     in memory at a time, progress callback, AbortController; failed images
     skipped (logged). Returns `Map<postId, dataUrl>`. Text-only posts have no
     entry and are rendered as note cells by the PDF generator.
5. **PDF generator (2×2 grid + embedded font)** — add `jspdf` (pinned).
   `generateAlbumPDF(team, posts, imageMap)` via jsPDF. Register Indie Flower
   (`addFileToVFS` + `addFont`). Cover page (team name, N memories, export date);
   then 4 polaroid cells/page (paper-color bg rect, white frame, fitted image
   with ±2° rotation, handwritten caption + `@author · date`, caption truncation).
6. **Share the PDF** — `navigator.share({ files: [pdfFile] })` on mobile (OS
   share sheet); blob download fallback on desktop; success toast.
7. **Wire together + polish** — error handling (failed image → placeholder
   cell), bottom-bar loading/progress states, disable interaction during
   generation, empty-selection guard, locked-team still exportable, return to
   timeline after success.

## Dependency

- Add `jspdf` (pinned version).

## Verification

- Run `pnpm build` (tsc + vite build) after changes; fix type errors.
- Manually verify generated PDF opens and renders on mobile + desktop.

## Future (out of scope)

- Layout themes (polaroid grid / vertical / photo strip).
- Server-side high-res PDF (Netlify + headless renderer).
- Shareable hosted album link (upload PDF to Supabase Storage).
