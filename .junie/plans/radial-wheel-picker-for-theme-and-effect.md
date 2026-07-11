---
sessionId: session-260711-103231-ywpx
---

# Requirements

### Overview & Goals

Replace the Theme and Effect dropdowns in the Settings panel with a radial wheel picker shown in a modal. The wheel rotates via drag/swipe, previews changes in real time, and snaps to the nearest item when released. A fixed top indicator (12 o’clock) marks the active choice, which is highlighted and shown by name in the center. After confirming/settling, the modal closes and the original displayed value updates.

### Scope

- In Scope
  - Theme wheel picker for `THEMES` registry items.
  - Effect wheel picker for `EFFECT_OPTIONS` (Auto, Off, and all entries of `EFFECTS`).
  - Modal UX with drag/swipe to rotate, smooth snapping, highlight active item, live preview, and central label.
  - Reusable wheel picker component with React + TypeScript. Prefer Framer Motion for animation if available; fallback to CSS transitions if not.
  - Respect `prefers-reduced-motion` and maintain accessibility.
- Out of Scope
  - Language selector remains a standard dropdown.
  - Adding/removing themes/effects themselves (we use existing registries only).

### User Stories

- As a user, I can open a wheel picker for Theme/Effect and rotate it to try different options with immediate visual preview.
- As a user, when I stop dragging, the wheel snaps to the nearest option and sets it as the active selection.
- As a user, I see the name of the active option in the center and the active item is larger with a glow.
- As a user, closing the modal updates the displayed value in Settings.

### Functional Requirements

- Clicking Theme/Effect control opens a modal with a circular wheel.
- A fixed indicator at 12 o’clock marks the currently selected segment.
- Items distributed evenly on the circumference; active item scales up and has glow.
- Drag or swipe rotates the wheel; on drag end, wheel snaps to the nearest segment.
- Live preview during rotation:
  - Theme: call `setTheme` live so background/colors update.
  - Effect: call `setSelection` live so ambient effect updates (respect reduced motion).
- Selected item label shown in the wheel center; also mirror beneath as subtle caption if needed.
- Modal closes on confirm/settle; original control reflects the final choice.
- Keyboard: Left/Right rotate one step; Enter confirms; Esc closes without changing.
- Accessibility: announce current option; maintain focus trap in modal.

### Non-Functional Requirements

- Smooth, responsive animation at 60fps on modern devices.
- Reusable wheel component, themable via Tailwind classes.
- No breaking changes to `THEMES`, `EFFECTS`, or stores.
- Works with reduced motion on: transitions minimized and no continuous spinning.

# Technical Design

### Current Implementation

- File: `src/components/settings/settings-panel.tsx` renders three `<Select>` pickers (Language, Theme, Effects) using `@/components/ui/select`.
- Data sources:
  - Theme: `useTheme()` and `THEMES` from `@/components/theme/themes`.
  - Effect: `useEffectSelection()` with `selection`/`setSelection`, `EFFECTS` from `@/components/effects/effects`, plus pseudo options `Auto` and `Off`.
  - Reduced motion: `usePrefersReducedMotion`.

### Key Decisions

- Introduce a reusable `RadialWheelPicker` component that accepts an ordered items array and controlled `angle`/`activeIndex` with callbacks.
- **Sync Transitions**: Ensure the wheel container and its items use identical transition timing functions (e.g., `cubic-bezier(0.2, 0.0, 0, 1)`) and durations to prevent "wobbling" or items turning into ellipses during rotation.
- **Transform Consolidation**: Apply `scale`, `rotate`, and `translate` within a single `transform` string in the React `style` prop to avoid Tailwind class overrides and ensure consistent scaling of the active item.
- Modality via existing modal/dialog pattern (Radix-based `Modal`/`Dialog` already used in the app per docs). Keep a dedicated `WheelPickerModal` wrapper.
- Live preview by updating theme/effect selection on every active-index change. To avoid thrashing on fast drags, debounce micro-steps (e.g., only when crossing segment threshold) while keeping perceived realtime updates.
- Accessibility: keep a visually-hidden native list for SR announcements; keyboard rotates segment-by-segment. Esc returns to prior value.

