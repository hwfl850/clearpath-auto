# CLAUDE.md — ClearPath Auto Agent Handoff

This file gives a new agent everything needed to pick up this project without any context from previous conversations.

---

## What this project is

**ClearPath Auto** — a React + Vite static marketing site for an independent nationwide no-haggle car delivery service. Customers browse vehicles, see specs and pricing context, and submit a price-request form. No e-commerce; the goal is lead generation.

- **Live URL:** `https://hwfl850.github.io/clearpath-auto/`
- **GitHub repo (static output only):** `hwfl850/clearpath-auto`
- **Replit source:** `artifacts/clearpath-auto/` inside this monorepo

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite 7 + TypeScript |
| Routing | Wouter (`base="/clearpath-auto"`) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Data | Supabase (Postgres + Storage) |
| Contact form | Cloudflare Worker → Resend API |
| Hosting | GitHub Pages (static, project site) |
| Monorepo | pnpm workspaces (`@workspace/clearpath-auto`) |

---

## Source file map

| File | What it does |
|------|-------------|
| `artifacts/clearpath-auto/src/App.tsx` | Router, `ScrollToTop` component |
| `artifacts/clearpath-auto/src/pages/Home.tsx` | Landing page — fetches featured vehicles from Supabase |
| `artifacts/clearpath-auto/src/pages/Vehicles.tsx` | Vehicle browser with search + category filter |
| `artifacts/clearpath-auto/src/pages/Request.tsx` | Price-request form; reads `?model=` query param to pre-select vehicle |
| `artifacts/clearpath-auto/src/pages/HowItWorks.tsx` | Static how-it-works page |
| `artifacts/clearpath-auto/src/lib/vehiclesApi.ts` | Supabase fetch, 15-min localStorage cache, fallback data, `fetchFeaturedVehicles()` |
| `artifacts/clearpath-auto/src/lib/supabase.ts` | Supabase client init from `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| `artifacts/clearpath-auto/index.html` | HTML template — contains SPA decode script (runs before React) |
| `artifacts/clearpath-auto/public/404.html` | GitHub Pages SPA redirect — encodes path into query string |
| `artifacts/clearpath-auto/vite.config.ts` | Reads `PORT` and `BASE_PATH` env vars |
| `cloudflare-worker/src/index.ts` | Cloudflare Worker source (deployed separately to Cloudflare dashboard) |

---

## Replit secrets (environment variables)

| Secret | Used where | Notes |
|--------|-----------|-------|
| `VITE_SUPABASE_URL` | Frontend + scripts | Safe to expose in client |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Public by design, RLS protects data |
| `SUPABASE_SERVICE_ROLE_KEY` | Scripts/migrations only | Bypasses RLS — never prefix with `VITE_` |
| `VITE_WORKER_URL` | Frontend (Request.tsx) | Cloudflare Worker endpoint |
| `GITHUB_TOKEN` | Git Data API push | For deploying to GitHub Pages |
| `SESSION_SECRET` | API server | Express session signing |

Check if a secret is set without printing it: `echo "${MY_SECRET:+set}"`

---

## Build command

```bash
PORT=3000 BASE_PATH=/clearpath-auto/ NODE_ENV=production \
  pnpm --filter @workspace/clearpath-auto run build
```

Output goes to `artifacts/clearpath-auto/dist/public/`. Typical files:
```
dist/public/
  index.html          ← references hashed JS/CSS
  404.html
  favicon.png
  opengraph.jpg
  robots.txt
  sitemap.xml
  assets/
    index-XXXX.css    ← hash changes every rebuild
    index-XXXX.js     ← hash changes every rebuild
```

**Critical:** The JS and CSS filenames change on every rebuild. The old hashed file must be deleted from the GitHub repo in the same commit that adds the new one, and `index.html` must be updated.

---

## GitHub Pages deployment

The GitHub repo (`hwfl850/clearpath-auto`) contains **only the 8 static build files** — no source code, no node_modules, no images. Replit is not a git clone of the Pages repo; all pushes use the GitHub Git Data API via `gh api`.

### Check what's currently in the repo
```bash
GH_TOKEN="$GITHUB_TOKEN" gh api \
  "repos/hwfl850/clearpath-auto/git/trees/main?recursive=1" \
  --jq '.tree[] | select(.type=="blob") | .path'
```

### Full push workflow

```bash
REPO="hwfl850/clearpath-auto"

# 1. Get current HEAD and tree SHA
HEAD=$(GH_TOKEN="$GITHUB_TOKEN" gh api repos/$REPO/git/ref/heads/main --jq '.object.sha')
BASE_TREE=$(GH_TOKEN="$GITHUB_TOKEN" gh api repos/$REPO/git/commits/$HEAD --jq '.tree.sha')

