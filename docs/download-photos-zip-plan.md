# Download All Photos as ZIP — Implementation Plan

## Goal

Add a feature that bundles **all** of a team's memory images into a single ZIP
and downloads it.

Confirmed choices:

1. **All original full-resolution images** via `storageService.getPublicUrl()`
   (`.webp`). Not the optimized transform.
2. **Entry point:** a new button on the existing **`/export` page** (always
   visible, independent of the album selection state).
3. **Images only** — no captions/metadata in the archive.

> No automated tests and **no build-run step** — the user verifies manually
> after the job is done.

## Codebase Context

- **jszip** is installed (pinned `3.10.1`). Ships its own TypeScript types
  (no `@types` needed).
- `src/services/export.service.ts`:
  - `exportService.fetchExportablePosts(teamId, page=0, pageSize=20)` —
    paginated, oldest-first (`.order('created_at', { ascending: true })`,
    `.range`).
  - `fetchPostThumbnails(posts, { onProgress, signal })` — sequential fetch (one
    blob in memory at a time), `{loaded,total}` progress, `AbortSignal`, failed
    images skipped/logged. **Mirror this loop/abort/progress shape** for the ZIP
    fetcher but use `getPublicUrl` (full-res) instead of `getOptimizedUrl`.
- `src/services/storage.service.ts`:
  - `getPublicUrl(imagePath)` → original full-res `.webp`.
  - `getOptimizedUrl(path, width, quality)` → transformed.
- `src/services/album-pdf.ts`:
  - `downloadAlbumPdf(blob, team)` pattern = `URL.createObjectURL` → anchor with
    `download` attr → append → click → remove → `URL.revokeObjectURL`.
  - `albumFilename(team)` slug = `team.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'memory'`.
    Reuse this slug logic for the zip filename.
- `src/services/posts.service.ts`: `Post` =
  `{ id, team_id, author_name, caption: string|null, image_path: string|null, created_at, isFreshUpload? }`.
  Text-only posts have `image_path === null` and **must be skipped** in the ZIP.
- `src/services/public-team.service.ts`: `PublicTeam` =
  `{ id, name, invite_code, is_locked, has_password, close_at?, post_limit? }`.
- `src/views/export/index.tsx`: `ExportPage`. Header has a back `Button`
  (`ArrowLeft`) + title. Uses `useCurrentTeam()` → `{ team, loading }`,
  `useToast()` → `{ toast }`, `useTranslation('export')` → `{ t }`.
  `PAGE_SIZE=20`. `handleCreateAlbum` shows the existing progress/toast pattern:
  `setGenerating`, `setProgress({loaded,total})`, `AbortController`, try/catch
  with `toast({ title, description })`.
- i18n: `src/i18n/locales/en/export.json` and `.../vi/export.json`.
  `src/i18n/parity.test.ts` enforces **identical key sets** across en/vi — every
  new key MUST be added to **both** files.
- `src/utils/constants.ts`: `EXPORT_MAX_SELECTION=40`,
  `EXPORT_WARN_SELECTION=30`, `URL_PATH.{TIMELINE,EXPORT}`.
- Package manager: **pnpm**. Build `pnpm build` (tsc && vite build), tests
  `pnpm test` (vitest) — **do NOT run** per user instruction.

## Tradeoff (accepted)

Full-res originals are held in memory by JSZip until generation; **no selection
cap**. Use `compression: 'STORE'` in `generateAsync` since `.webp` is already
compressed. Add a **soft toast warning** past a threshold but still download all.

## Tasks

### Task 1 — Add jszip dependency ✅ (done)

`jszip@3.10.1` installed by the user. No `@types` package required.

### Task 2 — `fetchAllPosts(teamId)` in `src/services/zip.service.ts`

Loop `exportService.fetchExportablePosts(teamId, page, 20)` from page 0,
accumulate results, stop when a returned batch length `< pageSize (20)`. Return
all posts (oldest-first order preserved). Import `exportService` and `Post`.

### Task 3 — `generateImagesZip(posts, { onProgress?, signal? })`

- Filter posts where `image_path` is truthy (skip text-only).
- For each, sequentially: `url = storageService.getPublicUrl(post.image_path)`;
  `const res = await fetch(url, { signal })`; `const blob = await res.blob()`;
  add via `zip.file(filename, blob)`.
- Filename (deterministic + unique): `String(i+1).padStart(3,'0')` + `'_'` +
  `dayjs(post.created_at).format('YYYY-MM-DD')` + `'_'` + sanitized
  `author_name` (`replace(/[^a-z0-9]/gi, '_')`) + `'.webp'`.