### Proposed Changes

- Replace Theme/Effect `<Select>` in `settings-panel.tsx` with a trigger that opens `WheelPickerModal` configured for Theme/Effect.
- `WheelPickerModal` hosts `RadialWheelPicker` and confirmation controls (Confirm/Cancel) or auto-close after snap + short delay. Persist final choice and close.
- Snap logic: `angleStep = 360 / N`; compute `activeIndex = (round(-angle / angleStep) mod N)` with 0 aligned to top (12 o’clock); animate rotation to `-activeIndex * angleStep`.
- **Layout Stability**: Fix wheel dimensions to `aspect-square` and use relative radius (e.g., 40-42%) to ensure items don't clip the container or overlap central text.
- Visuals: active item scale 1.2–1.3 with soft outer glow; non-active at base scale/opacity. Ensure all transforms are synced.
- Reduced motion: disable inertia; shorten animations; still snap.

### Data Models / Contracts

- `RadialItem<T>`: `{ id: T; label: string; icon?: ReactNode; swatch?: string }`.
- `RadialWheelPickerProps<T>`:
  - `items: RadialItem<T>[]`
  - `value: T` (current selection)
  - `onChange: (value: T) => void` (fires on active change for live preview)
  - `onConfirm: (value: T) => void` (finalize and close)
  - `getItemStyle?: (item: RadialItem<T>, active: boolean) => React.CSSProperties`
  - `useUprightLabels?: boolean`
  - `reducedMotion?: boolean`

### Components

- `RadialWheelPicker.tsx`
  - Layout: circular container, items positioned at `rotate(i * angleStep) translate(r)`.
  - Motion: container `rotate` via drag; onEnd → snap to nearest.
  - Active highlight: scale/glow; central label.
- `WheelPickerModal.tsx`
  - Wraps `RadialWheelPicker` in a modal; header shows context (Theme/Effect), close/confirm buttons.
  - Keyboard handlers; restores focus to trigger.
- `ThemeWheelControl.tsx`
  - Trigger button showing current swatch + label; opens `WheelPickerModal` with items from `THEMES`.
  - `onChange` calls `setTheme` live; `onConfirm` persists by closing.
- `EffectWheelControl.tsx`
  - Trigger button showing current effect icon + label; opens wheel with `EFFECT_OPTIONS` (Auto/Off + registry).
  - `onChange` calls `setSelection` live; `onConfirm` closes.

### File Structure

- New
  - `src/components/settings/wheel/radial-wheel-picker.tsx`
  - `src/components/settings/wheel/wheel-picker-modal.tsx`
  - `src/components/settings/wheel/theme-wheel-control.tsx`
  - `src/components/settings/wheel/effect-wheel-control.tsx`
  - `src/components/settings/wheel/use-wheel-rotation.ts` (math helpers, optional)
- Modified
  - `src/components/settings/settings-panel.tsx` — replace Theme/Effect `<Select>` with the two new controls.

### Animation & Math Details

- Angle origin at 12 o’clock: initial `rotation = -activeIndex * angleStep`.
- Drag updates `rotation` by delta angle from last pointer angle (`atan2(y, x)`). Accumulate with wrap handling.
- Snap target: `nearestIndex = round(-rotation / angleStep)`; animate `rotation` to `-nearestIndex * angleStep`.
- When `activeIndex` changes, call `onChange(items[activeIndex].id)` for live preview.

### Accessibility

- Role `dialog` with proper labelling; focus trap and return focus to trigger on close.
- Keyboard: Left/Right adjust index; Enter confirms; Esc cancels.
- SR: central live region announces current item label during rotation (debounced).

### Styling

- Tailwind classes consistent with theme tokens; active glow via `ring`/`drop-shadow`.
- Top indicator: simple triangle/line at 12 o’clock, `aria-hidden`.

