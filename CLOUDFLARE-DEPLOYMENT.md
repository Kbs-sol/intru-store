# INTRU E-commerce - Cloudflare Deployment Guide

## 🚀 Complete Deployment to Cloudflare Pages with D1 Database

### Prerequisites
- ✅ Cloudflare account (Kbskumar331@gmail.com)
- ✅ API Token configured with permissions:
  - D1: Edit
  - Cloudflare Pages: Edit
  - Workers Scripts: Edit
  - Workers KV Storage: Edit
  - Workers R2 Storage: Edit
  - Account Settings: Read

---

## Option 1: Automated Deployment (Recommended)

### Step 1: Authenticate Wrangler

Open terminal in project directory (`/home/user/webapp`) and run:

```bash
# If you have the API token, set it as environment variable
export CLOUDFLARE_API_TOKEN='your-api-token-here'

# OR use interactive login (opens browser)
npx wrangler login
```

### Step 2: Run Deployment Script

```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

This script will:
1. ✅ Create D1 database (`intru-db`)
2. ✅ Run migrations
3. ✅ Seed products and pages
4. ✅ Build project
5. ✅ Create Cloudflare Pages project
6. ✅ Deploy application
7. ✅ Configure database bindings

---

## Option 2: Manual Step-by-Step Deployment

### Step 1: Authenticate

```bash
cd /home/user/webapp
npx wrangler login
```

### Step 2: Create D1 Database

```bash
npx wrangler d1 create intru-db
```

**Important**: Copy the `database_id` from the output. It looks like:
```
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 3: Update wrangler.jsonc

Open `wrangler.jsonc` and replace `placeholder-will-be-created-on-deployment` with your actual database ID:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "intru-db",
      "database_id": "your-actual-database-id-here"
    }
  ]
}
```

### Step 4: Run Migrations (Remote)

```bash
npx wrangler d1 migrations apply intru-db --remote
```

This creates these tables:
- `products` - 6 products from intru.in
- `pages` - Policy pages (Shipping, Returns, FAQ, etc.)
- `users` - Admin and customer accounts
- `sessions` - User sessions
- `cart_items` - Shopping cart

### Step 5: Seed Database (Remote)

```bash
npx wrangler d1 execute intru-db --remote --file=./seed.sql
```

This populates:
- ✅ 6 products with correct prices
- ✅ 6 policy pages with full content

### Step 6: Verify Database

```bash
# Check products
npx wrangler d1 execute intru-db --remote --command="SELECT id, name, price FROM products"

# Check pages
npx wrangler d1 execute intru-db --remote --command="SELECT slug, title FROM pages"
```

Expected output:
- 6 products (Doodles, Porsche, Orange Puff, etc.)
- 6 pages (shipping, returns, faq, terms, contact, privacy)

### Step 7: Build Project

```bash
npm run build
```

This creates the `dist/` directory with:
- `_worker.js` - Hono backend
- `_routes.json` - Routing config
- Static files from `public/`

### Step 8: Create Cloudflare Pages Project

```bash
npx wrangler pages project create intru-store \
  --production-branch main \
  --compatibility-date 2026-02-08
```

### Step 9: Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name intru-store
```

### Step 10: Configure D1 Binding (if needed)

```bash
npx wrangler pages deployment tail --project-name intru-store
```

---

## Option 3: Using Cloudflare Dashboard

### 1. Create D1 Database
1. Go to: https://dash.cloudflare.com/
2. Click **Workers & Pages** → **D1**
3. Click **Create Database**
4. Name: `intru-db`
5. Click **Create**
6. Copy the **Database ID**

### 2. Update wrangler.jsonc
Replace `placeholder-will-be-created-on-deployment` with your Database ID.

### 3. Run Migrations via Console
In D1 dashboard:
1. Open `intru-db` database
2. Go to **Console** tab
3. Paste and run migration files:
   - `migrations/0001_initial_schema.sql`
   - `migrations/0002_add_user_roles.sql`

### 4. Seed Data via Console
Paste and run `seed.sql` in the Console tab.

### 5. Create Pages Project
1. Go to **Workers & Pages** → **Pages**
2. Click **Create application**
3. Choose **Upload assets**
4. Name: `intru-store`
5. Upload the `dist/` folder

