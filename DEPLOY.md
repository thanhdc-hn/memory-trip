# Self-Hosting & Deployment Guide

This guide walks you through deploying your own instance of **Memory Trip** from scratch:
a Supabase backend (database + storage) and a Netlify frontend (static site + serverless admin functions).

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 18+ and [pnpm](https://pnpm.io/) (`npm i -g pnpm`)
- A free [Supabase](https://supabase.com/) account
- A free [Netlify](https://netlify.com/) account
- A clone of this repository

---

## 2. Set Up Supabase

### 2.1 Create a project

1. Go to the Supabase dashboard → **New project**.
2. Pick a name, a strong database password, and a region close to your users.
3. Wait for the project to finish provisioning.

### 2.2 Run the database schema

1. Open **SQL Editor** in the Supabase dashboard.
2. Paste the entire contents of `supabase/migrations/20260603_schema.sql` (or `supabase/schema.sql`).
3. Click **Run**.

This creates the `teams`, `posts`, and `post_reactions` tables, the `public_team_preview`
view, RLS policies, the `memory-images` storage bucket, and the helper functions.

### 2.3 Collect your credentials

From **Project Settings → API**, copy:

| Value                     | Used as                              |
| ------------------------- | ------------------------------------ |
| Project URL               | `VITE_SUPABASE_URL` / `SUPABASE_URL` |
| `anon` public key         | `VITE_SUPABASE_ANON_KEY`             |
| `service_role` secret key | `SUPABASE_SERVICE_ROLE_KEY`          |

> ⚠️ The `service_role` key bypasses Row Level Security. Keep it server-side only — never put it in a `VITE_*` variable.

---

## 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill it in:

```env
# ===== Client-side (Vite - exposed to browser) =====
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_SUPABASE_ADMIN_SECRET=<a-random-secret-string>

# ===== Server-side (Netlify Functions only) =====
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ADMIN_PASSWORD=<the-admin-login-password>
ADMIN_SECRET=<same-value-as-VITE_SUPABASE_ADMIN_SECRET>
```

Notes:

- `ADMIN_PASSWORD` is the password you type on the hidden `/admin` page (open it by tapping the screen 10 times).
- `VITE_SUPABASE_ADMIN_SECRET` and `ADMIN_SECRET` **must be identical** — they are the XOR key used to encode/decode the admin auth token between the browser and the Netlify functions.

---

## 4. Run Locally

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173`.

> Local admin functions: the `/.netlify/functions/*` endpoints only run under the Netlify dev server.
> To test admin features locally, install the Netlify CLI (`npm i -g netlify-cli`) and run `netlify dev` instead of `pnpm dev`.

---

## 5. Deploy to Netlify

### 5.1 Connect the repository

1. Push your repo to GitHub/GitLab.
2. In Netlify: **Add new site → Import an existing project** and select the repo.

### 5.2 Build settings

| Setting             | Value                               |
| ------------------- | ----------------------------------- |
| Build command       | `pnpm build`                        |
| Publish directory   | `dist`                              |
| Functions directory | `netlify/functions` (auto-detected) |

If Netlify doesn't auto-detect these, add a `netlify.toml` at the repo root:

```toml
[build]
  command = "pnpm build"
  publish = "dist"
  functions = "netlify/functions"
```

SPA routing is already handled by `public/_redirects` (`/* /index.html 200`).

### 5.3 Add environment variables

In **Site settings → Environment variables**, add all 8 keys from your `.env`
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_ADMIN_SECRET`,
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SECRET`).

### 5.4 Deploy

Trigger a deploy. Netlify builds the static site into `dist/` and publishes the admin
functions under `/.netlify/functions/`:

- `admin-teams-list`, `admin-teams-create`, `admin-teams-update`,
  `admin-teams-delete`, `admin-teams-clear-data`, `admin-storage`

---

## 6. Post-Deploy Checklist

- [ ] Open the site — the home page loads.
- [ ] Tap the screen 10 times → `/admin` appears → log in with `ADMIN_PASSWORD`.
- [ ] Create a team, then join it from the public flow and post a memory with an image.
- [ ] Confirm the image appears (Supabase Storage `memory-images` bucket is public-read).
- [ ] Install the PWA ("Add to Home Screen") to verify the service worker.

---

## 7. Troubleshooting

| Symptom                         | Likely cause                                                             |
| ------------------------------- | ------------------------------------------------------------------------ |
| Admin login always fails        | `ADMIN_SECRET` ≠ `VITE_SUPABASE_ADMIN_SECRET`, or wrong `ADMIN_PASSWORD` |
| Images upload but don't display | Storage bucket/policies not created — re-run the schema                  |
| Posts can't be created          | Missing `x-team-id` flow, or team is locked / past `close_at`            |
| `/admin` 401 on every call      | `SUPABASE_SERVICE_ROLE_KEY` missing or invalid in Netlify env            |
| 404 on page refresh             | `_redirects` not published, or wrong publish directory                   |
