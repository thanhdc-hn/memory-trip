---
sessionId: session-260710-225231-1u4p
---

# Requirements

### Overview & Goals

Reintroduce a dark Night mood and surface green-toned ambient effects (e.g., green leaf fall) in the existing Settings panel — consistent with the codebase’s theme/effects registries, tokens, and PWA theming. Maintain accessibility and legibility while keeping the additions data-driven (registry/CSS), with no core application-logic rewrites.

### Scope

- In Scope
  - Add `night` to the theme registry and implement a legible dark palette.
  - Add one explicitly green ambient effect variant (Spring Leaves) and ensure Fireflies read clearly over dark backgrounds.
  - Expose Night and the new green effects in the Settings panel and i18n.
  - Ensure correct `color-scheme`, meta `theme-color`, and Tailwind token theming with `[data-theme]`.
  - Update/extend tests where affected (theme/provider, settings, effects registries, and utils).
- Out of Scope
  - Changing auto-seasonal mapping for effects.
  - Global rewrite of existing palettes or non-green effects.
  - Theming all decorative emoji (unchanged beyond current scope).

### User Stories

- As a user, I can select a Night mood that makes the UI comfortably dark with good contrast.
- As a user, I can pick green-themed effects (e.g., green leaf fall) to pair with any mood.
- As a user, my choices persist across sessions, and the UI shows no flash of wrong theme on reload.

### Functional Requirements

- Night mood is selectable in Settings → Theme and persisted via `STORAGE_KEY.THEME`.
- Night mood sets `[data-theme='night']` and flips `color-scheme` to dark, updates PWA meta `theme-color`.
- Effects picker lists new green effect(s) drawn by the existing engine.
- Reduced-motion, route scoping, persistence, and tests continue to pass.

### Non-Functional Requirements

- Accessibility: minimum contrast AA on primary text vs surface; ensure interactive elements remain legible.
- Performance: no additional dependencies; particle density remains within existing ceilings.

# Technical Design

### Current Implementation

- Themes
  - Registry: `src/components/theme/themes.ts` (Summer, Sunset, Ocean, Forest).
  - Provider: `src/components/theme/theme-provider.tsx` applies `data-theme` and syncs meta `theme-color`.
  - Tokens/CSS: `src/style.css` sets runtime tokens, `@theme inline` bridge, and `[data-theme='…']` blocks.
  - Pre-mount script: `index.html` sets `data-theme` before React mounts.
  - Settings panel consumes `THEMES` for a swatch grid.
- Effects
  - Registry: `src/components/effects/effects.ts` (Phase 1+2 entries including `leaves`, `fireflies`).
  - Particle specs: `src/components/effects/effect-configs.ts` (leaves uses 🍂/🍁, fireflies uses yellow/green dots).
  - Engine/layer: `ambient-effect-layer.tsx`, `particle-canvas.tsx`, route scoping intact; settings drives selection via store.

### Key Decisions

- Dark palette with explicit `[data-theme='night']` block in `src/style.css` that meets AA contrast and sets `color-scheme: dark`. Keep light themes unchanged.
- Registry-first: add `night` only to `THEMES` and CSS; ThemeProvider/tests/settings infer it with no logic changes.
- Green effects via the existing registry/engine:
  - Add `spring-leaves` (glyphs: `🍃`, `🌿`) to `EFFECTS` + `PARTICLE_CONFIGS`.
  - Keep `fireflies` as-is but verify visibility on dark; slightly widen brightness range if needed (data-only tweak).
- No coupling between theme/effect selections; Settings simply lists both axes.

### Proposed Changes

- Theme Night mood (data + CSS only)
  - `src/components/theme/themes.ts`: append `{ id: 'night', labelKey: 'theme.night', swatch: '#0b1220', accentEmoji: '🌙' }` at the end (or position per desired order).
  - `src/style.css`:
    - Add `[data-theme='night']` block: choose tokens (example):
      - `--surface: #0b1220`, `--card: #111827`, `--text: #e5e7eb`, `--text-h: #ffffff`;
      - `--primary: #22c55e` (emerald), `--secondary: #84cc16` (lime), `--accent: #06b6d4` (cyan);
      - `--border: #1f2937`, `--sand: #1b283b`, `--heart: #f43f5e` (unchanged).
    - Flip `color-scheme` to dark within the Night block: `color-scheme: dark only;` (keep default `:root { color-scheme: light only; }`).
    - Ensure `body`/`--bg-pattern` remain visible over dark surface (adjust dot color/size for subtlety).
- PWA theme-color & pre-mount
  - `ThemeProvider` already reads `--surface` and updates meta `theme-color`; no code changes needed.
  - `index.html` pre-mount script remains registry-agnostic; no change needed.
- Settings UI & i18n
  - `src/components/settings/settings-panel.tsx`: Night appears automatically from `THEMES`. No logic change.
  - Add i18n strings in `src/i18n/locales/{en,vi}/common.json`: `theme.night`, `effect.springLeaves` (and labels below).
- Green effects
  - `src/components/effects/effects.ts`: add a new entry `{ id: 'spring-leaves', labelKey: 'effect.springLeaves', icon: '🍃', kind: 'particle', seasonal: false }`.
  - `src/components/effects/effect-configs.ts`: add `spring-leaves` spec mirroring `leaves` but `glyphs: ['🍃','🌿']`, and possibly slightly lower density for dark.
  - Optionally tune `fireflies` colors array to bias greener hues for Night legibility (e.g., `['#ccff00', '#a8ff00', '#eaff66']`). Leave id the same.
