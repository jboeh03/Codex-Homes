# Codex Homes

Marketing site + AI Design Studio for Codex Homes (Cincinnati kitchen & bath
remodeling). Next.js 16 App Router, Tailwind v4, Supabase, deployed on Vercel.

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm typecheck      # tsc --noEmit
pnpm lint
pnpm build
```

Run the Design Studio without any API keys or database:

```bash
RENDER_PROVIDER=mock pnpm dev
```

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Anon key (materials + portfolio reads, lead inserts) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Studio API routes (sessions, photo uploads, renders). Never expose to the client. |
| `GEMINI_API_KEY` | server only | Primary AI render provider (Gemini image editing). `GOOGLE_AI_API_KEY` also accepted. |
| `REPLICATE_API_TOKEN` | server only | Fallback render provider (flux-kontext-pro) |
| `RENDER_PROVIDER` | server only | `gemini` (default) \| `replicate` \| `mock`. `mock` returns a watermarked copy of the source photo — free, for dev/QA. |
| `STUDIO_RENDERS_PER_SESSION_HOUR` | server only | Per-session render cap (default 8) |
| `STUDIO_RENDERS_GLOBAL_DAY` | server only | Global daily render circuit breaker (default 200) |

## Design Studio architecture

- UI: `src/components/studio/` — mobile-first stepper (photo → room → materials
  → render → estimate), state in `studio-provider.tsx`.
- Shared logic: `src/lib/studio/` (estimate engine, canonical render key, zod
  API schemas). Server-only modules import `"server-only"`.
- Render providers: `src/lib/render/` — provider abstraction with
  Gemini primary → Replicate fallback → mock for dev.
- API: `src/app/api/studio/{sessions,photos,renders}` — token-gated
  (`x-studio-token`), service-role Supabase client, private storage buckets
  with signed URLs, DB-backed rate limiting.
- Migrations: `supabase/migrations/*.sql` — apply with `supabase db push` or
  the Supabase MCP `apply_migration` tool, then regenerate
  `src/lib/db.types.ts` with `supabase gen types`.

## Brand

Canonical brand sheet: `brand/Codex-Homes-Brandsheet-2021.pdf`. Color/type
tokens live in the `@theme` block of `src/app/globals.css`. Run the
`brand-guard` skill before committing UI changes; `brand-reviewer` and
`next16-reviewer` agents are available for deeper review.