### 6. Configure Bindings
In Pages project settings:
1. Go to **Settings** → **Functions** → **D1 database bindings**
2. Add binding:
   - Variable name: `DB`
   - D1 database: `intru-db`
3. Save and redeploy

---

## Verification Checklist

After deployment, verify:

- [ ] Database exists: `npx wrangler d1 list | grep intru-db`
- [ ] 6 products in DB: `SELECT COUNT(*) FROM products`
- [ ] 6 pages in DB: `SELECT COUNT(*) FROM pages`
- [ ] Site deployed: Visit `https://intru-store.pages.dev`
- [ ] Products load: Visit `/` and see 6 products
- [ ] Policy pages work: Visit `/shipping`, `/returns`, `/faq`
- [ ] Admin login: Visit `/intruadmin`
- [ ] Initial setup: Use password `7@Intru`

---

## Deployment URLs

After deployment, your site will be available at:

### Production URL
```
https://intru-store.pages.dev
```

### Branch Deployments
```
https://main.intru-store.pages.dev
```

### Custom Domain (Optional)
Configure in Cloudflare Pages dashboard:
1. Go to **Custom domains**
2. Add your domain (e.g., `intru.in`)
3. Update DNS records as instructed

---

## Database Schema

### Products Table
- id, name, slug, description
- price, original_price
- image_url, image_url_2
- category, is_featured, is_active, stock
- razorpay_link (for Buy Now buttons)

### Pages Table
- slug, title, content (HTML)
- meta_title, meta_description
- is_active

### Users Table
- email, name, avatar_url
- provider (email, google, instagram)
- role (admin, customer)
- is_admin (0 or 1)

### Cart Items Table
- user_id, product_id, quantity
- price (at time of adding)

---

## Admin Access

### First Time Setup
1. Visit: `https://intru-store.pages.dev/intruadmin`
2. Email: `admin@intru.in` (or any email)
3. Password: `7@Intru`
4. Click "Login"
5. First admin account created!

### After Setup
- Master key `7@Intru` is **locked**
- Only registered admins can login
- Use email-based authentication

---

## Troubleshooting

### Issue: "Not authenticated"
**Solution**: Run `npx wrangler login` and authenticate in browser.

### Issue: "Database not found"
**Solution**: Create database using `npx wrangler d1 create intru-db`

### Issue: "Tables don't exist"
**Solution**: Run migrations: `npx wrangler d1 migrations apply intru-db --remote`

### Issue: "No products showing"
**Solution**: Seed database: `npx wrangler d1 execute intru-db --remote --file=./seed.sql`

### Issue: "Policy pages show 'Page Not Found'"
**Solution**: Verify pages in DB: `SELECT * FROM pages`

### Issue: "Admin login doesn't work"
**Solution**: 
1. First time: Use password `7@Intru`
2. After admin exists: Use registered email

---

## Environment Variables

For production, you may want to set:

```bash
# In Cloudflare Pages dashboard → Settings → Environment variables
ADMIN_API_KEY=7@Intru
GOOGLE_CLIENT_ID=your-google-client-id
INSTAGRAM_CLIENT_ID=your-instagram-client-id
```

---

## Cost Estimate (Cloudflare Free Tier)

- **D1 Database**: Free (5GB storage, 5M reads/day)
- **Pages**: Free (500 builds/month, unlimited requests)
- **Workers**: Free (100k requests/day)
- **Total**: **$0/month** (within free tier limits)

---

## Support & Links

- **GitHub**: https://github.com/Kbs-sol/intru-store
- **Live Demo**: https://intru-store.pages.dev
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Email**: shop@intru.in

---

## Quick Commands Reference

```bash
# Authentication
npx wrangler login
npx wrangler whoami

# D1 Database
npx wrangler d1 list
npx wrangler d1 create intru-db
npx wrangler d1 migrations apply intru-db --remote
npx wrangler d1 execute intru-db --remote --command="SELECT * FROM products"

# Cloudflare Pages
npx wrangler pages project list
npx wrangler pages project create intru-store
npx wrangler pages deploy dist --project-name intru-store
npx wrangler pages deployment list --project-name intru-store

# Build
npm run build
npm run preview

# Local Development
npm run dev:d1  # With D1 local database
```

---

**Made in Bharat 🇮🇳 with ❤️ for minimalism & everyday style**

**Version**: v1.6.0  
**Date**: February 9, 2026