### Risks

- Rapid live updates could cause jank on low-end devices. Mitigation: threshold-driven `onChange`, and reduced-motion path.
- Framer Motion absence: provide CSS/JS fallback path.
- Effect preview while rotating might be distracting. Mitigation: subtle densities already tuned; allow quick confirm to close.

# Testing

### Validation Approach

- Unit test wheel math helpers: angle→index mapping, snap target correctness, wrapping.
- Component tests (React Testing Library): opening modal, keyboard rotation, snap on release, calling `onChange` and `onConfirm` with correct ids.
- Integration checks in `settings-panel`: live preview calls `setTheme`/`setSelection` and value display updates after close.

### Key Scenarios

- Open Theme wheel; drag to another item; on release snaps and updates; modal closes; current label reflects new theme.
- Open Effect wheel; pick `Auto`, see resolved note preserved; reduced-motion on → updates occur without inertia.
- Keyboard navigation changes active selection and confirms.

### Edge Cases

- Very fast flicks: ensure snap picks the nearest index and animation stays within bounds.
- Small number of items (theme) vs larger (effects): consistent spacing, correct index math.
- Cancel (Esc) restores previous value without committing.

# Delivery Steps

### Step 1: Document the radial wheel picker plan

The plan is written to a markdown file in the `docs/` directory for persistence and reference.

- Create `docs/radial-wheel-picker-plan.md`.
- Copy the content of this plan (Requirements, Technical Design, Testing) into the new file.
- Ensure the file follows the project's documentation standards.

### Step 2: Add reusable RadialWheelPicker and math helpers

A generic circular wheel that lays out items, handles drag rotation, computes active index, and snaps on release. Fixes visual distortion and alignment issues.

- Create `radial-wheel-picker.tsx` with controlled `items`, `value`, `onChange`, `onConfirm`.
- Implement angle math in `use-wheel-rotation.ts` (atan2, normalization, snap target), ensuring `activeIndex` 0 is at 12 o'clock.
- **Fix Visual Distortion**: Sync transitions between container and items; move `scale` into the `style.transform` string to prevent class overrides.
- Add visual top indicator, central live label, active scaling/glow; counter-rotate labels upright if enabled.
- Ensure the wheel container is a perfect circle and adjust the radius to prevent collisions with central text.

### Step 3: Modal wrapper and controls for Theme and Effect

A modal that hosts the wheel picker and exposes confirm/cancel, wired for Theme and Effect separately.

- Implement `wheel-picker-modal.tsx` with focus trap, keyboard handlers, Esc close.
- Build `ThemeWheelControl.tsx`: trigger + modal; map `THEMES` to items; call `setTheme` on active change.
- Build `EffectWheelControl.tsx`: trigger + modal; map `EFFECT_OPTIONS` to items; call `setSelection` on active change (supports Auto/Off).
- Respect `usePrefersReducedMotion` to disable inertia and shorten transitions.

### Step 4: Integrate into Settings panel and polish UX

Settings panel uses wheel controls for Theme/Effect; value reflects final choice; real-time preview is smooth and accessible.

- Modify `src/components/settings/settings-panel.tsx` to replace Theme/Effect `<Select>` blocks with the new controls; keep Language `<Select>` intact.
- Ensure current value (swatch/icon + label) is shown on triggers; modal closes automatically after snap + brief delay or via Confirm button.
- Fine-tune active scale/glow, indicator styling, and label typography; ensure items remain readable; counter-rotate labels if needed.

### Step 5: Testing and reduced-motion/accessibility verification

Wheel math and UI behavior are reliable; reduced-motion and keyboard/SR access work.

- Add unit tests for rotation→index math and snap behavior.
- Add component/integration tests for modal open/close, keyboard Left/Right/Enter/Esc, and `onChange`/`onConfirm` invocation.
- Manually verify live preview fluidity on Theme/Effect; confirm reduced-motion path, and that Esc cancels to prior value.
