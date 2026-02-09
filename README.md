# INTRU E-commerce Store

**Version 1.2.0** - Complete e-commerce platform with dynamic security, role-based authentication, and comprehensive content management.

🌐 **Live Demo**: https://3000-igqor40n96dwkbvhea8k1-b32ec7bb.sandbox.novita.ai  
📦 **GitHub**: https://github.com/Kbs-sol/intru-store  
📧 **Contact**: shop@intru.in | support@intru.in

---

## ✨ Features

### 🛍️ Shopping Experience
- ✅ Browse 6 curated products from intru.in
- ✅ Product details with dual images and pricing
- ✅ Add to cart functionality
- ✅ **Razorpay Buy Now** integration (direct checkout)
- ✅ Shopping cart with quantity management
- ✅ Guest cart (localStorage) and user cart (D1 database)
- ✅ Mobile-responsive product gallery

### 🔐 Authentication
- ✅ **Google One Tap Login** (needs Client ID configuration)
- ✅ **Instagram OAuth** (needs App credentials)
- ✅ **Email Login** (magic link style)
- ✅ 30-day session expiry
- ✅ Secure session management with D1
- ✅ Role-based access control (admin, customer)

### 🔒 Dynamic Security Toggle
- ✅ **Phase 1 (Setup Mode)**: Master key access (`7Intru@`) for initial admin creation
- ✅ **Phase 2 (Secure Mode)**: Auto-locks to email/OAuth login once admin exists
- ✅ Session-based authentication
- ✅ CSRF protection
- ✅ Input validation and sanitization

### 👑 Admin Dashboard
- ✅ **Products Management**
  - Add, edit, delete products
  - Manage Razorpay Buy Now links
  - Upload product images (URL-based)
  - Toggle product visibility
  - Stock management
  
- ✅ **Pages Management**
  - Edit Terms & Conditions
  - Edit Privacy Policy
  - Edit Returns & Exchanges
  - Edit Shipping Policy
  - Edit FAQ
  - Edit Brand Story
  - SEO metadata (meta title, description)

### 📄 Content Pages
- ✅ **Brand Story** - SEO-optimized with rich content
- ✅ **Returns & Exchanges** - Comprehensive policy (damaged/defective/wrong items only)
- ✅ **Shipping Policy** - Processing times, delivery estimates, free shipping info
- ✅ **FAQ** - 9+ frequently asked questions with detailed answers
- ✅ **Terms & Conditions** - Complete legal terms
- ✅ **Privacy Policy** - GDPR-compliant privacy information

### 🎨 Design
- ✅ **Glassmorphic Navigation** - Modern backdrop-blur header with gradient branding
- ✅ Tailwind CSS styling
- ✅ Font Awesome icons
- ✅ Google Inter font
- ✅ Mobile-first responsive design
- ✅ Sabina-inspired minimalist theme
- ✅ Smooth transitions and hover effects

### 🗄️ Data & Hosting
- ✅ **Cloudflare D1** - SQLite database (free tier, 5GB limit)
- ✅ **Cloudflare Pages** - Static hosting (free tier)
- ✅ 8 database tables (users, products, orders, cart, pages, sessions)
- ✅ 11 indexes for optimized queries
- ✅ Foreign key constraints
- ✅ Migration system for schema updates

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend Framework** | Hono 4.11.8 (lightweight, fast) |
| **Database** | Cloudflare D1 (SQLite) |
| **Frontend** | Vanilla JS + TailwindCSS (CDN) |
| **Hosting** | Cloudflare Pages + Workers |
| **Icons** | Font Awesome 6.4.0 |
| **Fonts** | Google Inter |
| **Payments** | Razorpay Buy Now links |
| **Dev Server** | PM2 (daemon process) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Wrangler CLI
- Cloudflare account (for deployment)

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/Kbs-sol/intru-store.git
   cd intru-store
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   ```bash
   # Apply migrations
   npx wrangler d1 migrations apply intru-db --local
   
   # Seed with initial data
   npx wrangler d1 execute intru-db --local --file=./seed.sql
   ```

4. **Build Project**
   ```bash
   npm run build
   ```

5. **Start Development Server**
   ```bash
   pm2 start ecosystem.config.cjs
   
   # Check status
   pm2 logs intru-store --nostream
   ```

6. **Access Application**
   ```
   http://localhost:3000
   ```

7. **Create First Admin**
   - Navigate to `http://localhost:3000/setup`
   - Email: admin@intru.in
   - Name: Admin
   - Master Key: `7Intru@`
   - Click "Create Admin Account"

---

## 🔐 Admin Setup

### Initial Setup (No Admin Exists)

1. Go to `/setup` page
2. Enter:
   - Email (e.g., admin@intru.in)
   - Name
   - Master Key: `7Intru@`
3. Click "Create Admin Account"

### Regular Login (After Admin Created)

1. Click user icon in header
2. Login with email/Google/Instagram
3. Access admin at `/admin`

**Full documentation**: See [ADMIN_SETUP.md](./ADMIN_SETUP.md)

---

## 📦 Database Schema

