# Plan: Ambient Seasonal Effects + Unified Settings Panel

## Problem Statement

Add a full-app ambient visual effect layer (snow, rain, falling leaves, sun rays,
cherry blossom, fireflies, bubbles, butterflies, balloons, confetti, fog) that
auto-selects by season, can be manually overridden or turned off, and is consolidated
— together with the existing language and theme/mood pickers — into a single Settings
panel opened by a floating gear button.

## Requirements (confirmed)

- **Auto + manual override**, persisted "selection" (`auto` | `off` | a specific effect);
  default `auto`, derived from the current month.
- Effect is **independent** of the theme mood (separate axis, freely mixable).
- **Full effect set** (11 effects) + `Auto` + `Off`, delivered in **two phases** (see below).
- **Subtle** default intensity; particle density scales to viewport area with a hard ceiling.
- Single **gear button → Settings modal** (bottom-sheet feel on mobile), replacing the
  current two-button `FloatingControls` cluster; hosts Language, Theme/Mood, and Effect.
  Modal chosen over a route (few controls, live preview, no deep-link need); panel body is a
  standalone component so it can be promoted to a `/settings` route later with no rework.
- **Hybrid rendering**, no new dependency: one `<canvas>` particle engine for moving-particle
  effects; non-blurring CSS layers for sun rays and fog.
- Respect `prefers-reduced-motion`; pause when tab hidden; effects are `pointer-events-none`,
  `aria-hidden`, screen-only (export/PDF unaffected).

## Coordination with `theme-moods-plan.md` (resolves the conflict)

The in-flight theme-moods work already shipped the registry (`themes.ts`), `ThemeProvider`,
tokens, and a **theme-cycle button inside `FloatingControls`** with a cycle test. This plan
**supersedes that switcher UX**: the theme control moves into the Settings panel as a direct
swatch picker, and the cycle button + `floating-controls.test.tsx` cycle assertions are
migrated into the new Settings tests.

- Keep everything from theme-moods **except** the FloatingControls cycle UI/test.
- The theme registry, `ThemeProvider`, `useTheme`/`useThemeMeta`, tokens, and no-flash script
  are reused unchanged.
- Sequencing: this plan must land **after** theme-moods' token/registry work is merged, or be
  merged with it. Do not build the cycle button if theme-moods is not yet merged — build the
  Settings picker directly.

## Phasing (scope control)

- **Phase 1 (Tasks 1–9):** engine + Settings + the 4 seasonal effects (Snow, Rain, Leaves,
  Sun) + `Auto` + `Off`. Fully shippable.
- **Phase 2 (Task 10):** the 6 "fun" effects (Cherry blossom, Fireflies, Bubbles, Butterflies,
  Balloons, Confetti) + Fog — proving the extensibility criterion in practice (data/draw-only).

## Background (from code investigation)

- Mirror the existing **theme-registry pattern** (`src/components/theme/*`) for an effects
  registry.
- `FloatingControls.tsx` (bottom-right, theme-cycle + language) is replaced by a gear button;
  its test is migrated.
- `FloatingHearts.tsx` is a DOM/CSS _burst_ reference; ambient effects are continuous/full-screen,
  so canvas is used instead.
- i18n `common` namespace with enforced **en/vi parity test**; `storage` helper + `STORAGE_KEY`
  in `utils/constants.ts` (add `EFFECT`); Radix `Modal`/`Dialog` handle Esc/overlay/back dismissal.
- `#app` is max-width 768px, `min-height:100svh`; tests run in jsdom where **canvas `getContext`
  is unavailable**, so engine logic is kept pure and canvas is mocked in layer tests.

## Key Design Decisions (from review)

- **Z-order map** (low → high): page background/motif → **ambient effect layer** → page content →
  floating UI (gear, FAB, ScrollToTop, sticky header) → modals/toasts. The ambient layer renders
  **behind content** so text stays readable and it never covers the Settings modal or toasts.
