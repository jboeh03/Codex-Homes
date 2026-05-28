#!/usr/bin/env bash
# Rewrite Tailwind v4 arbitrary CSS-variable utilities so the variable
# is wrapped in var(). See SKILL.md for the why.
set -euo pipefail

ROOT="${1:-src}"

if [ ! -d "$ROOT" ]; then
  echo "Directory not found: $ROOT" >&2
  exit 1
fi

# Match [--<token>] but skip ones already wrapped: [var(--...)] won't match because
# the regex requires `[--` immediately followed by an identifier.
PATTERN='\[--[a-zA-Z0-9_-]+\]'

before=$(grep -rEo "$PATTERN" "$ROOT" 2>/dev/null | wc -l | tr -d ' ')
files=$(grep -rlE "$PATTERN" "$ROOT" 2>/dev/null || true)

if [ -z "$files" ]; then
  echo "✓ No broken [--<token>] patterns in $ROOT."
  exit 0
fi

echo "Rewriting $before occurrences across:"
printf '  %s\n' $files

for f in $files; do
  sed -i -E 's/\[--([a-zA-Z0-9_-]+)\]/[var(--\1)]/g' "$f"
done

after=$(grep -rEo "$PATTERN" "$ROOT" 2>/dev/null | wc -l | tr -d ' ')
echo "Done. Remaining: $after"
