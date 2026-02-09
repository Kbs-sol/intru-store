import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { getCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
  ADMIN_API_KEY?: string
}

type Variables = {
  user?: User
}

type User = {
  id: number
  email: string
  name: string
  provider: string
  role: string
  is_admin: number
  avatar_url?: string
  created_at: string
}

type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  original_price: number
  image_url: string
  image_url_2?: string
  razorpay_link?: string
  category?: string
  is_featured: number
  is_active: number
  stock: number
  created_at: string
}

type Page = {
  id: number
  slug: string
  title: string
  content: string
  meta_title?: string
  meta_description?: string
  is_active: number
  created_at: string
  updated_at: string
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ======================
// AUTHENTICATION MIDDLEWARE
// ======================

const authMiddleware = async (c: any, next: any) => {
  // Allow public access to certain paths
  const publicPaths = ['/', '/products', '/brand-story', '/terms', '/privacy', '/returns', '/exchanges', '/shipping', '/faq', '/contact', '/api/products', '/api/pages']
  const path = c.req.path
  
  if (publicPaths.some(p => path === p || path.startsWith('/products/'))) {
    return await next()
  }
  
  // For other routes, check authentication
  const authHeader = c.req.header('Authorization')
  const sessionToken = authHeader?.replace('Bearer ', '') || getCookie(c, 'session_token')
  
  if (!sessionToken) {
    if (path.startsWith('/api/')) {
      return c.json({ error: 'Not authenticated' }, 401)
    }
    return await next() // Allow HTML pages to load, JS will handle auth
  }
  
  try {
    const session = await c.env.DB.prepare(`
      SELECT s.*, u.* FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(sessionToken).first()
    
    if (session) {
      c.set('user', session as User)
    }
  } catch (error) {
    console.error('Auth error:', error)
  }
  
  await next()
}

// Admin middleware with dynamic security toggle
const adminMiddleware = async (c: any, next: any) => {
  // Check if X-Admin-Key header is provided
  const providedKey = c.req.header('X-Admin-Key')
  const adminSecret = c.env.ADMIN_API_KEY
  
  // Query if any admin user exists
  const { results } = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE role = 'admin'
  `).all()
  const adminExists = results.length > 0 && (results[0] as any).count > 0
  
  if (!adminExists) {
    // PHASE 1: No admin yet. Allow access via master key.
    const masterKey = adminSecret || '7@Intru'
    if (providedKey === masterKey) {
      return await next()
    }
  } else {
    // PHASE 2: Admin user added. DISABLE the security key bypass.
    // Check for a valid session
    const user = c.get('user')
    if (user && (user.is_admin === 1 || user.role === 'admin')) {
      return await next()
    }
  }
  
  return c.json({ 
    error: 'Unauthorized. Please log in via email or use master key (if no admin exists).', 
    phase: adminExists ? 'secure' : 'setup'
  }, 401)
}

// Apply auth middleware to all routes EXCEPT setup
app.use('*', async (c, next) => {
  // Allow public access to setup page
  if (c.req.path === '/setup' || c.req.path.startsWith('/api/setup')) {
    return await next()
  }
  return authMiddleware(c, next)
})

// ======================
// SETUP ROUTES (for initial admin creation)
// ======================

// Check if setup is needed
app.get('/api/setup/check', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE role = 'admin'
  `).all()
  const adminExists = results[0] && (results[0] as any).count > 0
  
  return c.json({ setupNeeded: !adminExists })
})

// Create first admin (only if no admin exists)
app.post('/api/setup/create-admin', async (c) => {
  // Check if admin already exists
  const { results } = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE role = 'admin'
  `).all()
  const adminExists = results[0] && (results[0] as any).count > 0
  
  if (adminExists) {
    return c.json({ error: 'Admin already exists' }, 400)
  }
  
  const { email, name, password } = await c.req.json()
  
  // Verify master key
  if (password !== '7Intru@') {
    return c.json({ error: 'Invalid master key' }, 403)
  }
  
  // Create admin user
  const result = await c.env.DB.prepare(`
    INSERT INTO users (email, name, provider, role, is_admin) 
    VALUES (?, ?, 'email', 'admin', 1)
  `).bind(email, name).run()
  
  // Create session
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  
  await c.env.DB.prepare(`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (?, ?, ?)
  `).bind(result.meta.last_row_id, sessionToken, expiresAt).run()
  
  const user = await c.env.DB.prepare(`
    SELECT * FROM users WHERE id = ?
  `).bind(result.meta.last_row_id).first() as User
  
  return c.json({ user, sessionToken })
})