- **Fog** is a translucent animated gradient/mask. It **must not** use `backdrop-filter`/blur on
  the content (no sampling of underlying pixels) — atmosphere via opacity layers only.
- **Route scoping:** effects render only on user-facing experience routes (home, timeline).
  Suppressed on `/admin`, `/export`, and `/join` so confetti/snow never cover the admin dashboard
  or the export/album screen. The layer mounts where these routes share a layout, not above the
  whole router.
- **Emoji performance:** each emoji glyph is pre-rendered once to an offscreen sprite canvas and
  blitted with `drawImage` — never `fillText` per frame. Validate glyph rendering on iOS Safari /
  Android Chrome; fall back to a simple shape if a glyph is unavailable.
- **Particle count** derived from viewport area (with a hard ceiling), not a fixed number, so
  "subtle" holds on phone and desktop.
- **`auto` evaluation cadence:** resolved on mount and re-evaluated when the tab regains visibility
  (handles long-lived PWA sessions crossing midnight/season).
- **Reduced motion:** the layer renders nothing, and the Settings panel surfaces a visible note
  ("Reduced motion is on — effects are paused") so the choice isn't silently ignored.
- **Region-aware default:** since the app defaults to Vietnamese (largely tropical), the `auto`
  season map leans on gentle, broadly-pleasant effects rather than a literal snow-in-winter; final
  mapping is a documented data table in `effects.ts`, trivially adjustable.

## Architecture

```mermaid
flowchart TD
  R[effects.ts registry] --> U[effect-utils: resolve/isEffect/getSeasonalEffect]
  U --> ST0[Zustand effect.store: selection + persist]
  ST0 --> H1[useEffectSelection]
  ST0 --> H2[useResolvedEffect -> EffectId|null]
  H2 --> L[AmbientEffectLayer (behind content, route-scoped)]
  L -->|kind=particle| C[ParticleCanvas: rAF + sprite cache]
  C --> S[stepParticles (pure, tested)]
  L -->|kind=css| CSS[CSS sun/fog layers (no backdrop blur)]
  L -->|off / reduced-motion| N[nothing + Settings note]
  R --> SP[SettingsPanel: language + theme + effect]
  THEMES --> SP
  SP --> SM[SettingsModal] --> GB[SettingsButton gear]
  ST0 -.persist.-> STK[localStorage STORAGE_KEY.EFFECT]
```

- `EffectSelection = 'auto' | 'off' | EffectId`. `getSeasonalEffect(date)` maps month → seasonal
  EffectId; `resolveEffect(selection, date)` → `EffectId | null`.
- Registry entry: `{ id, labelKey, icon, kind: 'particle' | 'css', seasonal?: boolean, config }`.
  Adding an effect = one entry (+ a draw fn or CSS class) + two i18n keys, no logic edits.

## Task Breakdown

### Task 1: Effects registry + effect-utils (pure, unit-tested)

- Objective: single source of truth for effects + season mapping + selection resolution.
- Add `src/components/effects/effects.ts` (Phase-1 seasonal effects + Off/Auto modeling) and
  `effect-utils.ts`: `isEffectId`, `isEffectSelection`, `getEffectById`, `getSeasonalEffect(date)`,
  `resolveEffect(selection, date)`, `DEFAULT_SELECTION = 'auto'`.
- Tests: 12-month season boundaries; `off→null`, `auto→seasonal`, specific→itself; validation guards.
- Demo: unit tests prove mapping/resolution/validation with no component.

### Task 2: `STORAGE_KEY.EFFECT` + Zustand effect store + derived hook

- Objective: persisted selection in a Zustand store (the project's declared client-state tool;
  this is its first store) + a derived resolved-effect hook re-evaluated on visibility regain.
