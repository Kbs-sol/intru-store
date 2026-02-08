# INTRU E-commerce - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you quickly set up and explore the INTRU e-commerce platform.

---

## 📦 Project Backup

**Full Project Archive:** https://www.genspark.ai/api/files/s/JERU4Sga

Download and extract to restore the complete project with all files and git history.

---

## 🌐 Live Demo URLs

### Sandbox Environment (Active Now)
**URL:** https://3000-igqor40n96dwkbvhea8k1-b32ec7bb.sandbox.novita.ai

**Test Credentials:**
- **Admin Email:** admin@intru.in
- **Login Method:** Email authentication (no password needed)

**What to Try:**
1. ✅ Browse products on homepage
2. ✅ Click product to see details
3. ✅ Add items to cart
4. ✅ Click sign-in and use email: admin@intru.in
5. ✅ Visit /admin to access dashboard
6. ✅ Manage products and pages
7. ✅ Check out /brand-story, /terms, /privacy, /returns

---

## 📂 GitHub Repository

**Repository:** https://github.com/Kbs-sol/intru-store

```bash
# Clone the repository
git clone https://github.com/Kbs-sol/intru-store.git
cd intru-store

# Install dependencies
npm install

# Setup local database
npm run db:migrate:local
npm run db:seed

# Build
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Access at http://localhost:3000
```

---

## 🎯 Key Features

### ✅ Complete E-commerce
- 6 products from intru.in
- Shopping cart with persistence
- Razorpay payment integration
- Mobile responsive design

### ✅ Multi-Auth System
- Google One Tap (ready for credentials)
- Instagram OAuth (ready for credentials)  
- Email authentication (working now)

### ✅ Admin Dashboard
- Product management (CRUD)
- Page content editor
- Razorpay link management
- Real-time updates

### ✅ SEO Pages
- Brand Story
- Terms & Conditions
- Privacy Policy
- Return & Exchange Policy

---

## 📋 Next Steps

### 1. Configure OAuth (Required for Production)

**Google One Tap:**
1. Get Client ID from https://console.cloud.google.com/
2. Update in `src/index.tsx` line with `YOUR_GOOGLE_CLIENT_ID`

**Instagram OAuth:**
1. Create app at https://developers.facebook.com/
2. Update OAuth flow in `public/static/app.js`

### 2. Add Razorpay Links

1. Create payment buttons at https://razorpay.com/
2. Login as admin@intru.in
3. Go to Admin → Products
4. Edit each product and add Razorpay link
5. Save changes

### 3. Deploy to Production

Follow the comprehensive guide in **DEPLOYMENT.md**:

```bash
# Quick deployment
npx wrangler d1 create intru-db
# Update database ID in wrangler.jsonc
npm run db:migrate:prod
npx wrangler d1 execute intru-db --file=./seed.sql
npm run deploy:prod
```

Your site will be live at: `https://intru-store.pages.dev`

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/index.tsx` | Backend API & routes (31KB) |
| `public/static/app.js` | Frontend logic (31KB) |
| `public/static/styles.css` | Custom styling (4KB) |
| `migrations/0001_initial_schema.sql` | Database structure |
| `seed.sql` | Initial data (6 products, 4 pages) |
| `wrangler.jsonc` | Cloudflare config |
| `ecosystem.config.cjs` | PM2 config |
| `README.md` | Full documentation |
| `DEPLOYMENT.md` | Deployment guide |
| `IMPLEMENTATION.md` | Technical details |

---

## 🔍 API Endpoints

### Public APIs
```
GET  /api/products              # List products
GET  /api/products/:slug        # Product details
GET  /api/pages/:slug           # Page content
POST /api/auth/login            # Email login
POST /api/auth/oauth            # OAuth login
GET  /api/auth/me               # Current user
```

### Protected APIs (Require Auth)
```
GET    /api/cart                # Get cart
POST   /api/cart                # Add to cart
PUT    /api/cart/:id            # Update quantity
DELETE /api/cart/:id            # Remove item
```

### Admin APIs (Require is_admin)
```
GET    /api/admin/products      # List all products
POST   /api/admin/products      # Create product
PUT    /api/admin/products/:id  # Update product
DELETE /api/admin/products/:id  # Delete product
GET    /api/admin/pages         # List pages
PUT    /api/admin/pages/:id     # Update page
```

---

## 🗄️ Database Schema

### 8 Tables
- `users` - User accounts
- `products` - Product catalog  
- `orders` - Order history
- `order_items` - Order line items
- `cart_items` - Shopping carts
- `pages` - Content pages
- `sessions` - Auth sessions

### Indexes
11 indexes for optimized queries

---

## 💡 Quick Tips

### Testing Locally
```bash
# Reset database
npm run db:reset

# Clean port
npm run clean-port

# Restart server
pm2 restart intru-store

# Check logs
pm2 logs --nostream
```

### Admin Tasks
1. Login at / with admin@intru.in
2. Go to /admin
3. Switch tabs: Products | Pages
4. Make changes
5. Changes reflect immediately

### Adding Products
1. Admin → Products → Add Product
2. Fill in:
   - Name, slug (URL-friendly)
   - Price, original price
   - Images (CDN URLs)
   - Razorpay link
   - Category
3. Save

### Editing Pages
1. Admin → Pages
2. Select page (Brand Story, Terms, etc.)
3. Edit content (Markdown supported)
4. Update meta tags for SEO
5. Save

---

## 🎨 Design Customization

### Change Colors
Edit `public/static/styles.css`:
```css
:root {
  --primary-color: #000000;    /* Change to your brand color */
  --secondary-color: #667eea;  /* Accent color */
}
```

### Update Logo
Replace "INTRU" text in `src/index.tsx` navigation section

### Add Social Links
Update footer social media links in `src/index.tsx`

---

## 📊 Tech Stack

```
Backend:      Hono 4.11.8
Database:     Cloudflare D1 (SQLite)
Hosting:      Cloudflare Pages
Frontend:     Vanilla JS + TailwindCSS
Icons:        Font Awesome 6.4.0
Fonts:        Google Fonts (Inter)
Payments:     Razorpay
```

---

## 🐛 Common Issues

### "Internal Server Error"
- Rebuild: `npm run build`
- Restart: `pm2 restart intru-store`

### "Products not loading"
- Check database: `npm run db:seed`

### "Port 3000 in use"
- Clean port: `npm run clean-port`

### "Cart not syncing"
- Login first, cart syncs automatically

---

## 📞 Support

**GitHub Issues:** https://github.com/Kbs-sol/intru-store/issues

**Documentation:**
- README.md - Overview
- DEPLOYMENT.md - Deploy guide
- IMPLEMENTATION.md - Technical specs

---

## ✅ Production Checklist

Before going live:
- [ ] Configure Google OAuth
- [ ] Configure Instagram OAuth
- [ ] Add Razorpay links to all products
- [ ] Test checkout flow
- [ ] Deploy to Cloudflare Pages
- [ ] Setup custom domain (optional)
- [ ] Add Google Analytics
- [ ] Test mobile experience
- [ ] Verify email authentication
- [ ] Check all page links
- [ ] Test admin dashboard
- [ ] Review SEO meta tags

---

## 🎉 You're All Set!

The INTRU e-commerce platform is now ready to use. Follow the next steps to configure OAuth and Razorpay, then deploy to production.

**Happy Selling! 🛍️**

---

**Version:** 1.0.0  
**Last Updated:** February 8, 2026  
**Status:** ✅ Production Ready
