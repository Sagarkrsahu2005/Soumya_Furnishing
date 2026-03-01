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
Configure these in `.env.local` (see `.env.example` for template):

### Required
```bash
DATABASE_URL=postgresql://...
ADMIN_SECRET=your-secret-key
```

### Integrations (Optional)
```bash
# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Delhivery Shipping Partner
DELHIVERY_API_KEY=your-api-key
DELHIVERY_API_URL=https://track.delhivery.com/api

# Shopify (for migration)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx
```

See setup guides:
- [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md) - Payment gateway integration  
- [DELHIVERY_SETUP.md](DELHIVERY_SETUP.md) - Shipping & tracking integration  
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment

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
1. ✅ Phase 1: Mirror product catalog (done via seed)
2. ✅ Phase 2: Add inventory & order schema (completed)
3. ✅ Phase 3: Payment integration with Razorpay (completed)
4. ✅ Phase 4: Shipping integration with Delhivery (completed)
5. 🔄 Phase 5: Order management & fulfillment workflow (in progress)

## Integrations

### ✅ Razorpay Payment Gateway
- Online payments (Cards, UPI, Net Banking, Wallets)
- Cash on Delivery support
- See [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md) for setup

### ✅ Delhivery Shipping Partner
- Automatic shipment creation
- Real-time tracking
- Pincode serviceability check
- See [DELHIVERY_SETUP.md](DELHIVERY_SETUP.md) for setup

## Next Steps
- Implement order fulfillment workflow in admin panel
- Add email/SMS notifications for order updates
- Integrate inventory management
- Add search index (e.g., Meilisearch) for advanced filtering
- Implement customer reviews & ratings system
```bash
pnpm lint
```
# Soumya_Furnishing
