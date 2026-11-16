# Shoemate

Premium sneaker store — client-side frontend only. No backend yet.

Home, Shop, Categories, New Arrivals, Deals, About, product pages, cart,
demo sign-in and demo checkout. Cart and wishlist live in `localStorage`.
Promo code `SHOEMATE10` = 10% off, free shipping above $150.

## Stack

Svelte 5.57.3 + SvelteKit 3.2.0 + Vite 8.3.8 + TypeScript + Tailwind CSS 4.3.5
+ `@sveltejs/adapter-static` (prerendered, output `build/`). Icons: Phosphor
(`phosphor-svelte`), no Lucide.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build   # output: build/
npm run check   # svelte-check, 0 errors
```

## Backend later

The frontend is API-driven from day one through `src/lib/api.ts`. It uses
local data until `VITE_API_BASE` is set — then the same calls hit the Go
REST API. No other file needs to change for the swap.

## Deploy

Cloudflare Pages, via GitHub Actions (`.github/workflows/deploy-cloudflare-pages.yml`,
project `shoemate`, live at `https://shoemate.pages.dev`).

Required GitHub secrets (repo > Settings > Secrets and variables > Actions):
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