// ======================
// AUTH ROUTES
// ======================

// Login with email
app.post('/api/auth/login', async (c) => {
  const { email, name } = await c.req.json()
  
  // Check if user exists
  let user = await c.env.DB.prepare(`
    SELECT * FROM users WHERE email = ? AND provider = 'email'
  `).bind(email).first() as User | null
  
  // Create user if doesn't exist
  if (!user) {
    // Check if this is the first user (will be admin)
    const { results } = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM users
    `).all()
    const isFirstUser = results[0] && (results[0] as any).count === 0
    
    const result = await c.env.DB.prepare(`
      INSERT INTO users (email, name, provider, role, is_admin) VALUES (?, ?, 'email', ?, ?)
    `).bind(email, name || email.split('@')[0], isFirstUser ? 'admin' : 'customer', isFirstUser ? 1 : 0).run()
    
    user = await c.env.DB.prepare(`
      SELECT * FROM users WHERE id = ?
    `).bind(result.meta.last_row_id).first() as User
  }
  
  // Create session
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  
  await c.env.DB.prepare(`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (?, ?, ?)
  `).bind(user!.id, sessionToken, expiresAt).run()
  
  return c.json({ user, sessionToken })
})

// Login with OAuth (Google/Instagram)
app.post('/api/auth/oauth', async (c) => {
  const { provider, provider_id, email, name, avatar_url } = await c.req.json()
  
  // Check if user exists
  let user = await c.env.DB.prepare(`
    SELECT * FROM users WHERE email = ? AND provider = ?
  `).bind(email, provider).first() as User | null
  
  // Create user if doesn't exist
  if (!user) {
    const result = await c.env.DB.prepare(`
      INSERT INTO users (email, name, provider, avatar_url, role, is_admin) VALUES (?, ?, ?, ?, 'customer', 0)
    `).bind(email, name, provider, avatar_url || null).run()
    
    user = await c.env.DB.prepare(`
      SELECT * FROM users WHERE id = ?
    `).bind(result.meta.last_row_id).first() as User
  }
  
  // Create session
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  
  await c.env.DB.prepare(`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (?, ?, ?)
  `).bind(user!.id, sessionToken, expiresAt).run()
  
  return c.json({ user, sessionToken })
})

// Get current user
app.get('/api/auth/me', async (c) => {
  const user = c.get('user')
  
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  return c.json({ user })
})

// Logout
app.post('/api/auth/logout', async (c) => {
  const user = c.get('user')
  
  if (user) {
    const authHeader = c.req.header('Authorization')
    const sessionToken = authHeader?.replace('Bearer ', '') || getCookie(c, 'session_token')
    
    if (sessionToken) {
      await c.env.DB.prepare(`
        DELETE FROM sessions WHERE session_token = ?
      `).bind(sessionToken).run()
    }
  }
  
  return c.json({ success: true })
})

// ======================
// PRODUCT ROUTES
// ======================

// Get all products
app.get('/api/products', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC
  `).all()
  
  return c.json({ products: results })
})

// Get single product
app.get('/api/products/:slug', async (c) => {
  const slug = c.req.param('slug')
  
  const product = await c.env.DB.prepare(`
    SELECT * FROM products WHERE slug = ? AND is_active = 1
  `).bind(slug).first()
  
  if (!product) {
    return c.json({ error: 'Product not found' }, 404)
  }
  
  return c.json({ product })
})

// ======================
// CART ROUTES
// ======================

// Get cart items
app.get('/api/cart', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  const { results } = await c.env.DB.prepare(`
    SELECT ci.*, p.name, p.price, p.image_url 
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `).bind(user.id).all()
  
  return c.json({ items: results })
})

// Add to cart
app.post('/api/cart', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  const { product_id, quantity } = await c.req.json()
  
  // Check if item already exists in cart
  const existing = await c.env.DB.prepare(`
    SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?
  `).bind(user.id, product_id).first()
  
  if (existing) {
    // Update quantity
    await c.env.DB.prepare(`
      UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?
    `).bind(quantity, user.id, product_id).run()
  } else {
    // Insert new item
    await c.env.DB.prepare(`
      INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
    `).bind(user.id, product_id, quantity).run()
  }
  
  return c.json({ success: true })
})

