# INTRU E-commerce Store

**Built from scratch with a shared love for minimalism & everyday style.**

A modern, lightweight e-commerce platform for INTRU fashion brand, built with Hono, Cloudflare Pages, and D1 Database.

## 🌐 Live Demo

**Sandbox Environment:** https://3000-igqor40n96dwkbvhea8k1-b32ec7bb.sandbox.novita.ai

## 🎯 Project Overview

INTRU is a minimalist e-commerce platform offering 6 curated fashion products with seamless shopping experience, secure authentication, and easy admin management.

### Key Features

✅ **Complete E-commerce Functionality**
- Product catalog with 6 initial products (T-shirts, Shirts, Crop Tees)
- Shopping cart with localStorage (guest) and database (logged-in users) persistence
- Razorpay payment integration with Buy Now links
- Responsive design inspired by sabina.framer.wiki theme

✅ **Multi-Provider Authentication**
- 🔐 Google One Tap Sign-in
- 📸 Instagram OAuth (ready for credentials)
- ✉️ Email-based authentication
- Session management with 30-day expiry

✅ **Admin Dashboard**
- Product management (Create, Update, Delete)
- Page content management (T&C, Privacy Policy, Returns)
- Real-time inventory tracking
- Razorpay link management

✅ **SEO-Optimized Pages**
- Brand Story page with compelling narrative
- Terms & Conditions
- Privacy Policy
- Return & Exchange Policy
- Meta tags and descriptions for all pages

✅ **Modern Tech Stack**
- **Backend:** Hono (lightweight web framework)
- **Database:** Cloudflare D1 (SQLite)
- **Hosting:** Cloudflare Pages (edge deployment)
- **Frontend:** Vanilla JS + TailwindCSS
- **Icons:** Font Awesome
- **Payments:** Razorpay

## 📁 Project Structure

```
webapp/
├── src/
│   └── index.tsx              # Main Hono application with all API routes
├── public/
│   └── static/
│       ├── app.js            # Frontend JavaScript (cart, auth, admin)
│       └── styles.css        # Custom CSS styling
├── migrations/
│   └── 0001_initial_schema.sql # Database schema
├── seed.sql                   # Initial product and page data
├── ecosystem.config.cjs       # PM2 configuration
├── wrangler.jsonc            # Cloudflare configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🗄️ Database Schema

### Tables
- **users** - User accounts (email, OAuth providers)
- **products** - Product catalog with prices and images
- **orders** - Order history
- **order_items** - Line items for orders
- **cart_items** - Shopping cart persistence
- **pages** - Dynamic content management
- **sessions** - Authentication sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm
- Wrangler CLI

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Kbs-sol/intru-store.git
cd intru-store
```

2. **Install dependencies**
```bash
npm install
```

3. **Apply migrations**
```bash
npm run db:migrate:local
```

4. **Seed database**
```bash
npm run db:seed
```

5. **Build the project**
```bash
npm run build
```

6. **Start development server**
```bash
npm run dev:d1
# or with PM2
pm2 start ecosystem.config.cjs
```

7. **Access the application**
- Local: http://localhost:3000

### Available Scripts

```bash
npm run dev              # Start Vite dev server
npm run dev:sandbox      # Start wrangler dev server
npm run dev:d1           # Start with D1 database
npm run build            # Build for production
npm run deploy:prod      # Deploy to Cloudflare Pages
npm run db:migrate:local # Apply migrations locally
npm run db:migrate:prod  # Apply migrations to production
npm run db:seed          # Seed local database
npm run db:reset         # Reset and reseed local database
npm run clean-port       # Clean up port 3000
npm run test             # Test local server
```

## 🔐 Authentication Setup

### Google One Tap

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Update `YOUR_GOOGLE_CLIENT_ID` in `src/index.tsx`

### Instagram OAuth

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create Instagram App
3. Configure OAuth redirect URI
4. Update Instagram OAuth flow in `public/static/app.js`

## 💳 Razorpay Integration

