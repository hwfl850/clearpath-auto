#!/usr/bin/env bash
# sync-to-github.sh — push the current Replit working tree to GitHub
#
# Required environment variable (set as a Replit Secret):
#   GH_PAT        — GitHub Personal Access Token with "Contents: Read and Write"
#                   (repo scope for private repos, public_repo for public repos)
#
# Optional environment variables:
#   GH_REPO_URL   — Full HTTPS clone URL, e.g. https://github.com/org/repo.git
#                   Defaults to the existing "origin" remote if already set.
#   GH_BRANCH     — Target branch name. Defaults to "main".
#
# Usage:
#   bash scripts/sync-to-github.sh
#
# Tip: add this to a Replit Workflow so it runs automatically on each checkpoint.

set -euo pipefail

BRANCH="${GH_BRANCH:-main}"

if [ -z "${GH_PAT:-}" ]; then
  echo "ERROR: GH_PAT secret is not set." >&2
  echo "Add it via the Replit Secrets panel (the lock icon in the sidebar)." >&2
  exit 1
fi

# Resolve the remote URL — prefer the explicit override, fall back to origin
if [ -n "${GH_REPO_URL:-}" ]; then
  REMOTE_URL="$GH_REPO_URL"
else
  REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"
  if [ -z "$REMOTE_URL" ]; then
    echo "ERROR: No remote URL found. Set GH_REPO_URL or configure an 'origin' remote." >&2
    exit 1
  fi
fi

# Inject the PAT into the URL so git can authenticate non-interactively
# Strips any existing credentials before embedding the token.
AUTH_URL="$(echo "$REMOTE_URL" | sed -E 's|https://([^@]*@)?|https://x-access-token:'"$GH_PAT"'@|')"

echo "Syncing branch '$BRANCH' to GitHub..."
git push "$AUTH_URL" "HEAD:refs/heads/$BRANCH"
echo "Sync complete."