// Update cart item
app.put('/api/cart/:id', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  const id = c.req.param('id')
  const { quantity } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?
  `).bind(quantity, id, user.id).run()
  
  return c.json({ success: true })
})

// Delete cart item
app.delete('/api/cart/:id', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  const id = c.req.param('id')
  
  await c.env.DB.prepare(`
    DELETE FROM cart_items WHERE id = ? AND user_id = ?
  `).bind(id, user.id).run()
  
  return c.json({ success: true })
})

// Clear cart
app.delete('/api/cart', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  await c.env.DB.prepare(`
    DELETE FROM cart_items WHERE user_id = ?
  `).bind(user.id).run()
  
  return c.json({ success: true })
})

// ======================
// PAGES ROUTES
// ======================

// Get page by slug
app.get('/api/pages/:slug', async (c) => {
  const slug = c.req.param('slug')
  
  const page = await c.env.DB.prepare(`
    SELECT * FROM pages WHERE slug = ? AND is_active = 1
  `).bind(slug).first()
  
  if (!page) {
    return c.json({ error: 'Page not found' }, 404)
  }
  
  return c.json({ page })
})

// ======================
// ADMIN ROUTES
// ======================

// Get all products (admin)
app.get('/api/admin/products', adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM products ORDER BY created_at DESC
  `).all()
  
  return c.json({ products: results })
})

// Create product (admin)
app.post('/api/admin/products', adminMiddleware, async (c) => {
  const { name, slug, description, price, original_price, image_url, image_url_2, razorpay_link, category, is_featured, stock } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO products (name, slug, description, price, original_price, image_url, image_url_2, razorpay_link, category, is_featured, is_active, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).bind(name, slug, description, price, original_price, image_url, image_url_2 || null, razorpay_link || null, category || null, is_featured ? 1 : 0, stock).run()
  
  const product = await c.env.DB.prepare(`
    SELECT * FROM products WHERE id = ?
  `).bind(result.meta.last_row_id).first()
  
  return c.json({ product })
})

// Update product (admin)
app.put('/api/admin/products/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id')
  const { name, slug, description, price, original_price, image_url, image_url_2, razorpay_link, category, is_featured, is_active, stock } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE products 
    SET name = ?, slug = ?, description = ?, price = ?, original_price = ?, image_url = ?, image_url_2 = ?, razorpay_link = ?, category = ?, is_featured = ?, is_active = ?, stock = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(name, slug, description, price, original_price, image_url, image_url_2 || null, razorpay_link || null, category || null, is_featured ? 1 : 0, is_active ? 1 : 0, stock, id).run()
  
  const product = await c.env.DB.prepare(`
    SELECT * FROM products WHERE id = ?
  `).bind(id).first()
  
  return c.json({ product })
})

// Delete product (admin)
app.delete('/api/admin/products/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare(`
    DELETE FROM products WHERE id = ?
  `).bind(id).run()
  
  return c.json({ success: true })
})

// Get all pages (admin)
app.get('/api/admin/pages', adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM pages ORDER BY created_at DESC
  `).all()
  
  return c.json({ pages: results })
})

// Update page (admin)
app.put('/api/admin/pages/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id')
  const { title, content, meta_title, meta_description } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE pages 
    SET title = ?, content = ?, meta_title = ?, meta_description = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(title, content, meta_title || null, meta_description || null, id).run()
  
  const page = await c.env.DB.prepare(`
    SELECT * FROM pages WHERE id = ?
  `).bind(id).first()
  
  return c.json({ success: true })
})

// ======================
// FRONTEND PAGES
// ======================

// Home page
app.get('/', (c) => {
  return c.html(getLayout('INTRU - Shop', getPageTemplate('home')))
})

// Product page
app.get('/products/:slug', (c) => {
  return c.html(getLayout('Product - INTRU', getPageTemplate('product')))
})

// Terms & Conditions
app.get('/terms', (c) => {
  return c.html(getLayout('Terms & Conditions - INTRU', getPageTemplate('terms')))
})

// Returns & Exchanges
app.get('/returns', (c) => {
  return c.html(getLayout('Returns & Exchanges - INTRU', getPageTemplate('returns')))
})

// Shipping
app.get('/shipping', (c) => {
  return c.html(getLayout('Shipping Policy - INTRU', getPageTemplate('shipping')))
})

