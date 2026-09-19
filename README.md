# BAIANAT

Interview take-home: a bilingual (English / Arabic) ecommerce storefront. Brand name **BAIANAT** (Arabic: **بيان**).

The app catalogues products and categories from [DummyJSON](https://dummyjson.com), with URL-driven discovery, cart/wishlist, demo auth, demo checkout, and RTL-ready UI.

## Features

- EN / AR locales with always-prefixed routes (`/en`, `/ar`) and RTL for Arabic
- Home banner slider and latest products
- Product catalogue with search, sort, category and updated filters, pagination
- Image-driven categories showcase with product counts
- Product detail page: gallery, sale pricing, availability, specs, reviews, related products
- Guest cart and wishlist (client-side, persisted)
- Demo authentication (login / logout); checkout requires a signed-in session
- Demo checkout with simulated payment and local order confirmation
- SEO: locale-aware metadata, canonical / hreflang, Product JSON-LD, sitemap, robots
- Accessibility: skip link, focus-visible controls, decorative image alts, dialog/sheet close labels

## Tech stack

- Next.js 16 (App Router, Server Components)
- React 19
- TypeScript
- Tailwind CSS 4
- next-intl (EN / AR + locale routing)
- Zustand (persisted client stores)
- React Hook Form + Zod
- Vitest / ESLint / Prettier
- Radix primitives with shadcn-style UI under `src/components/ui`

## Architecture

```text
src/
  app/[locale]/          # Routes, layouts, loading/error/not-found
  components/            # Shared layout + UI primitives
  features/
    products/            # Catalogue, categories, PDP, API, schemas, mappers
    home/                # Banner / home sections
    cart/                # Cart store + UI
    wishlist/            # Wishlist store + UI
    auth/                # Demo login, guards, safe redirect
    checkout/            # Demo checkout + order snapshot
  i18n/                  # next-intl routing + navigation helpers
  lib/
    api/                 # HTTP client + error types
    seo/                 # Metadata, JSON-LD, sitemap builders, URLs
    store/               # Hydration helpers
  messages/              # en / ar message catalogues
```

**Boundaries**

- Feature modules own domain UI, stores, and product/auth/checkout logic
- External HTTP goes through `src/lib/api` → Zod schema → mapper → domain types
- UI never consumes raw DummyJSON DTOs
- Server Components fetch catalogue data; Client Components own cart, wishlist, auth, and checkout forms
- Listing state is driven by URL search params (`ProductQuery`)

## Data source

Catalogue data is loaded from DummyJSON via `PRODUCTS_API_URL` (see [API Source & Technical Decision](#api-source--technical-decision)). Product titles, descriptions, and reviews remain English from the API even on `/ar` routes.

## API Source & Technical Decision

### Original API Requirement

The original take-home specification (project codename BAYAN) requested [Fake Store API](https://fakestoreapi.com/) as the product catalogue source. Early implementation integrated Fake Store through the application’s server-side data layer: Next.js Server Components calling a shared HTTP client, with Zod validation and mappers into the internal product domain.

### Server-Side Connectivity Issue

During development, Fake Store endpoints were reachable from a normal browser request and returned valid JSON. The same URLs, when requested from the local Next.js / Node.js runtime via server-side `fetch`, consistently failed.

The observed error was `ECONNRESET`, surfaced as `TypeError: fetch failed` in the shared HTTP layer. This was specifically observed for server-side requests to Fake Store API in this project’s environment — not treated as evidence that the API is globally unavailable.

### Troubleshooting

Before changing the data source, the failure path was investigated with approaches including:

- Direct browser access to Fake Store endpoints
- Node.js `fetch` and Next.js server-side `fetch`
- Direct `curl` requests
- Alternative HTTP configurations, including browser-like headers / User-Agent and HTTP/1.1
- Requests outside the application UI
- Verification of the configured API base URL
- Independent network connectivity checks
- Requests to other external HTTPS APIs from the same runtime

Browser requests to Fake Store succeeded, while server-side Node.js / Next.js requests consistently reset. Other HTTPS APIs remained reachable from the same environment, which helped isolate the issue to the server-side connection path to Fake Store rather than to BAIANAT’s layered architecture itself.

### Decision

BAIANAT’s data flow is intentionally:

UI → feature API layer → shared HTTP client → external API → Zod validation → DTO mapper → domain model

Because the server-side runtime could not reliably reach Fake Store, keeping that source would block reliable Server Component rendering of catalogue and product data. The project did **not** bypass the architecture by moving all catalogue calls to the browser solely to keep Fake Store. Instead, the intended server-side fetching model was preserved and another public product API was selected that worked with the same approach.

### Why DummyJSON

For the scope of this project, DummyJSON provided the closest practical fit for the required product catalogue functionality after evaluating the requirements and the server-side connectivity constraint.

Relevant capabilities include:

- Public product catalogue API
- Product listing and individual product endpoints
- Category endpoints and product-by-category support
- Search, sorting, and pagination support
- Product metadata, images, and ratings
- Compatibility with server-side `fetch` in the Next.js environment used here

The API also supplies enough realistic ecommerce data for a take-home storefront. DummyJSON was the most suitable practical alternative for this project — not a claim that it is objectively the best API in the ecosystem.

Official reference: [DummyJSON Products documentation](https://dummyjson.com/docs/products).

### Architecture Preservation

Replacing the external API did **not** change the application’s core architecture. BAIANAT still uses:

- Server Components for catalogue data where appropriate
- Feature-based modules (`features/products`, shared `lib/api`)
- A dedicated product API layer and HTTP abstraction
- Zod response validation, DTOs, mappers, and domain models
- Next.js fetch caching / revalidation tags
- `next/image` and TypeScript throughout

Only the external API adapter / data source changed. That separation keeps the UI and domain model independent of any single vendor’s response contract.

### Data Mapping

DummyJSON’s response shape differs from Fake Store’s. Responses are not passed raw to UI components. They are validated and mapped into BAIANAT’s internal models:

```text
DummyJSON API
    ↓
External DTO
    ↓
Zod validation
    ↓
Mapper
    ↓
BAIANAT Product domain model
    ↓
UI
```

Examples from the current mapper:

- `thumbnail` → domain `image`
- numeric `rating` + review list length → `rating.rate` / `rating.count`
- category string → internal `Category`
- detail fields such as `images`, warranty / shipping / return copy, dimensions, and reviews → `ProductDetails`

### References

- Original requirement: [Fake Store API](https://fakestoreapi.com/)
- Current catalogue source: [DummyJSON Products](https://dummyjson.com/docs/products)

## Authentication (demo)

Authentication is a **client-side demo session** via DummyJSON `POST /auth/login`. The access token is stored in `localStorage` through Zustand — this is **not** production-secure auth (no HttpOnly cookies, no server-side session validation).

- Guests can browse, search, use cart and wishlist
- Checkout requires a signed-in session (client-side `AuthGuard`)
- Logout clears the session only — cart and wishlist are kept
- Registration UI exists but does not create persisted accounts (DummyJSON limitation)
- Demo login: any user from [DummyJSON users](https://dummyjson.com/users), e.g. username `emilys` / password `emilyspass`

## Checkout (demo)

Checkout is a **local demo flow**:

- Shipping and payment UI are client-side only
- Payment methods are simulated (no real card processing)
- Placed orders are stored as a latest-order snapshot in `localStorage`
- Successful checkout clears the cart; there is no backend order history

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable               | Required              | Description                                                                                                   |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `PRODUCTS_API_URL`     | No (defaults)         | DummyJSON API base URL (server-only). Default: `https://dummyjson.com`                                        |
| `NEXT_PUBLIC_SITE_URL` | **Yes in production** | Canonical site origin for metadata, Open Graph, sitemap, and robots. Default locally: `http://localhost:3000` |

On Vercel (or any host), set `NEXT_PUBLIC_SITE_URL` to the real deployment origin (no trailing slash), e.g. `https://your-app.vercel.app`. Do not leave the localhost default in production.

Do not commit `.env.local` or other secret env files.

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) (or `/ar` for Arabic).

## Scripts

```bash
npm run dev         # development server
npm run build       # production build
npm run start       # serve production build
npm test            # Vitest unit tests
npm run lint        # ESLint
npm run typecheck   # TypeScript (`tsc --noEmit`)
npm run format      # Prettier write
npm run format:check
```

## Validation

Before delivery, run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm audit
```

Then smoke the production server (`npm run start`) on `/en`, `/ar`, products, a PDP, cart, login, and checkout.

## Deployment

Suitable for Vercel (or any Node host that runs `next build` / `next start`):

1. Set `PRODUCTS_API_URL` if you are not using the DummyJSON default
2. Set `NEXT_PUBLIC_SITE_URL` to the live origin
3. Build with `npm run build`
4. Verify `/en`, `/ar`, `/sitemap.xml`, and `/robots.txt`

This repository does not claim a live public deployment.

## SEO

- `metadataBase`, per-locale titles/descriptions, canonical URLs, and `hreflang` alternates
- Product and breadcrumb JSON-LD (`serializeJsonLd` escapes `<` for XSS safety)
- `/sitemap.xml` and `/robots.txt` build from `NEXT_PUBLIC_SITE_URL`
- Private routes (login, register, cart, wishlist, checkout) are disallowed in robots and marked `noindex` where applicable

## Accessibility

- Skip-to-main-content link
- Keyboard-reachable controls with visible focus styles
- Localized close labels on sheets/dialogs; decorative images use empty alts
- Quantity steppers and wishlist toggles expose accessible names

## Known limitations

- Auth token in `localStorage` (demo only — not production-secure)
- DummyJSON catalogue content is English-only; Arabic UI chrome is translated
- Checkout payment and order persistence are simulated locally
- Cart and wishlist are client-only (not synced to a backend)
- No real payments, invoices, or multi-device order history
- Streamed `notFound()` / mid-stream `redirect()` may return HTTP 200 with client handling (Next.js App Router + `loading.tsx`); not-found UI and canonical tags still apply
- List-price sort vs displayed sale price is a known catalogue nuance (sort uses list price)
