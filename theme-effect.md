# Themes & Effects Registry

This document lists all available visual moods (themes) and ambient effects in the Memory Trip application.

## 1. Themes

Themes define the overall color palette, typography, and mood of the application. They are applied via the `data-theme` attribute on the root element.

| ID         | Name     | Swatch    | Accent |
| :--------- | :------- | :-------- | :----- |
| `summer`   | Summer   | `#87ceeb` | 🌌     |
| `sunset`   | Sunset   | `#ff7f50` | 🌅     |
| `ocean`    | Ocean    | `#0e7490` | 🌊     |
| `forest`   | Forest   | `#2f855a` | 🌿     |
| `night`    | Night    | `#0b1220` | 🌙     |
| `sakura`   | Sakura   | `#fbcfe8` | 🌸     |
| `autumn`   | Autumn   | `#d97706` | 🍂     |
| `lavender` | Lavender | `#a78bfa` | 🪻     |
| `arctic`   | Arctic   | `#bae6fd` | ❄️     |
| `matcha`   | Matcha   | `#a7c080` | 🍵     |
| `honey`    | Honey    | `#f59e0b` | 🍯     |
| `cosmos`   | Cosmos   | `#c084fc` | ✨     |

## 2. Ambient Effects

Ambient effects provide environmental "weather" overlays. They can be particle-based (Canvas) or layer-based (CSS).

| ID              | Name           | Icon | Kind     | Seasonal |
| :-------------- | :------------- | :--- | :------- | :------- |
| `auto`          | Auto           | 🪄   | -        | -        |
| `off`           | Off            | 🚫   | -        | -        |
| `snow`          | Snow           | ❄️   | Particle | Yes      |
| `rain`          | Rain           | 🌧️   | Particle | Yes      |
| `sun`           | Sun            | ☀️   | CSS      | Yes      |
| `leaves`        | Leaves         | 🍂   | Particle | Yes      |
| `blossom`       | Cherry blossom | 🌸   | Particle | No       |
| `meteor`        | Meteor shower  | ☄️   | Particle | No       |
| `spring-leaves` | Spring leaves  | 🍃   | Particle | No       |
| `ink`           | Ink diffusion  | 🖋️   | Ink      | No       |
| `aurora`        | Aurora         | ✨   | Aurora   | No       |
| `nebula`        | Nebula         | 🌌   | Nebula   | No       |
| `water`         | Water          | 🌊   | Water    | No       |
| `fire`          | Fire           | 🔥   | CSS      | No       |

---

# Memory Trip UI Theme Concept: "Summer Scrapbook"

This document outlines the complete UI theme for the Team Trip Memory web app, designed to feel like a shared holiday
diary between friends.

## 1. Theme Concept Overview

The "Summer Scrapbook" theme blends **Studio Ghibli’s** summer atmosphere with **Animal Crossing’s** cozy UI. It
prioritizes emotional warmth, playful imperfection, and nostalgic charm over corporate precision. It's a "Living Document" that grows with your memories.

- **Mood:** Cartoon-style, cute, cozy, and carefree.
- **Aesthetic:** A digital scrapbook/journal filled with polaroids, stickers, and hand-drawn doodles.
- **Vibe:** Like opening a physical box of memories from a sun-drenched beach vacation.

## 2. Color Palette: "Pastel Sunset"

A soft, warm palette that avoids harsh neons or corporate blues.

| Tone                | Hex       | Usage                                     |
| ------------------- | --------- | ----------------------------------------- |
| **Sky Blue**        | `#87CEEB` | Primary accents, links, sky backgrounds.  |
| **Ocean Teal**      | `#40E0D0` | Secondary accents, progress bars.         |
| **Coral Pink**      | `#FF7F50` | Primary CTA, heart icons, "hot" memories. |
| **Sunshine Yellow** | `#FFD700` | Highlights, stars, sparkle icons.         |
| **Peach Orange**    | `#FFDAB9` | Soft backgrounds, secondary cards.        |
| **Mint Green**      | `#98FF98` | Success states, nature icons.             |
| **Sand Beige**      | `#F5DEB3` | Borders, subtle textures, "empty" states. |
| **Shell White**     | `#FFFDF9` | Main application background.              |

## 3. Typography

Friendly, rounded, and legible with a "handwritten" touch for personality.

- **Headings & Body:** `Varela Round` (Google Fonts). Perfectly rounded and friendly.
- **Captions & Accents:** `Pangolin` (Google Fonts). A playful, legible handwriting font that mimics diary entries.
- **Styling:** Large line spacing (160%+) and comfortable padding to keep the layout breathable.

## 4. Component Design System

### Cards & Photos

- **Polaroid Frames:** Every photo is wrapped in a thick white border with a larger bottom margin for "captions."
- **Washi Tape:** Decorative semi-transparent rectangles (`.tape`) placed at the top of cards to "stick" them to the
  page.
- **Soft Shadows:** Low-intensity, slightly blurred shadows to give a 3D paper effect.

### Interactive Elements

- **Sticker Buttons:** Rounded buttons with thick white borders and offset shadows that look like physical stickers.
- **Radial Wheel Picker:** A tactile, circular selection dial for switching themes and effects, resembling a physical camera lens or a rotary dial.
- **Bouncy Hover:** Use `cubic-bezier` transitions for a playful "pop" when interacting.
- **Reaction Buttons:** Large emojis with a scale-up animation on click.

### Navigation & badges

- **Nickname Badges:** Rounded "pill" shapes with dashed borders, resembling luggage tags or camp name stickers.
- **Dashed Connectors:** Dotted or dashed lines connecting elements, mimicking a hand-drawn scrapbook layout.

## 5. Animation Guidelines

Keep it "alive but calm."

- **Floating:** Subtle up-and-down motion (`animate-float`) for headers or decorative icons.
- **Bouncy Scale:** A slight `scale(1.1)` and `rotate(2deg)` on hover for interactive items.
- **Gentle Transitions:** All state changes should take 200-400ms with an "out-back" easing.

## 6. Illustration & Icon Style

- **Icons:** Use `Lucide React` but softened with theme colors.
- **Doodles:** Hand-drawn style SVG doodles (sun, waves, palm trees, stars).
- **Stickers:** Minimal cartoon illustrations with a white stroke outline.

## 7. Example Screen: The Timeline

The feed shouldn't be a strict vertical line.

- Items are slightly rotated (alternating between -2 and +2 degrees).
- Spacing is irregular to mimic a hand-arranged scrapbook.
- Background features a subtle dot-grid or light paper texture.

---

_Created with love for the Team Trip Memory App._