# 2a. Small file blob (inline — only for files under ~1 MB)
BLOB=$(GH_TOKEN="$GITHUB_TOKEN" gh api repos/$REPO/git/blobs \
  --method POST -f encoding=base64 \
  -f content="$(base64 -w0 dist/public/index.html)" \
  --jq '.sha')

# 2b. Large file blob (temp file — REQUIRED for CSS/JS bundles > ~1 MB)
base64 -w0 dist/public/assets/index-XXXX.js > /tmp/js_b64.txt
JS_BLOB=$(GH_TOKEN="$GITHUB_TOKEN" gh api repos/$REPO/git/blobs \
  --method POST -f encoding=base64 \
  --field "content=@/tmp/js_b64.txt" \
  --jq '.sha')

# 3. Create new tree (sha:null = delete file)
NEW_TREE=$(GH_TOKEN="$GITHUB_TOKEN" gh api repos/$REPO/git/trees \
  --method POST --input - << 'JSON' | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');process.stdout.write(JSON.parse(d).sha)"
{
  "base_tree": "<BASE_TREE_SHA>",
  "tree": [
    {"path":"index.html","mode":"100644","type":"blob","sha":"<BLOB>"},
    {"path":"assets/index-NEW.js","mode":"100644","type":"blob","sha":"<JS_BLOB>"},
    {"path":"assets/index-OLD.js","mode":"100644","type":"blob","sha":null}
  ]
}
JSON

# 4. Create commit
NEW_COMMIT=$(GH_TOKEN="$GITHUB_TOKEN" gh api repos/$REPO/git/commits \
  --method POST --input - << JSON | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');process.stdout.write(JSON.parse(d).sha)"
{"message":"deploy: description of changes","tree":"$NEW_TREE","parents":["$HEAD"]}
JSON

# 5. Advance branch
GH_TOKEN="$GITHUB_TOKEN" gh api repos/$REPO/git/refs/heads/main \
  --method PATCH -f sha=$NEW_COMMIT --jq '.object.sha'
```

GitHub Pages rebuilds automatically after each push (GitHub Actions). Takes ~1–2 minutes to go live.

---

## SPA routing (GitHub Pages + Wouter)

GitHub Pages has no server-side routing. Reloading `/clearpath-auto/request` would 404 without the redirect chain.

### How it works

1. GitHub serves `404.html` for any unmatched path
2. `404.html` encodes the path into the query string and redirects to `index.html`:
   - `/clearpath-auto/request?model=ford-bronco` → `/clearpath-auto/?/request&model=ford-bronco`
3. `index.html` contains a script (before React loads) that decodes it back:
   - Detects `?/` prefix, reconstructs `/clearpath-auto/request?model=ford-bronco`
   - Uses `history.replaceState` so the URL is correct when Wouter initializes
4. Wouter is configured with `base={import.meta.env.BASE_URL.replace(/\/$/, "")}` = `"/clearpath-auto"`

### Critical decode script bug (already fixed)
The decode script must reconstruct query params with `?key=val` not `&key=val`. The `&` separator from the encoded URL must become `?` when placed after the path. This is already correct in `artifacts/clearpath-auto/index.html`.

### ScrollToTop
Wouter does not reset scroll on route changes. `App.tsx` has a `ScrollToTop` component that calls `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` on every location change.

---

## Supabase

**Project ref:** `miqpjypfjyctxcnivwdr`
**URL:** `https://miqpjypfjyctxcnivwdr.supabase.co`

### `vehicles` table columns
- `slug` (text, unique) — e.g. `jeep-wrangler`
- `make`, `model`, `year`, `trim`, `category` (`Truck | SUV | Car`)
- `tagline`, `description` (text)
- `image_url`, `gallery_urls` (text[])
- `specs` (jsonb — key/value display pairs)
- `available` (boolean) — only available=true vehicles are shown
- `sort_order` (int) — display order
- `featured` (boolean) — if column exists; otherwise slug fallback in code

### Vehicle images
Stored in Supabase Storage `vehicles` bucket. URL pattern:
```
https://miqpjypfjyctxcnivwdr.supabase.co/storage/v1/object/public/vehicles/<slug>.jpg
```
Do NOT import vehicle JPGs locally — they live in Supabase Storage only.

### Vehicle cache
`vehiclesApi.ts` caches results in `localStorage` under key `clearpath_vehicles_v2` for 15 minutes. Clear from browser console: `localStorage.removeItem("clearpath_vehicles_v2")` or call `clearVehicleCache()`.

### Featured vehicles fallback
If the `featured` column doesn't exist in the DB, the code falls back to a hardcoded slug list `["jeep-wrangler", "ford-bronco", "ram-1500"]` in `vehiclesApi.ts`. The `fetchFeaturedVehicles()` function handles both cases transparently.

### DDL from Replit
PostgREST (Supabase REST API) **cannot run DDL**. For schema changes:
1. **Preferred:** Supabase Dashboard → SQL Editor — paste and run SQL
2. `psql "$SUPABASE_DB_URL"` — only if the secret exists and is exported to bash: `echo "${SUPABASE_DB_URL:+set}"`
3. **Workaround:** filter in app code instead of adding a DB column

### Supabase JS client from bash (for one-off scripts)
```bash
# Find installed version first:
ls /home/runner/workspace/node_modules/.pnpm/ | grep supabase+supabase-js

# Then use the CJS build:
node -e "
const { createClient } = require('/home/runner/workspace/node_modules/.pnpm/@supabase+supabase-js@2.108.2/node_modules/@supabase/supabase-js/dist/index.cjs');
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
sb.from('vehicles').select('slug,sort_order,featured').order('sort_order')
  .then(({data,error}) => { console.log(data); console.error(error); });
"
```

---

## Contact form (Cloudflare Worker + Resend)

### Architecture
```
Request.tsx form → POST to VITE_WORKER_URL → Cloudflare Worker → Resend API → email inbox
```

### Cloudflare Worker
- Source lives in `cloudflare-worker/src/index.ts` (reference only — deployed via Cloudflare dashboard)
- Worker URL is stored as `VITE_WORKER_URL` Replit secret
- Worker env vars (set in Cloudflare dashboard, not Replit):
  - `RESEND_API_KEY` — from Resend dashboard (mark as secret/encrypted)
  - `FROM_EMAIL` — `onboarding@resend.dev` (Resend sandbox, no domain verification needed) or verified domain address
  - `TO_EMAIL` — destination inbox

### Resend sender notes
- `onboarding@resend.dev` works immediately without domain verification, but recipient must be your verified Resend email
- For custom domain: add domain in Resend → add SPF/DKIM/DMARC DNS records → update `FROM_EMAIL`

### Frontend fallback
If `VITE_WORKER_URL` is not set, the form shows a fallback error message with a direct contact email.

---

## Dev server (Replit preview)

The app runs in preview at the Replit dev URL. The workflow is `artifacts/clearpath-auto: web`.

To restart: use the Replit `WorkflowsRestart` tool with name `"artifacts/clearpath-auto: web"`.

Dev URL via bash: `curl http://localhost:80/` (the shared proxy routes at port 80).

---

## Known gotchas

| Issue | Fix |
|-------|-----|
| JS hash changes every build | Always check old filename in repo before pushing; delete it in the same tree commit |
| Large files fail inline upload | `base64 -w0 file.js > /tmp/b64.txt` then `--field "content=@/tmp/b64.txt"` |
| SPA 404 on direct URL/reload | `404.html` redirect + `index.html` decode script (both already in place) |
| Query params lost after SPA redirect | Decode script reconstructs `?key=val` correctly — don't break this |
| Vehicle of Interest dropdown blank | `Request.tsx` sets the value only after `vehicleOptions` loads (Radix Select timing issue) |
| `SUPABASE_DB_URL` not in bash | Check `echo "${SUPABASE_DB_URL:+set}"`; use Dashboard SQL Editor if unset |
| Vehicle images in bundle | Never import vehicle JPGs locally — always use Supabase Storage URLs |
| Favicon 404 | `index.html` uses `href="/favicon.png"` (no base path prefix in source); Vite prepends `BASE_PATH` at build time |
| `python3` not available in bash | Use `node -e` to parse JSON instead |

---

## Common tasks

### Rebuild and deploy to GitHub Pages
```bash
# 1. Build
PORT=3000 BASE_PATH=/clearpath-auto/ NODE_ENV=production \
  pnpm --filter @workspace/clearpath-auto run build

# 2. Check current repo state
GH_TOKEN="$GITHUB_TOKEN" gh api \
  "repos/hwfl850/clearpath-auto/git/trees/main?recursive=1" \
  --jq '.tree[] | select(.type=="blob") | .path'

# 3. Push (see full workflow above)
```

### Add a new vehicle
1. Upload image to Supabase Storage `vehicles` bucket as `<slug>.jpg`
2. Insert a row in the `vehicles` table via Supabase Dashboard → Table Editor or SQL Editor
3. Clear the browser localStorage cache or wait 15 minutes for automatic expiry

### Run TypeScript check (no build needed)
```bash
pnpm --filter @workspace/clearpath-auto run typecheck
```

### Update the Cloudflare Worker
Edit `cloudflare-worker/src/index.ts`, then paste the updated code into the Cloudflare dashboard Worker editor and redeploy. The `wrangler.toml` is for reference but deployment is manual via the dashboard from this setup.
