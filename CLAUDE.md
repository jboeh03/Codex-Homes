@AGENTS.md

# Codex Homes

Marketing site + lead-gen web app for a Cincinnati custom building / remodeling
company. The centerpiece is the **Designer Tool**: a visitor uploads a photo of
their kitchen or bath, picks real materials, sees a live installed price range,
and can generate an AI "after" render of their actual room — then convert into a
booked estimate.

## Read this first

`AGENTS.md` (imported above) is not boilerplate: **this Next.js version has
breaking changes vs. model training data.** Before writing Next.js code, read
the relevant guide in `node_modules/next/dist/docs/` (requires
`pnpm install` first — see below). Key gotchas already in use here:

- Route `params` and `searchParams` are **Promises** — `await` them. See
  `src/app/services/[slug]/page.tsx` and the dynamic API routes.
- Pages that read live Supabase data set `export const dynamic = "force-dynamic"`.

## Tech stack

- **Next.js 16.2.6** (App Router) + **React 19.2.4** + **TypeScript 5** (strict)
- **Tailwind CSS v4** — CSS-first config via `@theme inline` in
  `src/app/globals.css`; there is no `tailwind.config.js`
- **Supabase** (`@supabase/supabase-js`) — Postgres + Storage, anon key only
- **Replicate** REST API — AI interior renders (`adirik/interior-design`)
- **Radix UI** primitives + **class-variance-authority** + **lucide-react**
- **Zod** for all request validation
- Package manager is **pnpm** (`pnpm-lock.yaml`); Node 22

## Commands

`node_modules` is **not committed** — run `pnpm install` first in a fresh
checkout (this also unpacks the Next.js docs referenced above).

```bash
pnpm install      # required before anything else
pnpm dev          # next dev — http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm lint         # eslint (eslint-config-next, flat config)
pnpm typecheck    # tsc --noEmit
```

Run `pnpm lint && pnpm typecheck` before considering a change done. There is no
test suite.

## Environment variables

The app talks to Supabase and Replicate; without these, data loads fail and the
AI preview returns HTTP 503.

- `NEXT_PUBLIC_SUPABASE_URL` — client + server
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client + server (RLS enforced; no service-role key)
- `REPLICATE_API_TOKEN` — **server only**; never expose to the client

Photo uploads go to the Supabase Storage bucket **`designer-uploads`** (public).

## Project layout

```
src/
  app/
    layout.tsx              # root layout: SiteHeader + SiteFooter, Inter font, metadata
    page.tsx                # home
    designer/page.tsx       # Designer Tool (server-fetches materials → <DesignerTool/>)
    services/page.tsx, services/[slug]/page.tsx
    portfolio/page.tsx, portfolio/[slug]/page.tsx
    get-estimate/page.tsx   # multi-step <LeadForm/> (wrapped in <Suspense/>)
    about | process | blog | service-areas
    api/
      leads/route.ts                  # POST  → insert lead
      designer/sessions/route.ts      # POST  → create session
      designer/sessions/[id]/route.ts # GET/PATCH session
      designer/renders/route.ts       # POST  → start Replicate prediction (cached by hash)
      designer/renders/[id]/route.ts  # GET   → poll + persist render status
  components/
    ui/        # Button, Input, Textarea, Card — cva-based design primitives
    site/      # header, footer, trust-strip
    designer/designer-tool.tsx        # the big client component
    forms/lead-form.tsx               # multi-step lead capture
    brand/logo.tsx
  lib/
    supabase/{server,client}.ts  # client factories (see below)
    db.types.ts        # generated Supabase types + handy row aliases
    designer.ts        # estimate math, render-prompt builder, selectionsHash
    lead-schema.ts     # zod schema + label maps for the lead form
    services.ts        # hardcoded service catalog (not in the DB)
    replicate.ts       # minimal Replicate REST helper
    utils.ts           # cn(), formatCurrency, formatCurrencyRange
public/        # brand SVGs, portfolio images
brand/         # source brand sheet (PDF)
```

Path alias: `@/*` → `src/*`.

## Data model (Supabase)

Types live in `src/lib/db.types.ts` — **regenerate, don't hand-edit** after a
schema change. Tables:

- `materials` — catalog for the Designer Tool, keyed by `material_category`
  enum; has `unit_cost`, `install_cost_per_unit`, `unit`, `is_active`,
  `sort_order`, `image_url`/`color_hex` for swatches.
- `designer_sessions` — autosaved Designer Tool state (room type, dimensions,
  selections, estimate, photo URLs) as JSON.
- `designer_renders` — one row per AI render, deduped per session by
  `selections_hash`; tracks Replicate `status` + `output_url`.
- `leads` — submitted estimate requests; may link a `designer_session_id`.
- `portfolio_projects` — published case studies.

## Conventions

**Supabase clients.** Server Components and API routes use
`createSupabaseServerClient()` (`src/lib/supabase/server.ts`); browser code uses
the cached `createSupabaseBrowserClient()`. Both use the anon key, no session
persistence — there is no auth in this app.

**API routes.** Parse the body, validate with a Zod schema, and return
`NextResponse.json(...)` with explicit status codes (`422` validation, `400` bad
JSON / id, `404`, `502` upstream, `503` missing config, `201` created). Mirror
the existing handlers.

**Styling.** Use Tailwind utilities + brand tokens referenced as arbitrary
values, e.g. `text-[--color-primary]`, `bg-[--color-brand-black]`. Tokens are
defined in `globals.css` (`@theme inline`). Headings use the `font-display`
class (a Times serif — intentional brand choice, not a mistake). Compose classes
with `cn()`; build component variants with `cva` like `components/ui/button.tsx`.

**Money.** Always format with `formatCurrency` / `formatCurrencyRange` from
`lib/utils.ts` (USD, no decimals).

## Designer Tool flow (the core feature)

1. `/designer` (server) loads active `materials` and renders `<DesignerTool/>`.
2. The client component holds room type, dimensions, and material selections;
   `calculateEstimate()` (`lib/designer.ts`) computes the live range
   (materials + install + an 18–32% labor/overhead band).
3. State autosaves (debounced) to `designer_sessions`; the session id is kept in
   `localStorage` under `codex-designer-session-id`.
4. **AI preview:** `POST /api/designer/renders` builds a prompt from the
   selected materials, hashes the inputs (`selectionsHash`) to dedupe, and
   kicks off a Replicate prediction. The client polls
   `GET /api/designer/renders/[id]` every 3s; that route re-checks Replicate and
   persists the latest status.
5. "Bring this to a consult" links to `/get-estimate?session=<id>`, where
   `<LeadForm/>` attaches the session id to the new lead.

When changing render inputs, keep `selectionsHash` (server) and the client's
`currentSelectionsKey` in sync — they must hash the same fields or caching and
the "stale render" badge break.

## Guardrails

- Don't introduce a service-role Supabase key or any auth flow — the app is
  intentionally anonymous behind RLS.
- Keep `REPLICATE_API_TOKEN` server-side only.
- The service catalog (`lib/services.ts`) is code, but `portfolio_projects` and
  `materials` come from the DB — don't confuse the two.
