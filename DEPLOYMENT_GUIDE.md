# Production Deployment Guide - Soumya Furnishings

Complete guide to deploy your e-commerce site with all 600+ products to production.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Shopify store credentials
- All code committed to GitHub

---

## STEP 1: Set Up Production Database (PostgreSQL)

### Option A: Vercel Postgres (Recommended - Easiest)

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Click on your project (Soumya Furnishings)

2. **Create Postgres Database**
   - Click on **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Choose a name: `soumya-furnishings-db`
   - Select region closest to your users (e.g., Mumbai/Singapore for India)
   - Click **Create**

3. **Connect Database to Project**
   - After creation, click **Connect Project**
   - Select your project: `Soumya Furnishings`
   - Vercel will automatically add these environment variables:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`

4. **Add to Local Development**
   - In Vercel, go to Settings → Environment Variables
   - Copy `POSTGRES_PRISMA_URL`
   - Create `.env.local` file in your project root:
   ```bash
   DATABASE_URL="your-postgres-prisma-url-here"
   DIRECT_URL="your-postgres-url-non-pooling-here"
   ```

### Option B: Neon Database (Alternative)

1. **Sign up at** https://neon.tech
2. **Create New Project**
   - Name: `soumya-furnishings`
   - Region: AWS Asia Pacific (Mumbai) or closest
3. **Copy Connection String**
   - Go to Dashboard → Connection Details
   - Copy the connection string (Pooled connection)
4. **Add to Vercel**
   - Go to Vercel → Settings → Environment Variables
   - Add:
     ```
     DATABASE_URL=postgresql://user:password@host/db?sslmode=require
     DIRECT_URL=postgresql://user:password@host/db?sslmode=require
     ```

---

## STEP 2: Update Prisma Configuration

The schema is already updated to use PostgreSQL. Just verify your `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## STEP 3: Configure Environment Variables in Vercel

### Add All Required Environment Variables

Go to Vercel → Your Project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

#### Database
```
DATABASE_URL=your-postgres-prisma-url
DIRECT_URL=your-postgres-url-non-pooling
```

#### Shopify Integration
```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxx
SHOPIFY_API_VERSION=2025-01
```

#### Admin Access
```
ADMIN_SECRET=create-a-random-secret-key-here
```

#### NextAuth (Optional - for user authentication)
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-random-32-char-string
```

**How to generate secrets:**
```bash
openssl rand -base64 32
```

---

## STEP 4: Prepare Local Database for Testing

1. **Install Prisma CLI globally** (if not already):
   ```bash
   pnpm add -g prisma
   ```

2. **Create local .env.local file**:
   ```bash
   # Copy from Vercel or use local PostgreSQL
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   
   # Shopify credentials
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
   SHOPIFY_API_VERSION=2025-01
   ```

3. **Run migration**:
   ```bash
   pnpm prisma migrate deploy
   ```

4. **Generate Prisma Client**:
   ```bash
   pnpm prisma generate
   ```

5. **Import products from Shopify**:
   ```bash
   pnpm import:shopify
   ```

6. **Categorize products**:
   ```bash
   pnpm categorize
   ```

7. **Verify products**:
   ```bash
   pnpm prisma studio
   ```
   - Open http://localhost:5555
   - Check Product table - should see 600+ products
   - Verify categories are assigned

---

## STEP 5: Update Build Configuration

Create/update `vercel.json` in project root:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "framework": "nextjs",
  "regions": ["bom1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "DIRECT_URL": "@direct_url"
  }
}
```

Update `package.json` scripts:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## STEP 6: Deploy to Vercel

### Method 1: Via Git (Recommended)

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Configure for production with PostgreSQL"
   git push origin main
   ```

2. **Automatic Deployment**:
   - Vercel will automatically detect the push
   - It will run migrations during build
   - Check deployment progress at: https://vercel.com/dashboard

### Method 2: Via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   pnpm add -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

---

## STEP 7: Import Products to Production Database

After successful deployment, you need to import products to production database.

### Option A: Manual Import via API Route

1. **Create import API endpoint** (already created at `/app/api/admin/import/route.ts`):

2. **Trigger import using curl or Postman**:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/admin/import \
     -H "Content-Type: application/json" \
     -d '{"secret": "your-ADMIN_SECRET-here"}'
   ```

### Option B: Run Import Script via Vercel CLI

