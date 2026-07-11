# Radial Wheel Picker for Theme and Effect Selection

## Requirements

### Overview & Goals

Replace the Theme and Effect dropdowns in the Settings panel with a radial wheel picker shown in a modal. The wheel rotates via drag/swipe, previews changes in real time, and snaps to the nearest item when released. A fixed top indicator (12 o’clock) marks the active choice, which is highlighted and shown by name in the center. After confirming/settling, the modal closes and the original displayed value updates.

### Scope

- In Scope
  - Theme wheel picker for `THEMES` registry items.
  - Effect wheel picker for `EFFECT_OPTIONS` (Auto, Off, and all entries of `EFFECTS`).
  - Modal UX with drag/swipe to rotate, smooth snapping, highlight active item, live preview, and central label.
  - Reusable wheel picker component with React + TypeScript. Fallback to CSS transitions/JS as Framer Motion is not available.
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

## Technical Design

### Current Implementation

- File: `src/components/settings/settings-panel.tsx` renders three `<Select>` pickers (Language, Theme, Effects) using `@/components/ui/select`.
- Data sources:
  - Theme: `useTheme()` and `THEMES` from `@/components/theme/themes`.
  - Effect: `useEffectSelection()` with `selection`/`setSelection`, `EFFECTS` from `@/components/effects/effects`, plus pseudo options `Auto` and `Off`.
  - Reduced motion: `usePrefersReducedMotion`.

### Key Decisions

- Introduce a reusable `RadialWheelPicker` component that accepts an ordered items array and controlled `angle`/`activeIndex` with callbacks.
- Implement CSS transform + pointer/touch handlers and `requestAnimationFrame`-based snapping since Framer Motion is not installed.
- Modality via existing modal/dialog pattern (Radix-based `Modal`/`Dialog`). Keep a dedicated `WheelPickerModal` wrapper.
- Live preview by updating theme/effect selection on every active-index change.
- Accessibility: keep a visually-hidden native list for SR announcements; keyboard rotates segment-by-segment. Esc returns to prior value.

### Proposed Changes

- Replace Theme/Effect `<Select>` in `settings-panel.tsx` with a trigger that opens `WheelPickerModal` configured for Theme/Effect.
- `WheelPickerModal` hosts `RadialWheelPicker` and confirmation controls (Confirm/Cancel).
- Snap logic: `angleStep = 360 / N`; compute `activeIndex = (round(-angle / angleStep) mod N)` with 0 aligned to top (12 o’clock); animate rotation to `-activeIndex * angleStep`.
- Indicator: fixed line/triangle at top.
- Visuals: active item scale 1.2–1.3 with soft outer glow; non-active at base scale/opacity.
- Reduced motion: disable inertia; shorten animations; still snap.

### Data Models / Contracts

- `RadialItem<T>`: `{ id: T; label: string; icon?: ReactNode; swatch?: string }`.
- `RadialWheelPickerProps<T>`:
  - `items: RadialItem<T>[]`
  - `value: T`
  - `onChange: (value: T) => void`
  - `onConfirm: (value: T) => void`
  - `getItemStyle?: (item: RadialItem<T>, active: boolean) => React.CSSProperties`
  - `useUprightLabels?: boolean`
  - `reducedMotion?: boolean`

### Components

- `RadialWheelPicker.tsx`
- `WheelPickerModal.tsx`
- `ThemeWheelControl.tsx`
- `EffectWheelControl.tsx`
- `use-wheel-rotation.ts`

### File Structure

- `src/components/settings/wheel/radial-wheel-picker.tsx`
- `src/components/settings/wheel/wheel-picker-modal.tsx`
- `src/components/settings/wheel/theme-wheel-control.tsx`
- `src/components/settings/wheel/effect-wheel-control.tsx`
- `src/components/settings/wheel/use-wheel-rotation.ts`

## Testing

- Unit test wheel math helpers.
- Component tests: opening modal, keyboard rotation, snap, `onChange`/`onConfirm`.
- Integration checks in `settings-panel`.
