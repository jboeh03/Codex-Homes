---
name: brand-guard
description: Audit a diff or working tree for non-brand colors, off-brand fonts, and brand-mark misuse. Reads brand tokens from src/app/globals.css and the brand sheet at brand/Codex-Homes-Brandsheet-2021.pdf, then flags hardcoded hex values, non-brand font families, and incorrect logo variant usage. Use before committing UI changes.
---

# brand-guard

Audit the current diff (or full working tree) against the Codex Homes brand guide. Report only — never auto-fix. The human decides which findings are intentional (an overlay rgba may legitimately be off-palette).

## Palette (allowed hex values in source)

From `brand/Codex-Homes-Brandsheet-2021.pdf` and `src/app/globals.css`:

| Token              | Hex       |
| ------------------ | --------- |
| brand-black        | `#101820` |
| paleblue           | `#c6dae7` |
| lightblue          | `#5e8ab4` |
| mediumblue         | `#326295` |
| darkblue (primary) | `#003a70` |
| lightgray          | `#98a4ae` |
| darkgray           | `#5b6770` |
| white              | `#ffffff` |
| black (shadows)    | `#000000` |

Any other hex literal in source is a finding.

## Typography

- Display / serif: **Fraunces** — loaded via `next/font/google` as `var(--font-fraunces)`.
- UI / body: **Jost** — loaded via `next/font/google` as `var(--font-jost)`.

Any other `next/font` import or `font-family` declaration is a finding.

## Logo variants

- `<Logo variant="horizontal">` — dark wordmark, for **light** backgrounds.
- `<Logo variant="horizontal-white">` — light wordmark, for **dark** backgrounds.
- `<Logo variant="monogram">` — the CH mark only.

A `horizontal-white` on a light section (or vice-versa) is a finding.

## Voice

Editorial, restrained, considered. Flag marketing clichés that have slipped in:

- "world-class", "premier", "luxury" used as filler adjective, "industry-leading", "best-in-class", "trusted by", "game-changing".
- Exclamation marks in body copy.
- Emoji.

## Process

1. `git diff --staged` if there are staged changes, else `git diff` against `origin/main` (or the branch base).
2. Audit colors: grep for `#[0-9a-fA-F]{3,8}` in the diff; flag any not in the palette above.
3. Audit fonts: grep for `font-family`, `next/font/google`, and Tailwind `font-*` arbitrary values.
4. Audit logo usage: grep for `<Logo variant=` in the diff.
5. Audit voice: scan added copy for the clichés above.
6. Report a tight bulleted punch list grouped by **must fix** / **consider** / **looks good**.

## When to run

- Before `git push` on any UI branch.
- Before opening a PR that touches `*.tsx`, `*.css`, or copy.
- After a paste-in of design content from a third-party tool.
