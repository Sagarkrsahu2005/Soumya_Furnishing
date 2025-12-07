# Soumya Furnishings

Production-ready Next.js app (Next 16, React 19).

## Requirements
- Node.js 20+
- pnpm 9+ (recommended)

## Install & Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Production Build

```bash
pnpm build
pnpm start
```

## Image Optimization
- Uses Next.js Image with local assets in `/public`.
- If you add remote images, update `next.config.mjs` `images.domains`.

## Environment Variables
Currently no required env vars. If you add any, create `.env.local` (not committed). Example:

```bash
NEXT_PUBLIC_ANALYTICS_ID=your-id
```

## Deploy
### Vercel (recommended)
- Import the repo on Vercel. Framework: Next.js; Build Command: `pnpm build`; Output: `.vercel/output` (handled automatically).
- Set Environment Variables in Vercel project settings.

### Docker
A minimal Dockerfile is provided:

```bash
# build image
docker build -t soumya-furnishings .
# run container
docker run -p 3000:3000 soumya-furnishings
```

## Linting
## Database (Migrating off Shopify)

This project now supports a local database via Prisma. Default dev setup uses SQLite; production should use Postgres.

### 1. Configure Environment
Add to `.env.local` (example in `.env.example`):
```
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public
```
For local dev (already in example):
```
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
```

### 2. Generate & Migrate
```
pnpm prisma:generate
pnpm prisma:migrate
```

### 3. Seed
```
pnpm seed
```

### 4. Switching to Postgres
Change `DATABASE_PROVIDER` to `postgresql` and set `DATABASE_URL`. Then run a fresh migration:
```
pnpm prisma:migrate --name init-postgres
pnpm seed
```

### 5. Importing Shopify Data
Export products from Shopify Admin (Products > Export) as CSV or JSON. Convert to the shape used in `scripts/seed.ts` and extend the seed script to parse the CSV and create products. (We can automate this next.)

## Migration Strategy From Shopify
1. Phase 1: Mirror product catalog (done via seed).
2. Phase 2: Add inventory & order schema (not yet implemented).
3. Phase 3: Replace cart & checkout with Stripe/Razorpay.

## Next Steps
- Add API routes (`app/api/products`) for external consumers.
- Implement search index (e.g., Meilisearch) for advanced filtering.
- Add inventory & order models.
- Add payment integration and order workflow.
```bash
pnpm lint
```
# Soumya_Furnishing