- Add `EFFECT` key. Add `src/store/effect.store.ts`: Zustand `create` + `persist` middleware
  holding only `selection` + `setSelection` (name = `STORAGE_KEY.EFFECT`, `partialize` the value,
  `merge` validates a corrupt stored value back to default); export `useEffectSelection`. Add
  `src/components/effects/use-resolved-effect.ts`: derives `EffectId | null` via `resolveEffect`
  from the stored selection + a `now` refreshed on `visibilitychange`. No provider; nothing to wrap
  in `App.tsx` (the store is module-global and readable outside React by the canvas engine).
- Tests: store default/persist/rehydrate/invalid-fallback; hook resolves seasonal for `auto`, null
  for `off`, manual unchanged, and re-resolves on simulated visibility regain.
- Demo: store defaults to a seasonal effect, persists manual choices, and survives reload.

### Task 3: Pure particle simulation + sprite cache (unit-tested)

- Objective: deterministic, testable engine core decoupled from canvas.
- Add `stepParticles(state, dt, bounds)` (seedable RNG; spawn/update/wrap/lifetime) and an
  offscreen emoji-sprite cache helper.
- Tests: position/wrap/lifetime; area-based count ceiling; sprite cache returns a cached canvas.
- Demo: simulation tests pass independent of any DOM canvas.

### Task 4: ParticleCanvas renderer + AmbientEffectLayer (Snow), behind content, route-scoped

- Objective: render the engine on canvas with all the runtime guards, integrated for one effect.
- Add `particle-canvas.tsx` (rAF, DPR sizing, ResizeObserver, `document.hidden` pause,
  `prefers-reduced-motion` guard, cleanup) drawing via sprite `drawImage`. Add `ambient-effect-layer.tsx`
  (z-below-content, `pointer-events-none`, `aria-hidden`); mount it in the **shared user-facing
  layout only** (not admin/export/join). Wire **Snow** only.
- Tests (mock `getContext` + `matchMedia`): renders `<canvas>` for a particle effect; nothing for
  `off`/reduced-motion; not mounted on excluded routes.
- Demo: full-app snow falls behind content; readable text; pauses when hidden/reduced-motion; absent
  on admin/export.

### Task 5: Remaining Phase-1 particle configs (Rain, Leaves) + Sun/Fog CSS layers

- Objective: complete the 4 seasonal effects across both render kinds.
- Add Rain + Leaves particle configs (Leaves via emoji sprite). Add non-blurring CSS layers for Sun
  rays and Fog in `style.css`; layer routes `kind:'css'` to a div instead of canvas.
- Tests: layer renders canvas vs CSS element per effect kind; nothing under reduced-motion.
- Demo: all four seasonal effects render distinctly; fog does not blur content.

### Task 6: Settings panel (standalone) — language + theme + effect + i18n

- Objective: one panel driving all three axes; route-promotable.
- Add `src/components/settings/settings-panel.tsx`: Language (vi/en), Theme/Mood (swatch grid from
  `THEMES`, replacing the cycle), Effect (Auto + Off + Phase-1 effects; active highlighted; Auto shows
  resolved effect; reduced-motion note when applicable). Add en+vi `common` keys (parity-enforced).
- Tests: selecting language/theme/effect updates i18n/storage/provider; parity passes.
- Demo: standalone panel drives all three controls.

### Task 7: Gear button + modal; replace FloatingControls; migrate tests; end-to-end wiring

- Objective: ship the consolidated control surface.
- Add `settings-modal.tsx` (hosts panel in `Modal`) + `settings-button.tsx` (floating gear). Replace
  `<FloatingControls/>` with `<SettingsButton/>` in `App.tsx`; remove `floating-controls.tsx`; migrate
  language/theme assertions into new settings tests; remove the old cycle test.
- Tests: gear opens modal; Esc/overlay/back close; language/theme/effect changes reflect in the app +
  ambient layer; selection persists across reload.
- Demo: tap gear → change everything live → persists.

### Task 8: First-run discoverability + accessibility polish

- Objective: keep language switching discoverable after consolidation; finalize a11y.
- One-time subtle pulse/tooltip on the gear (dismiss persisted in storage). Confirm focus trap (Radix),
  `aria-hidden` on the layer, keyboard access to all controls.
