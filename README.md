# BAIANAT

Bilingual (English / Arabic) ecommerce storefront built with Next.js App Router.

BAIANAT catalogues products and categories from [DummyJSON](https://dummyjson.com), with URL-driven discovery, rich product details, and RTL-ready UI.

## Tech stack

- Next.js 16 (App Router, Server Components)
- TypeScript
- Tailwind CSS
- next-intl (EN / AR + locale routing)
- Zod (API response validation)
- Vitest / ESLint / Prettier

## Features

- Home banner slider and latest products
- Product catalogue with search, sort, category and updated filters, pagination
- Image-driven categories showcase with product counts
- Product detail page: gallery, specs, reviews, related products, JSON-LD SEO
- Locale-aware metadata, canonical URLs, hreflang, sitemap.xml, and robots.txt
- Sticky app shell with locale flag switcher and mobile navigation
- Cart and wishlist (guest, client-side)
- Demo authentication (login / logout) required only for checkout access
- Demo checkout with simulated payment and local order confirmation

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) (or `/ar` for Arabic).

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Description |
|----------|-------------|
| `PRODUCTS_API_URL` | DummyJSON API base URL (server-only). Default: `https://dummyjson.com` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for metadata / Open Graph. Default: `http://localhost:3000` |

Do not commit `.env.local`.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve production build
npm test         # Vitest unit tests
npm run lint     # ESLint
```

## Architecture notes

- Feature modules under `src/features/` (products, home, cart, wishlist, auth, checkout)
- External HTTP goes through `src/lib/api/http.ts` with Zod schemas and mappers into domain types
- Listing state is driven by URL search params (`ProductQuery`)
- UI never consumes raw DummyJSON DTOs

## Authentication (demo scope)

Authentication is a **client-side demo session** backed by DummyJSON `POST /auth/login`. The access token is stored in localStorage via Zustand — this is **not** production-secure auth (no HttpOnly cookies, no server-side session validation).

- Guest users can browse, search, use cart and wishlist
- Checkout requires a signed-in session (client-side `AuthGuard`)
- Registration UI is present but intentionally not connected to a real account backend (DummyJSON does not persist new users)
- Demo login: any user from [DummyJSON users](https://dummyjson.com/users), e.g. username `emilys` / password `emilyspass`

## Checkout (demo scope)

Checkout is a **local demo flow**:

- Shipping and payment UI are client-side only
- Payment methods are simulated (no Stripe, PayPal, or card data collection)
- Placed orders are stored as a lightweight latest-order snapshot in localStorage
- There is no real payment gateway or backend order persistence
