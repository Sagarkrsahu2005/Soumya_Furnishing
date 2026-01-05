# Quick Deployment Checklist ✅

## Pre-Deployment Setup

### 1. Database Setup
- [ ] Go to Vercel → Storage → Create Postgres Database
- [ ] Name it: `soumya-furnishings-db`
- [ ] Region: Mumbai/Singapore
- [ ] Note down the connection strings

### 2. Environment Variables in Vercel
Go to: Vercel → Project → Settings → Environment Variables

Add these for **Production**, **Preview**, and **Development**:

```
DATABASE_URL=<from Vercel Postgres>
DIRECT_URL=<from Vercel Postgres>
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_API_VERSION=2025-01
ADMIN_SECRET=<generate with: openssl rand -base64 32>
```

### 3. Code Updates
- [x] Updated `prisma/schema.prisma` to use PostgreSQL
- [x] Added `vercel.json` configuration
- [x] Updated `package.json` with build scripts
- [x] Created `/api/admin/import` endpoint
- [x] Created deployment guide

### 4. Commit & Push
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

## Post-Deployment

### 5. Wait for Build
- [ ] Check Vercel dashboard for deployment status
- [ ] Build should complete in 2-3 minutes
- [ ] Check logs for any errors

### 6. Import Products
Run this command (replace values):
```bash
curl -X POST https://your-domain.vercel.app/api/admin/import \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-ADMIN_SECRET"}'
```

### 7. Verify
- [ ] Visit https://your-domain.vercel.app
- [ ] Check /products page - should show 600+ products
- [ ] Test category pages: /categories/bedding, /categories/cushions
- [ ] Check cart functionality
- [ ] Test on mobile

## Environment Variables Reference

| Variable | Where to Get | Example |
|----------|--------------|---------|
| DATABASE_URL | Vercel Postgres Dashboard | postgresql://... |
| DIRECT_URL | Vercel Postgres Dashboard | postgresql://... |
| SHOPIFY_STORE_DOMAIN | Shopify Admin | yourstore.myshopify.com |
| SHOPIFY_ADMIN_ACCESS_TOKEN | Shopify Admin → Apps → Create Private App | shpat_xxxxx |
| SHOPIFY_API_VERSION | Latest version | 2025-01 |
| ADMIN_SECRET | Generate: openssl rand -base64 32 | random string |

## Common Issues

### Products Not Showing
**Solution:** Run the import API endpoint
```bash
curl -X POST https://your-domain.vercel.app/api/admin/import \
  -H "Content-Type: application/json" \
  -d '{"secret": "YOUR_ADMIN_SECRET"}'
```

### Build Fails
**Check:**
1. All environment variables are set
2. DATABASE_URL is valid
3. Check build logs in Vercel

**Fix:**
- Redeploy from Vercel dashboard
- Check logs for specific error

### Database Connection Error
**Solution:**
1. Verify DATABASE_URL in Vercel settings
2. Make sure using POSTGRES_PRISMA_URL (pooled connection)
3. Check database is active in Vercel Storage

## Quick Commands

### Local Development
```bash
pnpm dev                  # Start dev server
pnpm prisma studio        # View database
pnpm import:shopify       # Import from Shopify
pnpm categorize           # Auto-categorize products
```

### Production
```bash
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel logs              # View production logs
vercel env pull          # Pull env variables
```

## Support Links
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Site loads at your Vercel URL
- ✅ /products page shows all 600+ products
- ✅ Category pages work and show filtered products
- ✅ Product detail pages load correctly
- ✅ Add to cart works
- ✅ Cart persists across page reloads
- ✅ Mobile responsive
- ✅ No console errors

**Next Steps:** Payment integration → User authentication → Order management