- Tests: tooltip shows once then is suppressed; modal focus/keyboard works.
- Demo: first visit hints at settings; fully keyboard/SR accessible.

### Task 9: Phase-1 acceptance + verification

- Objective: prove Phase 1 is complete, performant, and correct.
- `pnpm build` + `pnpm lint` + new/updated vitest suites; manual mobile check (perf, readability,
  reduced-motion, tab-hidden pause, battery sanity); confirm export/PDF and excluded routes untouched.
- Demo: 4 effects + Auto + Off, persistent, season-aware, accessible, route-scoped.

### Task 10 (Phase 2): The 6 fun effects + Fog tuning

- Objective: extend via data/draw only, validating the acceptance criterion.
- Add Cherry blossom, Fireflies, Bubbles, Butterflies, Balloons, Confetti as registry entries
  (+ sprite/draw config); keep confetti/balloons gentle to avoid "relentless" ambience (optionally
  also expose confetti as a one-shot burst on a celebratory moment — out of scope here, noted).
- Tests: each renders; parity for new labels; no provider/layer/settings logic edits required.
- Demo: all 11 effects selectable; adding the 12th is one registry entry + one draw fn/CSS class +
  two i18n keys.

## Phase 1 — Completed (Tasks 1–9)

Status: **done and verified.** Snow / Rain / Leaves / Sun + Auto + Off ship behind the
Settings gear, season-aware, persisted, route-scoped, and accessible.

Verification evidence:

- `pnpm test` → 97 passing across 19 files (effect-utils, store, resolved-effect, engine
  rng/particle-system/sprite-cache, ambient-effect-layer, settings-panel, settings-button, i18n parity).
- `pnpm tsc --noEmit` clean; `pnpm lint` → 0 errors (only pre-existing convention warnings in files
  not touched here); `pnpm build` succeeds.
- Route scoping confirmed in `main-layout.tsx`: `EFFECT_ROUTES = { '/', '/timeline' }` — admin,
  export, join and about render no overlay. Album PDF export is unaffected (screen-only DOM).
- Reduced-motion + tab-hidden handling and `aria-hidden`/`pointer-events-none` overlay verified by tests.

Extensibility (acceptance criterion) — adding a new effect is data/draw + i18n only:

- **Particle effect:** 1 entry in `EFFECTS` (`effects.ts`) + 1 entry in `PARTICLE_CONFIGS`
  (`effect-configs.ts`: motion config + a `circle`/`line`/`glyph` render spec) + `effect.<id>`
  label in en/vi `common.json`.
- **CSS effect:** 1 `EFFECTS` entry (`kind: 'css'`) + 1 `CSS_EFFECT_CLASSES` entry + 1 `style.css`
  block + en/vi label.
- The Settings picker auto-lists it (it maps over `EFFECTS`); no provider/store/layer/canvas/settings
  logic edits. Only if it should join the **auto** rotation does `getSeasonalEffect` need a tweak
  (manual-only effects need none).

> Implementation note (deviation from "behind content"): the overlay renders **in front of content
> but below all interactive chrome** (`z-20`, under the `z-50` gear/modals/toasts), `pointer-events-none`
> with subtle opacity. True "behind content" is unreachable because `#app` paints an opaque themed
> surface that hides any negative-z layer. Reversible if desired by moving the surface+motif to `body`.

## Notes

- Export (album PDF) and excluded routes intentionally untouched; ambient layer is screen-only.
- Auto rotation uses the 4 seasonal effects; the other 7 are manual-only by design.
- No DB/migration concerns: frontend + one new localStorage key; rollback is a revert.

## Optional follow-ups (out of scope)

- Promote `SettingsPanel` to a `/settings` route.
- Per-effect intensity slider; "Surprise me" random effect.
- Event-driven confetti burst on post/trip-close.
- Southern-hemisphere season inversion.
