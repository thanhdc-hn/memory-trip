# Architecture Overview

Memory Trip is designed as a "Living Scrapbook" - a cozy, nostalgic web application for sharing travel memories. This document outlines the technical architecture and design principles of the project.

## Core Technologies

- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (v4-beta with `@theme inline` support)
- **State Management:**
  - **Themes/Auth:** React Context
  - **Effects/Settings:** Lightweight custom stores (using `zustand` or similar patterns, located in `src/store`)
- **Animations:** CSS Transitions + Canvas API for heavy particle effects.
- **Backend (Infrastructure):** Supabase (Auth, Database, Storage)
- **Deployment:** Netlify (Functions, Edge)

## Project Structure

- `src/components`: UI components organized by feature.
  - `effects/`: The ambient weather/mood system.
  - `theme/`: Theme provider and metadata.
  - `settings/wheel/`: Tactile selection components.
- `src/layouts`: Page-level containers (Main, Auth).
- `src/store`: Application state.
- `src/utils`: Helpers, constants, and storage abstractions.

## Design Philosophy: "Cozy & Tactile"

1.  **Imperfect over Precise:** We prefer rounded corners, slight rotations (`rotate(2deg)`), and "hand-drawn" styles.
2.  **Tactile Feedback:** Interactions should feel physical. The `RadialWheelPicker` mimics a camera lens or rotary dial.
3.  **Ambient Presence:** The app isn't static; themes and effects (rain, snow, fireflies) create a "living" atmosphere that reacts to seasons or user choice.
4.  **Performance with Grace:** Heavy effects use Canvas to maintain 60fps, but we respect `prefers-reduced-motion` by disabling them entirely when requested.

## Key Workflows

### Data Flow for Visuals

1.  **Theme:** `ThemeProvider` -> `data-theme` on `<html>` -> Tailwind variables -> CSS.
2.  **Effect:** `EffectStore` -> `AmbientEffectLayer` -> `ParticleCanvas` (Canvas) OR CSS Layer.

### Adding New Features

Developers should follow the existing pattern of:

1.  Defining metadata in `src/components/[feature]/[feature].ts`.
2.  Implementing logic in a pure way (hooks or utils).
3.  Connecting to UI via components in the same directory.