### Tables
- **users** - User accounts with roles
- **sessions** - Authentication sessions
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Order line items
- **cart_items** - Shopping cart
- **pages** - CMS pages
- **sessions** - Auth sessions (30-day expiry)

### Key Relationships
```
users (1) → (N) orders
users (1) → (N) cart_items
orders (1) → (N) order_items
products (1) → (N) order_items
products (1) → (N) cart_items
```

---

## 🌍 Deployment

### Cloudflare Pages Deployment

**Full guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Steps**:

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy**
   ```bash
   npx wrangler pages deploy dist --project-name intru-store
   ```

3. **Setup Production Database**
   ```bash
   # Apply migrations
   npx wrangler d1 migrations apply intru-db --remote
   
   # Seed data
   npx wrangler d1 execute intru-db --remote --file=./seed.sql
   ```

4. **Access Site**
   ```
   https://intru-store.pages.dev
   ```

5. **Create Admin**
   - Go to `https://intru-store.pages.dev/setup`
   - Complete setup with master key

---

## 📂 Project Structure

```
intru-store/
├── src/
│   ├── index.tsx              # Main Hono app with all routes
│   └── index_backup.tsx       # Backup of previous version
├── public/
│   └── static/
│       ├── app.js            # Frontend JavaScript
│       └── styles.css        # Custom CSS
├── migrations/
│   ├── 0001_initial_schema.sql  # Database schema
│   └── 0002_add_user_roles.sql  # Role-based auth
├── .wrangler/                # Local D1 database (gitignored)
├── ecosystem.config.cjs      # PM2 configuration
├── wrangler.jsonc           # Cloudflare configuration
├── package.json             # Dependencies & scripts
├── seed.sql                 # Initial data
├── README.md                # This file
├── ADMIN_SETUP.md           # Admin setup guide
├── DEPLOYMENT.md            # Deployment guide
├── QUICKSTART.md            # Quick start guide
├── SECURITY.md              # Security documentation
├── CHANGELOG.md             # Version history
└── IMPLEMENTATION.md        # Implementation details
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run db:migrate:local` | Apply migrations locally |
| `npm run db:migrate:prod` | Apply migrations to production |
| `npm run db:seed` | Seed local database |
| `npm run db:reset` | Reset local database |

---

## 🎯 Current Status

### ✅ Completed Features
- [x] 6 products catalog with images and pricing
- [x] Add to cart functionality
- [x] Razorpay Buy Now integration
- [x] Google One Tap authentication (needs Client ID)
- [x] Instagram OAuth (needs credentials)
- [x] Email login system
- [x] Admin dashboard with CRUD
- [x] Product management (add, edit, delete)
- [x] Page content management
- [x] Razorpay link management
- [x] SEO-optimized brand story
- [x] Comprehensive policies (Returns, Shipping, FAQ, Terms, Privacy)
- [x] Dynamic security toggle (Phase 1 & 2)
- [x] Role-based access control
- [x] Glassmorphic navigation
- [x] Mobile-responsive design
- [x] Free Cloudflare hosting
- [x] D1 database integration
- [x] GitHub repository

### 🔄 Configuration Needed
- [ ] Google OAuth Client ID
- [ ] Instagram App credentials
- [ ] Razorpay account & API keys
- [ ] Custom domain (optional)
- [ ] Email service for magic links (optional)

### 🚀 Future Enhancements
- [ ] Image upload for products (currently URL-based)
- [ ] Order management system
- [ ] Email notifications
- [ ] Customer dashboard
- [ ] Inventory management
- [ ] Analytics integration
- [ ] Multiple admin roles (manager, editor)
- [ ] Bulk product import/export

---

## 🎨 Design Philosophy

INTRU follows a **minimalist, everyday style** inspired by:
- Clean, uncluttered layouts
- Neutral color palette (blacks, grays, whites)
- High-quality product photography
- Readable typography (Inter font)
- Subtle animations and transitions
- Mobile-first responsive design

---

## 📞 Contact & Support

- **Email**: shop@intru.in, support@intru.in
- **Instagram**: @intru.in
- **GitHub**: https://github.com/Kbs-sol/intru-store
- **Issues**: https://github.com/Kbs-sol/intru-store/issues

---

## 📄 License

Copyright © 2024 INTRU. All rights reserved.

---

## 🙏 Acknowledgments

- **Hono** - Fast, lightweight web framework
- **Cloudflare** - Free hosting and database
- **TailwindCSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Razorpay** - Payment gateway

---

## 🔄 Version History

### v1.2.0 (Current)
- ✅ Fixed admin access with setup flow
- ✅ Glassmorphic navigation design
- ✅ Comprehensive shipping, FAQ, returns content
- ✅ Dynamic security toggle (Phase 1 & 2)
- ✅ Streamlined navigation (removed redundant links)
- ✅ Exchange-focused returns policy

### v1.1.0
- ✅ Dynamic security toggle with master key
- ✅ Role-based authentication
- ✅ Enhanced page content from intru.in
- ✅ Security documentation

### v1.0.0
- ✅ Initial release
- ✅ 6 products, cart, auth, admin, pages
- ✅ Cloudflare D1 integration
- ✅ GitHub repository setup

---

**Built with ❤️ for minimalism & everyday style**
