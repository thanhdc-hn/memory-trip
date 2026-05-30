# Memory Trip — App Flow

## User Flow (routing + security paths)

```mermaid
flowchart TD
    Start([Open app]) --> Root{"/ Home"}

    Root -->|"localStorage has team_id + nickname"| TL["/timeline"]
    Root -->|"not joined"| HomeView["Home view<br/>Hero · Recent Memories · How It Works · READY! CTA"]

    HomeView -->|"READY!"| TCM[TeamCodeModal] -->|"enter code"| JoinRoute["/join/:inviteCode"]
    QR["Scan QR / invite link"] --> JoinRoute
    TenTap["10 secret taps anywhere"] --> Admin["/admin"]

    JoinRoute --> JP{usePublicTeam}
    JP -->|"invalid code"| Invalid[InvalidTeamState]
    JP -->|"is_locked"| Archived[ArchivedTeamState]
    JP -->|"saved team == this team"| TL
    JP -->|"valid"| JoinCard[Nickname + optional Password]

    JoinCard -->|submit| Verify{"has_password?"}
    Verify -->|yes| PW{verifyPassword} -->|fail| ShakeErr[Password error] --> JoinCard
    Verify -->|no| Save
    PW -->|ok| Save["Save team_id + nickname<br/>to localStorage"]
    Save -->|"full reload -> sets x-team-id header"| TL

    TL --> TLView["Timeline view"]
    TLView --> Feed["Infinite-scroll feed (PostCard)<br/>+ realtime new posts"]
    TLView -->|"Share FAB (cooldown)"| Create[CreatePostSheet] --> Upload["compress -> Storage + posts insert<br/>optimistic add"] --> Feed
    TLView -->|"Export"| EX["/export"]
    EX --> Album["Select memories -> jsPDF album<br/>share sheet / download"]
    Feed -->|"double-tap / heart"| React["Reactions (hearts)"]
```

## Architecture & Data Security Layers

```mermaid
flowchart LR
    subgraph Client["React PWA (Vite)"]
        Views["Views: Home / Join / Timeline / Export / Admin"]
        Hooks["Hooks + TanStack Query + Zustand"]
        Svc["Services"]
    end

    subgraph ClientPath["Client data path (posts/teams read)"]
        PostsSvc["posts.service / public-team.service"]
        SB["Supabase JS client<br/>sends x-team-id header"]
    end

    subgraph AdminPath["Admin path (Teams CRUD)"]
        TeamSvc["team.service<br/>sends x-admin-auth header"]
        NF["Netlify Functions<br/>admin-teams-*, admin-storage"]
        SRK["SUPABASE_SERVICE_ROLE_KEY<br/>(server only, bypasses RLS)"]
    end

    DB[("Supabase<br/>Postgres + Storage + Realtime<br/>teams · posts · admins · RLS")]

    Views --> Hooks --> Svc
    Svc --> PostsSvc --> SB -->|"RLS by team_id"| DB
    Svc --> TeamSvc --> NF --> SRK --> DB
    DB -.->|"realtime postgres_changes"| SB
```

## Notes

- **Home** auto-redirects joined users (localStorage `team_id` + `nickname`) to
  `/timeline`; otherwise the READY! CTA opens `TeamCodeModal`.
- **Join** (`usePublicTeam`) handles invalid/locked teams, the returning-user
  shortcut, optional password verification, then saves to localStorage and does
  a **full page reload** so the Supabase client picks up the `x-team-id` header.
- **Timeline** uses infinite scroll + a realtime subscription, a cooldown-gated
  Share FAB feeding `CreatePostSheet`, and an Export route producing the jsPDF
  album.
- **Two security layers**: client reads go through the Supabase JS client with
  `x-team-id` (RLS-enforced); all admin Teams CRUD goes through **Netlify
  Functions** with `x-admin-auth`, using the service-role key server-side to
  bypass RLS. Admin is reached via the 10-tap secret entry.
