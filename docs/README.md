# Memory Trip Development Documentation

Welcome to the Memory Trip developer documentation. This guide is designed to help new developers understand the project's logic, workflow, and how to contribute to features like themes and effects.

## Getting Started

1.  **[Architecture Overview](./architecture.md):** Start here to understand the core technologies, project structure, and our "Cozy & Tactile" design philosophy.
2.  **[Themes and Effects](./themes-and-effects.md):** A deep dive into how we handle visual moods and ambient weather layers. Learn how to add your own theme or a new particle effect.
3.  **[Radial Wheel Picker](./radial-wheel-picker.md):** Documentation for our custom tactile selection component. Covers the math behind the circular drag and snapping logic.

## Common Tasks

### How to add a new Theme?

1.  Register the theme in `src/components/theme/themes.ts`.
2.  Add CSS variables in `src/style.css` under a `[data-theme='your-id']` block.
3.  See [Themes and Effects](./themes-and-effects.md#adding-a-new-theme) for details.

### How to add a new Ambient Effect?

1.  Register the effect in `src/components/effects/effects.ts`.
2.  Add configuration in `src/components/effects/effect-configs.ts`.
3.  See [Themes and Effects](./themes-and-effects.md#adding-a-new-effect) for details.

### How to edit UI components?

- We use **Tailwind CSS** for styling.
- Follow the "Summer Scrapbook" concept: use rounded corners, soft shadows, and subtle rotations.
- Refer to `theme-effect.md` in the root directory for the aesthetic guidelines.

## Code Quality

- **Testing:** We use `vitest` and `React Testing Library`. Run tests with `pnpm test`.
- **Linting:** Pre-configured with ESLint and Prettier. Please ensure your editor supports these or run `pnpm lint` before submitting.

---

_Created to help you build beautiful memories._
