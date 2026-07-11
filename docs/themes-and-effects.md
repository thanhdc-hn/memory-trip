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
3.  **Localize Label:** Add the translation for `theme.neon` in the localization files (if applicable).

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
