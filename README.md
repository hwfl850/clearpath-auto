# ClearPath Auto

A no-haggle, nationwide car delivery service. Browse in-demand trucks and SUVs, get transparent pricing, and have your vehicle delivered to your door — no dealership games.

**Live site:** [https://hwfl850.github.io/clearpath-auto/](https://hwfl850.github.io/clearpath-auto/)

---

## What it does

- **Browse vehicles** — searchable, filterable inventory of trucks, SUVs, and cars with specs and photos
- **Request a price** — submit your contact info and vehicle of interest; we respond with a real below-sticker quote
- **How it works** — explains the simple 4-step process: pick, request, get a quote, take delivery

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui components
- Framer Motion animations
- Supabase for vehicle data and image storage
- Cloudflare Worker + Resend for contact form email delivery
- Hosted on GitHub Pages

## Pages

| Route | Page |
|-------|------|
| `/` | Home — hero, featured vehicles, how-it-works summary, CTA |
| `/vehicles` | Full vehicle browser with search and category filter |
| `/request` | Price request form; pre-selects vehicle from `?model=` query param |
| `/how-it-works` | Detailed walkthrough of the process |

## Repository structure

This repository contains **only the built static output** — the compiled HTML, CSS, and JavaScript bundle. Source code lives in a separate private Replit workspace.

```
/
├── index.html          — SPA entry point with path-restore script
├── 404.html            — GitHub Pages SPA routing redirect
├── favicon.png
├── opengraph.jpg
├── robots.txt
├── sitemap.xml
└── assets/
    ├── index-XXXX.css  — compiled styles (content-hashed)
    └── index-XXXX.js   — compiled app bundle (content-hashed)
```

## Deployment

GitHub Pages serves the `main` branch automatically. Every push to `main` triggers a GitHub Actions deployment. The site is live at `https://hwfl850.github.io/clearpath-auto/` within ~2 minutes of a push.

## Contact

Questions? Use the **Request a Price** form on the site — it goes directly to our inbox.
