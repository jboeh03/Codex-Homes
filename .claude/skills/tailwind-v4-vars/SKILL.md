---
name: tailwind-v4-vars
description: Audit and fix Tailwind v4 arbitrary CSS-variable syntax across the project. Scans src/ for [--<token>] patterns that emit invalid CSS in Tailwind v4 (e.g. `background-color: --color-X` with no var() wrapper, silently ignored by browsers) and rewrites them to [var(--<token>)]. Run after introducing new theme tokens or merging large refactors.
disable-model-invocation: true
---

# tailwind-v4-vars

Tailwind v4's `@theme inline` registers CSS custom properties, but arbitrary-value utilities like `bg-[--color-ink]` do **not** auto-wrap the variable in `var()`. They emit:

```css
.bg-\[--color-ink\] { background-color: --color-ink; }   /* invalid; ignored */
```

Browsers silently ignore the rule. Dark sections render as the page background, accent colors disappear, borders vanish — and there's no error in the console.

The correct forms are:

- `bg-[var(--color-ink)]`  — explicit
- `bg-(--color-ink)`        — Tailwind v4 shorthand

## What this skill does

Runs `fix.sh`, which:

1. Greps the target dir (`src/` by default) for any `[--<token>]` arbitrary-value class.
2. Rewrites them in-place to `[var(--<token>)]`.
3. Reports before/after counts and the file list.

The fix is idempotent — re-running on a clean tree is a no-op.

## Usage

```
/tailwind-v4-vars
```

Or with a custom root:

```
bash .claude/skills/tailwind-v4-vars/fix.sh src/components
```

## When to run

- After introducing new `@theme inline` tokens.
- After merging a branch that touched many `*.tsx` / `*.css` files.
- If a section that should be dark suddenly renders on the page background.
- As a one-shot audit on any new repo that uses Tailwind v4 + CSS custom properties.

## Origin

This skill exists because a 299-occurrence latent bug across 23 files in this repo had every dark section silently rendering as bone canvas. Don't let it happen again.