- Tests
  - Extend `theme-provider.test.tsx` to validate persistence/initialization with `night`.
  - Extend `settings-panel.test.tsx` expectations to include the Night label in the theme list.
  - Extend `effect-utils.test.ts` to validate registry lookups for `spring-leaves`.
  - If `fireflies` palette is changed, update any palette snapshot tests (if present).

### Data Models / Contracts

- Theme registry: `ThemeId` extends with `'night'`.
- Effect registry: `EffectId` extends with `'spring-leaves'`.
- No API changes; all additions are data-only in registry + CSS + i18n.

### Components Affected

- `src/components/theme/themes.ts` (add Night)
- `src/style.css` (add Night tokens)
- `src/components/settings/settings-panel.tsx` (implicitly reflects new theme/effects)
- `src/components/effects/effects.ts` (add Spring Leaves)
- `src/components/effects/effect-configs.ts` (add Spring Leaves render config)
- i18n `src/i18n/locales/{en,vi}/common.json` (new keys)

### Risks

- Dark palette contrast/legibility: mitigate via WCAG AA checks and UI spot checks.
- Emoji rendering variance across platforms (🍃/🌿): verify on iOS/Android; fallback acceptable due to decorative nature.
- Over-bright fireflies on dark: keep opacity modest; test for distraction.

# Testing

### Validation Approach

- Automated: extend existing vitest suites for registry presence, provider persistence, settings rendering, and effect config resolution.
- Manual: visual regression spot checks on mobile/desktop in Night mood; verify PWA chrome color, readability, and ambient effects visibility.

### Key Scenarios

- Theme
  - Selecting Night sets `data-theme='night'`, updates meta `theme-color`, persists, and restores on reload without flash.
  - Tokens drive Tailwind utilities correctly in Night (e.g., `bg-surface`, `text-text/60`, `border-border`).
- Effects
  - Spring Leaves renders green glyphs; appears in Settings; persists; respects reduced motion and route scoping.
  - Fireflies visible and not overwhelming over dark surfaces.

### Edge Cases

- Corrupt stored theme id falls back to default (already covered by `ThemeProvider` tests; add Night case).
- Corrupt/unknown effect id or selection recovered by existing store/utils (ensure new ids don’t break).
- High-DPR devices: ensure particles remain performant in Night.

# Progress Tracking

- [ ] **Step 1: Add Night theme to registry and CSS tokens** (Current)
- [ ] Step 2: Introduce green effects (Spring Leaves) and verify Fireflies on dark
- [ ] Step 3: Wire into Settings and extend tests
- [ ] Step 4: Update documentation files

# Delivery Steps

### Step 1: Add Night theme to registry and CSS tokens

Night mood exists in registry and `[data-theme='night']` overrides produce a legible dark UI.

- Update `src/components/theme/themes.ts`: add `night` with swatch and accent emoji.
- Add `[data-theme='night']` block in `src/style.css` with dark `--surface`, `--card`, `--text`, `--text-h`, `--primary`, `--secondary`, `--accent`, `--border`, `--sand`, `--heart`.
- Set `color-scheme: dark only;` within the Night block; keep default `:root { color-scheme: light only; }`.
- Verify Tailwind utilities retint under Night (e.g., opacity-modified text and borders).
- Add i18n keys `theme.night` (en/vi).

### Step 2: Introduce green effects (Spring Leaves) and verify Fireflies on dark

Green effects are available and render correctly — Spring Leaves added; Fireflies visible over Night.

- Append `spring-leaves` to `src/components/effects/effects.ts` with icon `🍃`, `kind: 'particle'`, `seasonal: false`.
- Add `spring-leaves` spec to `src/components/effects/effect-configs.ts` using glyphs `['🍃', '🌿']`; tune density/opacity for subtlety.
- Optionally bias `fireflies` colors towards greener hues if readability over dark needs improvement (data-only change).
- Add i18n keys `effect.springLeaves` (en/vi).

### Step 3: Wire into Settings and extend tests

Settings lists Night and Spring Leaves; persistence and rendering verified by tests.

- Ensure `src/components/settings/settings-panel.tsx` reflects Night and Spring Leaves via registries (no logic change expected).
- Extend `src/components/theme/theme-provider.test.tsx` to include Night initialization/persistence.
- Extend `src/components/settings/settings-panel.test.tsx` to assert Night and Spring Leaves appear and are selectable.
- Extend `src/components/effects/effect-utils.test.ts` and related tests for the new effect id.
- Run `pnpm test`, `pnpm build`, and perform manual visual checks in Night.

### Step 4: Update docs/theme-moods-plan.md and docs/ambient-effects-plan.md (no new files)

The existing documentation files are updated in-place — no new docs are created.

- Edit `docs/theme-moods-plan.md` to reintroduce an optional dark "Night" mood with accessibility notes and `color-scheme: dark` + PWA `theme-color` handling.
- Edit `docs/ambient-effects-plan.md` to add the green-themed `spring-leaves` effect and visibility considerations for `fireflies` over dark surfaces.
- Clarify in both docs that the acceptance criterion remains registry + CSS + i18n only (no application-logic edits) and that Settings picks up entries automatically.
- Reiterate that existing light moods remain unchanged; Night is additive and can be disabled later without breaking the registry pattern.
