# Multi-language (i18n) Plan — EN + VI

Status: planned · Default language: **Vietnamese** · Scope: **user-facing UI only** (admin deferred)

## Decisions

- **Library:** `react-i18next` (+ `i18next`).
- **Languages:** Vietnamese (default) and English.
- **Detection:** none. Default to `vi`; persist manual choice in `localStorage` (`STORAGE_KEY.LANGUAGE`).
- **Switcher:** a global floating control on every screen, alongside a theme toggle.
- **Fonts (UI):** keep the existing `Pangolin` handwritten font for both languages (the VI Playwrite-VN swap was implemented then **rolled back** per request). Trade-off: Vietnamese diacritics may render imperfectly in `font-handwritten` spots.
- **Fonts (PDF):** the album export (`services/album-pdf.ts`) uses Indie Flower (no VI glyphs). Add a VI-capable handwritten TTF and select it when language is `vi`.
- **Dates:** localize via dayjs `vi` locale, switched in sync with i18n language.
- **Type safety:** `react-i18next.d.ts` augmentation typed from the EN resources.
- **Testing:** introduce Vitest + React Testing Library (none exists today). Include a reusable EN/VI key-parity test.

## Deferred (later)

- **Admin feature** — `views/admin/dashboard.tsx`, `components/admin/**` (largest chunk). Out of scope for this pass.

## Namespaces

`common`, `home`, `join`, `timeline`, `posts`, `share`, `export`, `misc`.
Locale files under `src/i18n/locales/{en,vi}/<namespace>.json`.

## Architecture

```
main.tsx → i18n/index.ts (lng = saved or 'vi', fallback 'vi')
  ├─ persists to localStorage on `languageChanged`
  ├─ sets <html data-lang> → CSS swaps VI handwritten font
  └─ switches dayjs locale
MainLayout → FloatingControls (lang + theme) → i18n.changeLanguage
```

## Tasks

- [x] **1. Bootstrap i18next + test tooling.** Install pinned `i18next`/`react-i18next`. Create `src/i18n/index.ts` (lng = saved or `vi`, `fallbackLng: 'vi'`, `supportedLngs: ['vi','en']`); on `languageChanged` persist via `storage`/`STORAGE_KEY.LANGUAGE`, set `<html data-lang>`, switch dayjs locale. Import in `main.tsx`. Add Vitest + RTL config and `test` script.
- [x] **2. Namespace structure, `common` strings, typed keys.** Create `locales/{en,vi}/common.json` + stubs; add `react-i18next.d.ts`; add reusable key-parity test helper.
- [x] **3. FloatingControls (language + theme), wired globally.** VI/EN toggle + theme toggle (reuse `useTheme`). Mounted globally in `App.tsx` (covers all routes incl. NotFound).
- [~] **4. VI handwritten font fallback (UI).** Implemented `[data-lang='vi'] { --font-handwritten/--hand: 'Playwrite VN' }` then **rolled back** per request — Pangolin retained for both languages.
- [x] **5. Localize Home.** `views/home.tsx`, `components/home/*` → `home`. (`layout-primitives`/`animation-utils` had no translatable text.)
- [x] **6. Localize Join.** `views/join/*`, `components/join/*`, `use-team-join` → `join` (incl. validation/errors, team-code modal).
- [x] **7. Localize Timeline.** `views/timeline/*`, `components/timeline/*` (TimelineHeader, QuitTeamDialog, TripStatsStrip, EmptyTimelineState, NewMemoriesPill, HeartTooltip, IncomingFeatureModal) → `timeline`. Dates via dayjs `vi`; plurals via i18next.
- [x] **8. Localize Posts / create-memory.** `components/posts/*`, `upload-fab-button` → `posts`.
- [x] **9. Localize Share modal.** `components/share/share-team-modal.tsx` → `share`.
- [x] **10. Localize Export view + PDF album.** `views/export/*`, `use-album-export`, `AlbumPreview` → `export`. In `album-pdf.ts`: localized labels + date; added `PatrickHand-Regular.ttf` (VI-capable) and select it under `vi` (else Indie Flower).
- [x] **11. Final sweep + audit.** `not-found`, `about`, `error-boundary` → `misc`; `ScrollToTopButton` + shared `dialog` Close → `common`. Grep audit clean (only deferred admin + generic avatar alt remain). Tests + build pass.

## Acceptance

- App defaults to Vietnamese; floating control switches EN/VI live across all user-facing screens and the PDF export.
- VI text renders correct diacritics (UI + PDF).
- EN/VI key parity holds for every namespace; `tsc` + build pass.
