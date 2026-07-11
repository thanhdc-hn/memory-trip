# Radial Wheel Picker

The `RadialWheelPicker` is a core UI component used for selecting themes and effects. It is designed to feel tactile, resembling a physical rotary dial.

## Logic and Math

The component's logic is encapsulated in the `useWheelRotation` hook (`src/components/settings/wheel/use-wheel-rotation.ts`).

### 1. Coordinate System

The wheel uses a 360-degree coordinate system.

- **0 degrees** is mapped to the 12 o'clock position.
- `Math.atan2(dy, dx)` is used to calculate the angle of the user's pointer relative to the center of the wheel.
- We convert radians to degrees and offset by 90 degrees to align 0 with the top.

### 2. Rotation and Snapping

- **Continuous Drag:** During `onPointerMove`, we calculate the `delta` from the start angle and update the CSS `transform: rotate(...)` immediately. This provides fluid feedback.
- **Snapping:** On `onPointerUp`, we calculate the nearest index:
  ```typescript
  const nearestIndex = Math.round(-rotation / angleStep);
  setRotation(-nearestIndex * angleStep);
  ```
- **Active Index:** We normalize the index to ensure it stays within the range of items:
  ```typescript
  const activeIndex =
    ((Math.round(-rotation / angleStep) % itemCount) + itemCount) % itemCount;
  ```

### 3. Visuals

The wheel uses absolute positioning and `calc()` to distribute items in a circle:

- Each item is rotated by `(index * angleStep)`.
- The container itself rotates in the opposite direction to "bring" the selected item to the top or to maintain orientation.

## Usage in Settings

- `ThemeWheelControl`: Maps the `activeIndex` to a theme ID.
- `EffectWheelControl`: Maps the `activeIndex` to an effect ID (including 'auto' and 'off').

Both controls use a `WheelPickerModal` to provide a focused selection experience on mobile and desktop.

## Testing

The rotation logic is covered by unit tests in `use-wheel-rotation.test.ts`. Any changes to the snapping or normalization logic should be verified there.
