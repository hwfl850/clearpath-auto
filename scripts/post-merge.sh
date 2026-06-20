#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push

# Sync to GitHub automatically after every task merge.
# Requires GH_PAT to be set as a Replit Secret (repo-scoped GitHub PAT).
# If the secret is not configured the step is skipped silently.
if [ -n "${GH_PAT:-}" ]; then
  echo "GH_PAT found — syncing to GitHub..."
  bash "$(dirname "$0")/sync-to-github.sh"
else
  echo "Skipping GitHub sync: GH_PAT secret not configured."
fi
