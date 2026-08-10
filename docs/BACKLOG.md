# Codex Homes — Backlog

The Design Studio v2 (photo → materials → AI render → estimate → lead) shipped
on `claude/kitchen-bathroom-design-studio-l4k7tt`. What follows is the queue,
roughly in order of leverage.

## Unblock production (requires Jeff/Zach)

- **Restore the `codex-homes` Supabase project** (`btboeocdmdceuxcabqld`).
  The free tier allows 2 active projects and `tri-state-grill` + `tarch`
  occupy both slots — pause one or upgrade the org, then restore.
- **Apply migrations** in `supabase/migrations/` (Supabase MCP
  `apply_migration` or `supabase db push`), then regenerate
  `src/lib/db.types.ts` (`supabase gen types`) and re-type
  `src/lib/supabase/admin.ts` with `<Database>`.
- **Set Vercel env vars**: `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
  (Google AI Studio). `REPLICATE_API_TOKEN` already exists. Optional:
  `RENDER_PROVIDER` (defaults to gemini).
- **Real-provider smoke test**: one Gemini render + one Replicate-fallback
  render on a deployed preview; confirm the output preserves room geometry
  and the webp lands in the `designer-renders` bucket.
- **Seed the materials catalog** (`materials` table) with real SKUs/pricing;
  until then the built-in fallback catalog serves.

## Studio phase 3

- Style presets ("Modern", "Classic", "Warm") that pre-fill selections.
- Shareable read-only design links (signed, no token exposure).
- Render provider A/B against real customer photos; keep the winner.
- Bathroom sample photo alongside the kitchen one.
- Email-my-design (capture email earlier in the funnel).
- 2D/3D planner exploration — three.js; see blueprint3d / openPlan3D /
  architect3d for open-source starting points. Pro-grade companion, not a
  replacement for the photo flow.

## iOS app

- Wrap the studio flow (Capacitor or Expo WebView first, native later).
- Native camera integration removes the HEIC dance entirely.
- Push notification when a consult is booked/confirmed.
- App Store presence as an acquisition channel ("kitchen remodel visualizer").

## Site

- Blog: publish the Cincinnati-specific pieces the stub promises.
- Portfolio: wire before/after pairs from `design-assets/showcase-raw`
  (~170 curated-ready photos).
- `brand/logo.tsx` alt text still says "Custom Building & Remodeling".
- `footer.tsx` uses `dangerouslySetInnerHTML` for an `&amp;` — simplify.

## Ops handover (Zach)

- Lead follow-up automation: new lead → notification (SMS/email via Twilio
  MCP or Zapier) with the attached studio design and photos.
- Weekly lead + studio-usage digest (sessions created, renders, conversion
  to leads) from `designer_sessions` / `designer_renders` / `leads`.
- Materials catalog admin flow so Zach can maintain SKUs and pricing
  without code.
- Reuse patterns from the tri-state-grill and personal-assistant projects
  (same Supabase org) for task/agent orchestration.