// FAQ
app.get('/faq', (c) => {
  return c.html(getLayout('FAQ - INTRU', getPageTemplate('faq')))
})

// Contact (redirect to FAQ with mailto link)
app.get('/contact', (c) => {
  return c.redirect('/faq', 301)
})

// Privacy policy
app.get('/privacy', (c) => {
  return c.html(getLayout('Privacy Policy - INTRU', getPageTemplate('privacy-policy')))
})

// Cart page
app.get('/cart', (c) => {
  return c.html(getLayout('Shopping Cart - INTRU', getPageTemplate('cart')))
})

// Admin dashboard
app.get('/intruadmin', adminMiddleware, (c) => {
  return c.html(getLayout('Admin Dashboard - INTRU', getPageTemplate('admin')))
})

// Admin setup page
app.get('/intruadmin/setup', (c) => {
  return c.html(getLayout('Admin Setup - INTRU', getPageTemplate('setup')))
})

// Backward compatibility redirect
app.get('/setup', (c) => {
  return c.redirect('/intruadmin/setup', 301)
})

// ======================
// HTML LAYOUT & TEMPLATES
// ======================

const getLayout = (title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="INTRU - Built from scratch with a shared love for minimalism & everyday style">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200/50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-2xl font-bold tracking-tight hover:text-gray-700 transition">
                        <span class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">INTRU</span>
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-6">
                    <!-- Navigation links removed as per requirements -->
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="openCart()" class="text-gray-700 hover:text-gray-900 relative">
                        <i class="fas fa-shopping-bag"></i>
                        <span id="cart-count" class="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hidden">0</span>
                    </button>
                    <button onclick="openAuthModal()" id="auth-btn" class="text-gray-700 hover:text-gray-900">
                        <i class="fas fa-user"></i>
                    </button>
                    <div id="user-menu" class="hidden relative">
                        <img id="user-avatar" class="w-8 h-8 rounded-full cursor-pointer" onclick="toggleUserMenu()" />
                        <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <a href="/intruadmin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin</a>
                            <button onclick="logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Content -->
    <div class="pt-16">
        ${content}
    </div>

    <!-- Footer -->
    <footer class="bg-gray-50 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-bold mb-4">INTRU</h3>
                    <p class="text-gray-600 text-sm">Built from scratch with a shared love for minimalism & everyday style.</p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Shop</h4>
                    <ul class="space-y-2 text-gray-600 text-sm">
                        <li><a href="/" class="hover:text-black">All Products</a></li>
                        <li><a href="/brand-story" class="hover:text-black">Our Story</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-600 text-sm">
                        <li><a href="/shipping" class="hover:text-black">Shipping</a></li>
                        <li><a href="/returns" class="hover:text-black">Exchanges</a></li>
                        <li><a href="/faq" class="hover:text-black">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Legal</h4>
                    <ul class="space-y-2 text-gray-600 text-sm">
                        <li><a href="/terms" class="hover:text-black">Terms</a></li>
                        <li><a href="/privacy" class="hover:text-black">Privacy</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
                <p>© ${new Date().getFullYear()} INTRU. All rights reserved. | Contact: <a href="mailto:shop@intru.in" class="hover:text-black">shop@intru.in</a></p>
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <div id="auth-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Login</h2>
                <button onclick="closeAuthModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div id="g_id_onload"
                     data-client_id="YOUR_GOOGLE_CLIENT_ID"
                     data-callback="handleGoogleLogin">
                </div>
                <div class="g_id_signin" data-type="standard"></div>
                
                <button onclick="loginInstagram()" class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:opacity-90 transition">
                    <i class="fab fa-instagram mr-2"></i> Continue with Instagram
                </button>
                
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>
                
                <form onsubmit="loginEmail(event)" class="space-y-4">
                    <input type="email" id="email-input" placeholder="Email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                    <input type="text" id="name-input" placeholder="Name (optional)" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                    <button type="submit" class="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
                        Login with Email
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Cart Sidebar -->
    <div id="cart-sidebar" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div class="flex flex-col h-full">
                <div class="flex justify-between items-center p-6 border-b">
                    <h2 class="text-xl font-bold">Shopping Cart</h2>
                    <button onclick="closeCart()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div id="cart-items" class="flex-1 overflow-y-auto p-6">
                    <!-- Cart items will be inserted here -->
                </div>
                
                <div class="border-t p-6">
                    <div class="flex justify-between mb-4">
                        <span class="font-semibold">Total:</span>
                        <span id="cart-total" class="font-bold text-xl">₹0</span>
                    </div>
                    <button onclick="checkout()" class="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="/static/app.js"></script>
</body>
</html>
`

const getPageTemplate = (page: string) => {
  switch (page) {
    case 'home':
      return '<div id="home-page"></div>'
    case 'shipping':
      return '<div id="shipping-page"></div>'
    case 'returns':
      return '<div id="returns-page"></div>'
    case 'faq':
      return '<div id="faq-page"></div>'
    case 'terms':
      return '<div id="terms-page"></div>'
    case 'privacy-policy':
      return '<div id="privacy-page"></div>'
    case 'cart':
      return '<div id="cart-page"></div>'
    case 'admin':
      return '<div id="admin-page"></div>'
    case 'setup':
      return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <div>
              <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Setup Admin Account
              </h2>
              <p class="mt-2 text-center text-sm text-gray-600">
                Create the first admin account to manage your store
              </p>
            </div>
            <form id="setup-form" class="mt-8 space-y-6">
              <div class="rounded-md shadow-sm -space-y-px">
                <div>
                  <label for="setup-email" class="sr-only">Email address</label>
                  <input id="setup-email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Email address">
                </div>
                <div>
                  <label for="setup-name" class="sr-only">Full name</label>
                  <input id="setup-name" name="name" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Full name">
                </div>
                <div>
                  <label for="setup-password" class="sr-only">Master Key</label>
                  <input id="setup-password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Master Key: 7Intru@">
                </div>
              </div>

              <div>
                <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  Create Admin Account
                </button>
              </div>
              
              <div id="setup-error" class="hidden text-red-600 text-sm text-center"></div>
              <div id="setup-success" class="hidden text-green-600 text-sm text-center"></div>
            </form>
          </div>
        </div>
        
        <script>
          document.getElementById('setup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('setup-email').value;
            const name = document.getElementById('setup-name').value;
            const password = document.getElementById('setup-password').value;
            
            if (password !== '7Intru@') {
              document.getElementById('setup-error').textContent = 'Invalid master key';
              document.getElementById('setup-error').classList.remove('hidden');
              return;
            }
            
            try {
              const response = await fetch('/api/setup/create-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, password })
              });
              
              const data = await response.json();
              
              if (response.ok) {
                localStorage.setItem('session_token', data.sessionToken);
                document.getElementById('setup-success').textContent = 'Admin created! Redirecting...';
                document.getElementById('setup-success').classList.remove('hidden');
                setTimeout(() => {
                  window.location.href = '/intruadmin';
                }, 1500);
              } else {
                document.getElementById('setup-error').textContent = data.error || 'Setup failed';
                document.getElementById('setup-error').classList.remove('hidden');
              }
            } catch (error) {
              document.getElementById('setup-error').textContent = 'Setup failed. Please try again.';
              document.getElementById('setup-error').classList.remove('hidden');
            }
          });
        </script>
      `
    default:
      return '<div>Page not found</div>'
  }
}