1. Sign up at [Razorpay](https://razorpay.com/)
2. Create payment buttons/links for each product
3. Add Razorpay links in Admin Dashboard → Products

## 📦 Deployment to Cloudflare Pages

### Prerequisites
1. Cloudflare account
2. Wrangler CLI configured

### Steps

1. **Create D1 database**
```bash
npx wrangler d1 create intru-db
```

2. **Update wrangler.jsonc with database ID**
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "intru-db",
      "database_id": "YOUR_DATABASE_ID"
    }
  ]
}
```

3. **Apply migrations to production**
```bash
npm run db:migrate:prod
```

4. **Seed production database**
```bash
npx wrangler d1 execute intru-db --file=./seed.sql
```

5. **Deploy to Cloudflare Pages**
```bash
npm run deploy:prod
```

6. **Access your production site**
- URL: `https://intru-store.pages.dev`

## 🛠️ Admin Access

**Default Admin Credentials:**
- Email: `admin@intru.in`
- Login via Email authentication

**Admin Features:**
- Product management
- Page content editing
- Stock tracking
- Razorpay link management

## 📊 Current Product Catalog

| Product | Price | Original Price | Category |
|---------|-------|----------------|----------|
| Doodles T-Shirt | ₹999 | ₹1,499 | T-Shirts |
| No Risk Porsche T-Shirt | ₹999 | ₹1,499 | T-Shirts |
| Orange Puff Printed T-Shirt | ₹999 | ₹1,499 | T-Shirts |
| Romanticise Crop Tee | ₹699 | ₹999 | Tops |
| Stripe 18 Shirt | ₹1,099 | ₹1,699 | Shirts |
| Summer Shirt | ₹999 | ₹1,599 | Shirts |

## 🎨 Design Philosophy

- **Minimalism First:** Clean, uncluttered interface
- **Mobile Responsive:** Optimized for all screen sizes
- **Fast Loading:** Lightweight assets and edge deployment
- **Intuitive UX:** Easy navigation and checkout flow

## 📈 Scalability & Future Enhancements

### Current Free Tier Limits
- **Cloudflare Pages:** Unlimited requests, 100,000 builds/month
- **D1 Database:** 5GB storage, 5M reads/day, 100K writes/day
- **Perfect for:** Small to medium e-commerce stores

### Migration Path to Supabase/Firebase (When Needed)
The application is designed with abstraction layers for easy migration:
- **Database:** Switch from D1 to Supabase PostgreSQL
- **Storage:** Move from R2 to Firebase Storage
- **Auth:** Migrate to Supabase Auth or Firebase Auth

## 🔄 Recommended Next Steps

1. **Configure OAuth Providers**
   - Add Google Client ID
   - Setup Instagram App credentials

2. **Add Razorpay Links**
   - Create payment buttons for each product
   - Update via Admin Dashboard

3. **Customize Branding**
   - Update brand story content
   - Add more product images
   - Customize colors in TailwindCSS

4. **Setup Analytics**
   - Add Google Analytics
   - Track conversions
   - Monitor user behavior

5. **Email Integration**
   - Setup Resend/SendGrid for order confirmations
   - Implement magic link authentication

6. **Enhanced Features**
   - Product reviews
   - Wishlist functionality
   - Order tracking
   - Newsletter signup

## 🐛 Troubleshooting

### Port 3000 in use
```bash
npm run clean-port
```

### Database reset
```bash
npm run db:reset
```

### Build errors
```bash
rm -rf node_modules dist .wrangler
npm install
npm run build
```

## 📝 Environment Variables

Create `.dev.vars` for local development:
```
GOOGLE_CLIENT_ID=your_google_client_id
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_secret
RAZORPAY_KEY_ID=your_razorpay_key
```

## 🤝 Contributing

This is a custom implementation for INTRU. For suggestions or issues, please contact the development team.

## 📄 License

Proprietary - INTRU Fashion Brand

## 👨‍💻 Development Team

Built with ❤️ for INTRU by the development team.

## 📞 Support

For technical support or questions:
- Email: support@intru.in
- GitHub Issues: [Create Issue](https://github.com/Kbs-sol/intru-store/issues)

---

**Last Updated:** February 8, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
