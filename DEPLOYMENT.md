# INTRU E-commerce - Deployment Guide

## 🚀 Cloudflare Pages Deployment

This guide will walk you through deploying the INTRU e-commerce store to Cloudflare Pages with D1 database.

### Prerequisites

1. **Cloudflare Account** - Sign up at https://cloudflare.com if you don't have one
2. **Cloudflare API Token** - Required for deployment
3. **Wrangler CLI** - Already installed in the project

---

## Step 1: Setup Cloudflare API Token

1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Set permissions:
   - Account → Cloudflare Pages → Edit
   - Account → D1 → Edit
5. Copy the API token

### Configure Wrangler

```bash
# Login to Cloudflare
npx wrangler login

# Or set the API token directly
export CLOUDFLARE_API_TOKEN=your_token_here
```

---

## Step 2: Create Production D1 Database

```bash
# Create the database
npx wrangler d1 create intru-db

# You'll get output like:
# [[d1_databases]]
# binding = "DB"
# database_name = "intru-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Copy the database_id
```

### Update wrangler.jsonc

Replace the placeholder database_id in `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "intru-db",
      "database_id": "YOUR_ACTUAL_DATABASE_ID_HERE"
    }
  ]
}
```

---

## Step 3: Apply Migrations to Production

```bash
# Apply database schema to production
npm run db:migrate:prod

# Expected output:
# ✅ Successfully applied 1 migration
```

---

## Step 4: Seed Production Database

```bash
# Load initial data (products and pages)
npx wrangler d1 execute intru-db --file=./seed.sql

# Verify data
npx wrangler d1 execute intru-db --command="SELECT COUNT(*) as count FROM products"
# Should return: count: 6
```

---

## Step 5: Create Cloudflare Pages Project

```bash
# Create the Pages project
npx wrangler pages project create intru-store --production-branch main

# Or via dashboard:
# 1. Go to Pages → Create a project
# 2. Connect to Git (GitHub)
# 3. Select repository: Kbs-sol/intru-store
# 4. Branch: main
```

---

## Step 6: Deploy to Production

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod

# Or manually:
npx wrangler pages deploy dist --project-name intru-store

# Expected output:
# ✨ Success! Deployed to:
# https://intru-store.pages.dev
```

---

## Step 7: Configure Environment Variables (Optional)

If you need environment variables for OAuth or other services:

```bash
# For Google OAuth
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name intru-store

# For Instagram OAuth
npx wrangler pages secret put INSTAGRAM_CLIENT_ID --project-name intru-store
npx wrangler pages secret put INSTAGRAM_CLIENT_SECRET --project-name intru-store

# For Razorpay (if using API)
npx wrangler pages secret put RAZORPAY_KEY_ID --project-name intru-store
npx wrangler pages secret put RAZORPAY_KEY_SECRET --project-name intru-store

# List secrets
npx wrangler pages secret list --project-name intru-store
```

---

## Step 8: Setup Custom Domain (Optional)

### Via Cloudflare Dashboard

1. Go to Pages → intru-store → Custom domains
2. Click "Set up a custom domain"
3. Enter your domain (e.g., shop.intru.in)
4. Follow DNS instructions

### Via CLI

```bash
npx wrangler pages domain add shop.intru.in --project-name intru-store
```

---

## Step 9: Verify Deployment

1. **Visit your site:**
   - Production: `https://intru-store.pages.dev`
   - Custom domain: `https://shop.intru.in`

2. **Test features:**
   - ✅ Homepage loads with products
   - ✅ Product pages work
   - ✅ Cart functionality
   - ✅ Authentication (email login)
   - ✅ Admin dashboard (login as admin@intru.in)
   - ✅ Page content (brand story, terms, privacy, returns)

3. **Check database:**
```bash
# Verify products
npx wrangler d1 execute intru-db --command="SELECT name, price FROM products"

# Verify pages
npx wrangler d1 execute intru-db --command="SELECT slug, title FROM pages"

# Check users (after first login)
npx wrangler d1 execute intru-db --command="SELECT email, provider FROM users"
```

---

## Step 10: Configure OAuth Providers

### Google One Tap

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `https://intru-store.pages.dev`
   - `https://shop.intru.in` (if using custom domain)
6. Copy Client ID
7. Update in `src/index.tsx`:
```typescript
// Replace YOUR_GOOGLE_CLIENT_ID with actual Client ID
data-client_id="YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com"
```

### Instagram OAuth

1. Go to https://developers.facebook.com/
2. Create Instagram App
3. Add Instagram Basic Display product
4. Configure OAuth redirect URIs:
   - `https://intru-store.pages.dev/auth/instagram/callback`
5. Copy App ID and Secret
6. Update OAuth flow in `public/static/app.js`

---

## Step 11: Setup Razorpay Payment Links

1. Sign up at https://razorpay.com/
2. Go to Payment Pages or Payment Links
3. Create payment button/link for each product
4. Copy the Razorpay link
5. Update via Admin Dashboard:
   - Login as admin@intru.in
   - Go to Admin → Products
   - Edit each product
   - Paste Razorpay link
   - Save

---

## Continuous Deployment

### Automatic Deployments via GitHub

Once connected to GitHub, Cloudflare Pages will automatically deploy:
- ✅ Every push to `main` branch → Production
- ✅ Pull requests → Preview deployments

### Manual Deployments

```bash
# Deploy latest changes
git push origin main

# Or manually build and deploy
npm run build
npm run deploy:prod
```

---

## Monitoring & Analytics

### Cloudflare Analytics (Free)

1. Go to Pages → intru-store → Analytics
2. View:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Top pages

### Add Google Analytics

Add to `src/index.tsx` in the `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Troubleshooting

### Deployment Fails

```bash
# Check wrangler version
npx wrangler --version

# Re-authenticate
npx wrangler login

# Check logs
npx wrangler pages deployment tail --project-name intru-store
```

### Database Issues

```bash
# Check database status
npx wrangler d1 info intru-db

# Reset database (WARNING: deletes all data)
npx wrangler d1 execute intru-db --command="DROP TABLE IF EXISTS users"
npm run db:migrate:prod
npx wrangler d1 execute intru-db --file=./seed.sql
```

### Build Errors

```bash
# Clean build
rm -rf node_modules dist .wrangler
npm install
npm run build
```

---

## Production Checklist

Before going live, verify:

- [ ] D1 database created and migrated
- [ ] Initial products seeded
- [ ] Pages content populated
- [ ] Google OAuth configured
- [ ] Instagram OAuth configured (or disabled)
- [ ] Razorpay links added to products
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)
- [ ] Admin account accessible
- [ ] Test checkout flow
- [ ] Mobile responsive
- [ ] SEO meta tags
- [ ] Error pages work
- [ ] HTTPS enabled
- [ ] CORS configured

---

## Cost Estimation (Cloudflare Free Tier)

- **Cloudflare Pages:** Unlimited requests, 100,000 builds/month
- **D1 Database:** 5GB storage, 5M reads/day, 100K writes/day
- **Total Cost:** $0/month for small to medium traffic

### When to Upgrade

Consider paid plans when:
- More than 100K builds/month needed
- Database exceeds 5M reads/day
- Need advanced features (Analytics, Workers)

---

## Support

For deployment issues:
- GitHub Issues: https://github.com/Kbs-sol/intru-store/issues
- Cloudflare Community: https://community.cloudflare.com/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/

---

**Deployment Guide Version:** 1.0.0  
**Last Updated:** February 8, 2026  
**Status:** ✅ Production Ready
