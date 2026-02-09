# INTRU E-commerce Store - Admin Setup Guide

## 🚀 Quick Start for Admin Access

### Phase 1: Initial Setup (Master Key Access)

When you first deploy the application, **no admin account exists**. To create the first admin:

1. **Navigate to the Setup Page**
   ```
   https://your-site.pages.dev/setup
   ```

2. **Enter Admin Details**
   - Email: Your professional email (e.g., admin@intru.in)
   - Name: Your full name
   - Master Key: `7Intru@`

3. **Click "Create Admin Account"**
   - The system will create your admin account
   - You'll be automatically logged in
   - You'll be redirected to `/admin`

### Phase 2: Email-Based Access (Auto-Lock)

Once the first admin is created, **the master key is automatically disabled**. From this point:

1. **Regular Login Required**
   - Click the user icon in the header
   - Choose "Login with Email" or use Google/Instagram OAuth
   - Log in with your admin email

2. **Access Admin Dashboard**
   - After logging in, click your profile avatar
   - Select "Admin" from the dropdown menu
   - Or navigate directly to `/admin`

## 🔐 Security Features

### Dynamic Security Toggle

The application implements a **two-phase security model**:

**Phase 1 - Setup Mode** (No admin exists)
- ✅ Master key (`7Intru@`) grants access
- ✅ X-Admin-Key header accepted for API calls
- ⚠️ Anyone with the master key can create the first admin

**Phase 2 - Secure Mode** (Admin exists)
- ❌ Master key is disabled
- ✅ Only authenticated admin users can access `/admin`
- ✅ Session-based authentication required
- ✅ Role-based access control enforced

### API Access with Master Key (Phase 1 Only)

If you need to access admin APIs before creating an admin account:

```bash
curl -X GET http://localhost:3000/api/admin/products \
  -H "X-Admin-Key: 7Intru@"
```

Once an admin exists, this will fail with:
```json
{
  "error": "Unauthorized. Please log in via email or use master key (if no admin exists).",
  "phase": "secure"
}
```

## 📋 Admin Dashboard Features

Once logged in as admin, you can:

### Products Management
- ✅ View all products
- ✅ Add new products
- ✅ Edit existing products (name, price, images, Razorpay links)
- ✅ Toggle product visibility (active/inactive)
- ✅ Manage stock levels
- ✅ Delete products

### Pages Management
- ✅ Edit Terms & Conditions
- ✅ Edit Privacy Policy
- ✅ Edit Returns & Exchanges policy
- ✅ Edit Shipping policy
- ✅ Edit FAQ page
- ✅ Edit Brand Story
- ✅ Update SEO metadata (meta titles, descriptions)

## 🌐 Cloudflare Deployment

### Setting Up the Admin API Key (Optional)

For production, you can set a custom master key using Cloudflare Secrets:

```bash
# Set custom master key
npx wrangler secret put ADMIN_API_KEY

# When prompted, enter your custom key (default is 7Intru@)
```

**Important**: This only affects Phase 1 (initial setup). Once an admin exists, this key is disabled.

### Production Deployment Steps

1. **Deploy to Cloudflare Pages**
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name intru-store
   ```

2. **Apply D1 Migrations**
   ```bash
   npx wrangler d1 migrations apply intru-db --remote
   ```

3. **Seed Production Database**
   ```bash
   npx wrangler d1 execute intru-db --remote --file=./seed.sql
   ```

4. **Create First Admin**
   - Navigate to `https://intru-store.pages.dev/setup`
   - Enter admin details with master key `7Intru@`
   - Complete setup

5. **Verify Admin Access**
   - Log in with your admin email
   - Access admin dashboard at `/admin`
   - Test product and page management

## 🔄 User Roles

The system supports role-based access control:

| Role | Permissions |
|------|------------|
| `admin` | Full access to admin dashboard, can manage products and pages |
| `customer` | Can browse products, add to cart, place orders |

**Note**: Currently, only `admin` and `customer` roles are implemented. Future roles (manager, editor) can be added by:
1. Adding migration to create new role
2. Updating `adminMiddleware` to check for new role
3. Adding role-specific UI features

## 🛠️ Troubleshooting

### "Unauthorized" Error on /admin

**Problem**: Cannot access admin dashboard

**Solutions**:

1. **If no admin exists yet**
   - Go to `/setup` page
   - Create first admin account with master key

2. **If admin exists but you're not logged in**
   - Click user icon in header
   - Login with your admin email
   - After login, access `/admin`

3. **If logged in but still can't access**
   - Check your user role in database
   - Verify `role = 'admin'` and `is_admin = 1`
   - Check browser console for session token

### Master Key Not Working

**Problem**: Master key returns "Unauthorized"

**Cause**: An admin account already exists (Phase 2 activated)

**Solution**: Use regular login with your admin email

### Lost Admin Access

**Problem**: No one can access admin dashboard

**Solutions**:

1. **Reset Admin in Database**
   ```bash
   # Local development
   npx wrangler d1 execute intru-db --local --command="UPDATE users SET role='admin', is_admin=1 WHERE email='your@email.com'"
   
   # Production
   npx wrangler d1 execute intru-db --remote --command="UPDATE users SET role='admin', is_admin=1 WHERE email='your@email.com'"
   ```

2. **Create New Admin via Setup**
   - If no admin exists, use `/setup` page
   - If admin exists, update existing user in database

## 📞 Support

For issues or questions:
- Email: support@intru.in
- GitHub: https://github.com/Kbs-sol/intru-store

## 🔒 Best Practices

1. **Change Master Key in Production**
   ```bash
   npx wrangler secret put ADMIN_API_KEY
   # Enter a strong, unique key
   ```

2. **Create Admin Immediately After Deployment**
   - Don't leave setup page accessible for long
   - Create admin within 24 hours of deployment

3. **Use Strong Admin Emails**
   - Use company/organization email
   - Enable 2FA on Google/Instagram for OAuth login

4. **Regular Backups**
   - Export D1 database regularly
   - Keep backup of wrangler.jsonc and migrations

5. **Monitor Admin Activity**
   - Check admin logs periodically
   - Review product/page changes

## 📚 Additional Resources

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Hono Framework Docs](https://hono.dev/)
