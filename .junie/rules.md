### Coding Rules

- Use named imports for React (e.g., `import { useState, useEffect } from 'react'`) instead of `React.useState`.
- Use `src/utils/storage.ts` for all `localStorage` operations.
- Avoid using heading tags like `h1`, `h2`, etc. Prefer `div`, `span`, or `p` with appropriate styling.
- Follow mobile-first design (max-width 768px, centered).
- Use kebab-case for file and folder names.
- Ensure all admin features are protected by the `useAdminAuth` hook/logic.
- Admin access secret: Implement a "10 clicks anywhere on screen" trigger to navigate to `/admin`.
- SQL Schema & RLS Rules:
    - `teams`: Stores team info (`id`, `name`, `invite_password`, `is_locked`, `created_at`).
    - `posts`: Stores post info (`id`, `team_id`, `author_name`, `caption`, `image_url`, `created_at`).
    - `admins`: Stores admin password.
    - RLS for `posts`:
        - All `select` and `insert` operations MUST include the `x-team-id` header in the request, which must match the
          `team_id` of the post.
        - Posts cannot be inserted if the associated team is locked (`is_locked = true`).
    - References: `posts.team_id` references `teams.id` with `ON DELETE CASCADE`.
