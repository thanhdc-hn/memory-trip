### Coding Rules

- Use named imports for React (e.g., `import { useState, useEffect } from 'react'`) instead of `React.useState`.
- Use `src/utils/storage.ts` for all `localStorage` operations.
- Avoid using heading tags like `h1`, `h2`, etc. Prefer `div`, `span`, or `p` with appropriate styling.
- Follow mobile-first design (max-width 768px, centered).
- Use kebab-case for file and folder names.
- Ensure all admin features are protected by the `useAdminAuth` hook/logic.
- Admin access secret: Implement a "10 clicks anywhere on screen" trigger to navigate to `/admin`.