- Report `onProgress?.({ loaded, total })` after each (`total` = image-post
  count).
- Honor `signal`: break the loop if `signal?.aborted`.
- Wrap each fetch in try/catch — on failure (and not aborted) `console.error`
  and continue (skip).
- Return `await zip.generateAsync({ type: 'blob', compression: 'STORE' })`.
- Import `JSZip from 'jszip'`, `dayjs`, `storageService`, `Post`.

### Task 4 — `downloadImagesZip(blob, team)`

Mirror `downloadAlbumPdf`: slug =
`team.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'memory'`; filename =
`` `${slug}_photos.zip` ``; `URL.createObjectURL` → anchor (`href` + `download`)
→ append → click → remove → `URL.revokeObjectURL`. Import `PublicTeam`.

### Task 5 — i18n strings (en + vi `export.json`, key parity)

Add a `zip` object, e.g.:

- `downloadPhotos` — "Download Photos" / VI
- `zipping` — "Zipping {{loaded}}/{{total}}…" / VI
- `noPhotos` — "No photos to download" / VI
- `failedTitle` — "Could not create the ZIP" / VI
- `failedDesc` — "Please try again." / VI
- `bigTitle` / `bigDesc` — soft warning for large archives / VI

Identical key structure in both files so `parity.test.ts` stays green.

### Task 6 — Wire the button into `src/views/export/index.tsx`

- Header button (top-right), `Download`/`Archive` lucide icon. Always visible,
  independent of album selection/count.
- Local state: `zipping` (boolean), `zipProgress` (`{loaded,total}|null`).
- `handleDownloadZip`: guard `if (!team || zipping)`; new `AbortController`;
  `setZipping(true)`; try `{ const all = await fetchAllPosts(team.id); const imagePosts = all.filter(p => p.image_path); if (imagePosts.length === 0) { toast({ title: t('zip.noPhotos') }); return; } // optional big-warning past threshold; const blob = await generateImagesZip(all, { signal, onProgress: setZipProgress }); downloadImagesZip(blob, team); }` catch `{ console.error; toast({ title: t('zip.failedTitle'), description: t('zip.failedDesc') }); }` finally `{ setZipping(false); setZipProgress(null); }`.
- Disable the button + show `t('zip.zipping', { loaded, total })` while zipping.
- Coexist with the existing `handleCreateAlbum` flow without interfering.
- Import `fetchAllPosts, generateImagesZip, downloadImagesZip` from
  `@/services/zip.service`.

## Integration Note

Services (Tasks 2–4) and strings (Task 5) are all consumed by the button
(Task 6), which depends on jszip (Task 1). No orphaned code.

## Verification

None automated. Do **not** run `pnpm build`/`pnpm test` and do **not** add test
files — the user verifies manually after completion.

## Revision — Trigger moved to the timeline header menu + non-closable modal

The entry point changed from a button on `/export` to a menu item in the
timeline header, and progress is now shown in a modal the user cannot close.

- **`src/hooks/use-photo-zip.ts`** — `usePhotoZip()` encapsulates the flow and
  exposes `{ active, phase, progress, start(team) }`. Phases:
  `idle → preparing → zipping → packaging`. Shows the big-archive warning toast
  past `EXPORT_WARN_SELECTION`, the no-photos toast, and the failure toast.
- **`src/components/timeline/ZipProgressModal.tsx`** — Radix dialog rendered
  with no close button; `onEscapeKeyDown`, `onPointerDownOutside`, and
  `onInteractOutside` are all `preventDefault`-ed so it cannot be dismissed. It
  closes only when the parent flips `open` to `false` (flow done/failed). Shows
  a spinner, the phase status text, a progress bar during `zipping`, and a
  "please keep this open" note.
- **`src/components/timeline/TimelineHeader.tsx`** — new "Download Photos" menu
  item (lucide `Images` icon) between "Export Memories" and "Quit Team"; calls
  `photoZip.start(team)`. Renders `<ZipProgressModal>` bound to the hook state.
- **i18n** — the `zip` strings now live in the **`timeline`** namespace (both
  `en` and `vi`), plus a top-level `downloadPhotos` label. Added modal keys:
  `zip.title`, `zip.preparing`, `zip.packaging`, `zip.doNotClose`. The earlier
  `zip` block was removed from `export.json`.
- **`src/views/export/index.tsx`** — fully reverted to its pre-feature state.
- `zip.service.ts` (`fetchAllPosts`, `generateImagesZip`, `downloadImagesZip`)
  is unchanged and now consumed by the hook.