// Custom 404 handler (must be last route)
app.notFound((c) => {
  return c.html(getLayout('404 - Page Not Found | INTRU', `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div class="text-center max-w-2xl">
        <div class="mb-8">
          <div class="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p class="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <a href="/" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <i class="fas fa-home text-3xl text-gray-700 mb-2"></i>
              <p class="text-sm font-medium">Home</p>
            </a>
            <a href="/#products" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <i class="fas fa-shopping-bag text-3xl text-gray-700 mb-2"></i>
              <p class="text-sm font-medium">Shop</p>
            </a>
            <a href="/shipping" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <i class="fas fa-shipping-fast text-3xl text-gray-700 mb-2"></i>
              <p class="text-sm font-medium">Shipping</p>
            </a>
            <a href="/faq" class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <i class="fas fa-question-circle text-3xl text-gray-700 mb-2"></i>
              <p class="text-sm font-medium">FAQ</p>
            </a>
          </div>
          
          <a href="/" class="inline-flex items-center px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition text-lg font-medium">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Home
          </a>
        </div>
        
        <div class="text-gray-500 text-sm">
          <p>Need help? Contact us at <a href="mailto:shop@intru.in" class="text-blue-600 underline">shop@intru.in</a></p>
        </div>
      </div>
    </div>
  `), 404)
})

export default app