1. **Connect to production**:
   ```bash
   vercel env pull .env.production
   ```

2. **Run import with production env**:
   ```bash
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) \
   SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.production | cut -d '=' -f2) \
   SHOPIFY_ADMIN_ACCESS_TOKEN=$(grep SHOPIFY_ADMIN_ACCESS_TOKEN .env.production | cut -d '=' -f2) \
   tsx scripts/import-shopify.ts
   ```

3. **Categorize products**:
   ```bash
   DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) \
   tsx scripts/categorize-products.ts
   ```

### Option C: Use Serverless Function (Recommended)

Create an admin dashboard to trigger imports from UI (will implement next if needed).

---

## STEP 8: Verify Production Deployment

1. **Check Database**:
   - Open Vercel → Storage → Your Database
   - Click "Data" tab
   - Verify products table has 600+ records

2. **Test Website**:
   - Visit: https://your-domain.vercel.app
   - Check: https://your-domain.vercel.app/products
   - Should see all products
   - Test category pages: `/categories/bedding`, `/categories/cushions`, etc.

3. **Check Logs**:
   - Vercel → Your Project → Logs
   - Look for any errors

---

## STEP 9: Post-Deployment Configuration

### Set Up Custom Domain (Optional)

1. **Go to Vercel** → Your Project → Settings → Domains
2. **Add domain**: `www.soumyafurnishings.com`
3. **Update DNS** with your domain registrar:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
4. **Wait for SSL** (automatic, takes 1-2 minutes)

### Enable Analytics

Already included via Vercel Analytics (`@vercel/analytics/next`).

### Set Up Monitoring

1. **Vercel Analytics**: Automatic
2. **Vercel Web Vitals**: Automatic
3. **Error Tracking**: Consider Sentry (optional)

---

## STEP 10: Ongoing Maintenance

### Update Products

**Automatic sync from Shopify**:
- Create a cron job or webhook to sync products
- Or manually trigger: `POST /api/admin/import`

**Manual update**:
```bash
pnpm import:shopify
```

### Database Backups

**Vercel Postgres**:
- Automatic daily backups
- Access via Vercel dashboard

**Neon**:
- Automatic backups on paid plans
- Manual export: Use Prisma Studio

### Monitor Performance

- Check Vercel Analytics dashboard
- Monitor database connection pool usage
- Watch for slow queries in Vercel logs

---

## 🔧 Troubleshooting

### Products Not Showing

**Check:**
1. DATABASE_URL is set in Vercel environment variables
2. Migration ran successfully (check build logs)
3. Products imported (check database in Vercel Storage tab)
4. API route working: Visit `/api/products` directly

**Fix:**
```bash
# Re-run migration
vercel env pull
pnpm prisma migrate deploy

# Re-import products
pnpm import:shopify
pnpm categorize
```

### Build Failures

**Common issues:**
- Missing environment variables → Add in Vercel Settings
- Prisma client not generated → Add `prisma generate` to build command
- Migration failed → Check schema syntax

**Fix:**
1. Check build logs in Vercel
2. Verify all env vars are set
3. Test locally first: `pnpm build`

### Database Connection Errors

**Check:**
- DATABASE_URL format is correct
- Connection pooling enabled (use POSTGRES_PRISMA_URL)
- Database is running (check Vercel Storage status)

**Fix:**
```bash
# Test connection locally
pnpm prisma db push
```

### Slow Performance

**Optimize:**
1. Add database indexes:
   ```prisma
   @@index([slug])
   @@index([category])
   @@index([price])
   ```
2. Enable caching
3. Optimize images with Next.js Image component
4. Use ISR (Incremental Static Regeneration) for product pages

---

## 📊 Database Schema Summary

Current tables:
- **Product**: 600+ products from Shopify
- **Image**: Product images
- **Variant**: Product variants
- **Collection**: Product collections
- **Customer**: Customer data
- **Order**: Order history
- **Admin**: Admin users

---

## 🎯 Next Steps After Deployment

1. ✅ **Site is live with all products**
2. 🔜 **Add payment integration** (Razorpay/Stripe)
3. 🔜 **Implement user authentication** (NextAuth)
4. 🔜 **Create checkout flow**
5. 🔜 **Set up email notifications** (Resend)
6. 🔜 **Add order management**

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

---

**🎉 Your site should now be live with all 600+ products!**

Visit: https://your-domain.vercel.app
