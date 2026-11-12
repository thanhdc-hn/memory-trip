# Themes and Effects System

This document explains how the visual identity and ambient atmosphere of Memory Trip are implemented.

## 1. Theme System

The theme system uses a combination of **Tailwind CSS (v4)**, **CSS Variables (Design Tokens)**, and **React Context**.

### How it works

1.  **Metadata:** All themes are defined in `src/components/theme/themes.ts`. Each theme has an `id`, `name`, and `color` (swatch).
2.  **CSS Tokens:** `src/style.css` contains the design tokens. We use the `@theme inline` directive which allows variables like `--primary` to be redefined per theme.
3.  **Application:** The `ThemeProvider` (`src/components/theme/theme-provider.tsx`) sets the `data-theme` attribute on the `<html>` element.
4.  **Cascading:** When `data-theme="sunset"` is set, the CSS block `[data-theme='sunset']` in `style.css` overrides the default CSS variables, instantly updating the entire UI.

### Adding a New Theme

1.  **Define Metadata:** Add a new entry to the `THEMES` array in `src/components/theme/themes.ts`.
    ```typescript
    { id: 'neon', labelKey: 'theme.neon', color: '#ff00ff', accent: '⚡' }
    ```
2.  **Add CSS Variables:** In `src/style.css`, add a new `[data-theme='neon']` block and override the required tokens (primary, secondary, surface, etc.).
3.  **Add the Polaroid Frame:** In the `Polaroid frames` section of `src/style.css`, add another `[data-theme='neon']` block with the `--frame-*` tokens (see below). `theme-frames.test.ts` fails if a theme in the registry has no frame or its caption text is not readable on its paper.
4.  **Localize Label:** Add the translation for `theme.neon` in the localization files (if applicable).

### Themed Polaroid Frames

Every memory photo (and the polaroid-style cards on the home and join screens) is wrapped in a `.polaroid-frame` that follows the active mood.

| Token                  | Purpose                                                       |
| :--------------------- | :------------------------------------------------------------ |
| `--frame-paper`        | Paper colour of the frame (must be a `#rrggbb` hex)           |
| `--frame-ink`          | Caption / text colour on the paper (AA contrast required)     |
| `--frame-ink-muted`    | Secondary text colour on the paper (AA contrast required)     |
| `--frame-edge`         | Hairline border colour                                        |
| `--frame-shadow`       | Box-shadow, e.g. a coloured glow for dark moods               |
| `--frame-tape`         | Washi-tape colour (also used by `Tape` on the join card)      |
| `--frame-texture`      | Optional margin motif (dots, vignette, sheen); default `none` |
| `--frame-texture-size` | Tile size of the motif; default `auto`                        |
| `--frame-radius`       | Corner radius; default `4px`                                  |

How it fits together:

- `.polaroid-frame` (in `src/style.css`) re-points `--paper`, `--paper-text` and `--paper-text-muted` at the frame tokens, so descendants such as captions, inputs and labels using `bg-paper` / `text-paper-text` automatically follow the mood, including dark ones. The class is unlayered, so it wins over Tailwind utilities on the same element.
- `data-deco` selects the corner decoration: `tape` (washi tape) or `sticker` (the mood's `accentEmoji`, published as `--theme-emoji` by `applyTheme`). `ImageFrame` takes a `decoration` prop; `getFrameDecoration(post.id)` in `src/utils/polaroid.ts` alternates the two deterministically so the timeline looks hand-arranged.
- Summer is the default and lives in the first `:root` block; every other mood overrides the tokens in its own block.

#### PDF album

The exported PDF album (`src/services/album-pdf.ts`) draws its polaroids in the frame of the mood that is active when the album is generated, so the PDF matches what the user sees on the timeline.

- The album is rasterised on a canvas, which cannot use CSS. `src/services/album-frame.ts` reads the same `--frame-*` tokens (and `--theme-emoji`) from `getComputedStyle(document.documentElement)` and re-draws the paper, shadow(s), margin texture, hairline edge, washi tape or emoji sticker with canvas primitives. A new mood therefore needs **no PDF code**, only its `--frame-*` block.
- Caption text uses `--frame-ink`, the author / date line uses `--frame-ink-muted`. The tape / sticker choice uses the same `getFrameDecoration(post.id)` as the timeline. The A4 page itself and the cover keep their neutral paper so printing stays ink-friendly.
- CSS metrics (shadow, tape size, radius, texture tile) are scaled from a 320px-wide timeline polaroid (`WEB_FRAME_WIDTH`) to the canvas.
- `parseTexture` understands the shapes the moods use: a dot grid (`radial-gradient(<color> <r>, transparent <r>)` + `--frame-texture-size`), an elliptical vignette (`radial-gradient(<rx> <ry> at <x> <y>, …)`) and an angled sheen (`linear-gradient(<n>deg, …)`). Any other `--frame-texture` is skipped in the PDF (the web still shows it), and `album-frame.test.ts` fails if a registry theme uses a shape the parser cannot draw.

---

## 2. Ambient Effect System

Effects provide environmental atmosphere (Rain, Snow, Fireflies). They are managed by the `AmbientEffectLayer`.

### Effect Types

- **Particle Effects (Canvas):** Used for complex movement like rain or falling leaves. High performance via the custom engine in `src/components/effects/engine`.
- **CSS Effects (Layer):** Used for simpler overlays like "Sun" (a gradient glow) or "Fog" (moving SVG filters/gradients).

### Implementation Details

- **Metadata:** Defined in `src/components/effects/effects.ts`.
- **Config:** `src/components/effects/effect-configs.ts` defines the specific particle counts, speeds, and colors for each effect.
- **Engine:** The engine (`src/components/effects/engine/particle-system.ts`) is a pure-logic integrator. It doesn't know about DOM or Canvas; it just calculates positions over time (`stepParticleSystem`).
- **Rendering:** `ParticleCanvas.tsx` bridges the engine to the browser's Canvas API. It handles DPR (Dots Per Pixel) scaling and the `requestAnimationFrame` loop.

### Adding a New Effect

1.  **Register:** Add the ID to `src/components/effects/effects.ts`.
2.  **Configure:**
    - If it's a **Particle** effect: Add a `ParticleEffectSpec` to `PARTICLE_CONFIGS` in `src/components/effects/effect-configs.ts`.
    - If it's a **CSS** effect: Add a class mapping to `CSS_EFFECT_CLASSES` and define the animation/styles in `style.css`.
3.  **Asset (Optional):** If using emojis/glyphs, the engine automatically handles sprite caching in `sprite-cache.ts`.

### Reduced Motion

We respect the user's OS settings. If `window.matchMedia('(prefers-reduced-motion: reduce)')` is true, the `AmbientEffectLayer` returns `null` and no processing happens.
