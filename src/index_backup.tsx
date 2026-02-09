import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { getCookie } from 'hono/cookie'

// Types
type Bindings = {
  DB: D1Database
  ADMIN_API_KEY?: string
}

type Variables = {
  user?: User
}

interface User {
  id: number
  email: string
  name: string
  provider: string
  is_admin: number
  role?: string
  avatar_url?: string
}

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  original_price: number
  image_url: string
  image_url_2?: string
  razorpay_link?: string
  category: string
  is_featured: number
  is_active: number
  stock: number
}

interface Page {
  id: number
  slug: string
  title: string
  content: string
  meta_title?: string
  meta_description?: string
  is_active: number
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Auth middleware
const authMiddleware = async (c: any, next: any) => {
  const sessionToken = c.req.header('Authorization')?.replace('Bearer ', '') || 
                       getCookie(c, 'session_token')
  
  if (sessionToken) {
    const session = await c.env.DB.prepare(`
      SELECT u.* FROM users u
      INNER JOIN sessions s ON u.id = s.user_id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(sessionToken).first()
    
    if (session) {
      c.set('user', session as User)
    }
  }
  
  await next()
}

// Dynamic Admin Lock Middleware with Master Key
const adminMiddleware = async (c: any, next: any) => {
  const adminSecret = c.env.ADMIN_API_KEY
  const providedKey = c.req.header('X-Admin-Key')
  
  // Check if any admin user exists in the database
  const { results } = await c.env.DB.prepare(
    "SELECT id FROM users WHERE role = 'admin' OR is_admin = 1 LIMIT 1"
  ).all()
  
  const adminExists = results.length > 0
  
  if (!adminExists) {
    // PHASE 1: No admin yet. Allow access via master key.
    const masterKey = adminSecret || '7Intru@'
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

// Apply auth middleware to all routes
app.use('*', authMiddleware)

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
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  
  await c.env.DB.prepare(`
    INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)
  `).bind(user.id, sessionToken, expiresAt).run()
  
  return c.json({ user, sessionToken })
})

// Login with OAuth (Google/Instagram)
app.post('/api/auth/oauth', async (c) => {
  const { provider, provider_id, email, name, avatar_url } = await c.req.json()
  
  // Check if user exists
  let user = await c.env.DB.prepare(`
    SELECT * FROM users WHERE provider = ? AND provider_id = ?
  `).bind(provider, provider_id).first() as User | null
  
  // Create or update user
  if (!user) {
    const result = await c.env.DB.prepare(`
      INSERT INTO users (email, name, provider, provider_id, avatar_url) 
      VALUES (?, ?, ?, ?, ?)
    `).bind(email, name, provider, provider_id, avatar_url).run()
    
    user = await c.env.DB.prepare(`
      SELECT * FROM users WHERE id = ?
    `).bind(result.meta.last_row_id).first() as User
  } else {
    // Update user info
    await c.env.DB.prepare(`
      UPDATE users SET name = ?, avatar_url = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(name, avatar_url, user.id).run()
    
    user.name = name
    user.avatar_url = avatar_url
  }
  
  // Create session
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  
  await c.env.DB.prepare(`
    INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)
  `).bind(user.id, sessionToken, expiresAt).run()
  
  return c.json({ user, sessionToken })
})

// Logout
app.post('/api/auth/logout', async (c) => {
  const sessionToken = c.req.header('Authorization')?.replace('Bearer ', '') || 
                       c.req.cookie('session_token')
  
  if (sessionToken) {
    await c.env.DB.prepare(`
      DELETE FROM sessions WHERE session_token = ?
    `).bind(sessionToken).run()
  }
  
  return c.json({ success: true })
})

// Get current user
app.get('/api/auth/me', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  return c.json({ user })
})

// ======================
// PRODUCTS ROUTES
// ======================

// Get all products
app.get('/api/products', async (c) => {
  const featured = c.req.query('featured')
  const category = c.req.query('category')
  
  let query = 'SELECT * FROM products WHERE is_active = 1'
  const params: any[] = []
  
  if (featured === 'true') {
    query += ' AND is_featured = 1'
  }
  
  if (category) {
    query += ' AND category = ?'
    params.push(category)
  }
  
  query += ' ORDER BY created_at DESC'
  
  const stmt = params.length > 0 
    ? c.env.DB.prepare(query).bind(...params)
    : c.env.DB.prepare(query)
  
  const { results } = await stmt.all()
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

// Get user cart
app.get('/api/cart', async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  const { results } = await c.env.DB.prepare(`
    SELECT 
      c.id, c.quantity, c.created_at,
      p.id as product_id, p.name, p.slug, p.price, p.image_url, p.razorpay_link
    FROM cart_items c
    INNER JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
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
  
  // Check if already in cart
  const existing = await c.env.DB.prepare(`
    SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?
  `).bind(user.id, product_id).first()
  
  if (existing) {
    // Update quantity
    await c.env.DB.prepare(`
      UPDATE cart_items SET quantity = quantity + ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(quantity, (existing as any).id).run()
  } else {
    // Insert new
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
    UPDATE cart_items SET quantity = ?, updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `).bind(quantity, id, user.id).run()
  
  return c.json({ success: true })
})

// Remove from cart
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
  const data = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO products (name, slug, description, price, original_price, image_url, image_url_2, razorpay_link, category, is_featured, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.name, data.slug, data.description, data.price, data.original_price,
    data.image_url, data.image_url_2, data.razorpay_link, data.category,
    data.is_featured ? 1 : 0, data.stock || 100
  ).run()
  
  return c.json({ id: result.meta.last_row_id })
})

// Update product (admin)
app.put('/api/admin/products/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE products 
    SET name = ?, slug = ?, description = ?, price = ?, original_price = ?,
        image_url = ?, image_url_2 = ?, razorpay_link = ?, category = ?,
        is_featured = ?, stock = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(
    data.name, data.slug, data.description, data.price, data.original_price,
    data.image_url, data.image_url_2, data.razorpay_link, data.category,
    data.is_featured ? 1 : 0, data.stock, id
  ).run()
  
  return c.json({ success: true })
})

// Delete product (admin)
app.delete('/api/admin/products/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare(`
    UPDATE products SET is_active = 0 WHERE id = ?
  `).bind(id).run()
  
  return c.json({ success: true })
})

// Get all pages (admin)
app.get('/api/admin/pages', adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT * FROM pages ORDER BY slug
  `).all()
  
  return c.json({ pages: results })
})

// Update page (admin)
app.put('/api/admin/pages/:id', adminMiddleware, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE pages 
    SET title = ?, content = ?, meta_title = ?, meta_description = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(data.title, data.content, data.meta_title, data.meta_description, id).run()
  
  return c.json({ success: true })
})

// ======================
// FRONTEND ROUTES
// ======================

// Homepage
app.get('/', (c) => {
  return c.html(getLayout('Home', getHomePage()))
})

// Product page
app.get('/products/:slug', (c) => {
  return c.html(getLayout('Product', getProductPage()))
})

// Our Story
app.get('/story', (c) => {
  return c.html(getLayout('Our Story', getPageTemplate('brand-story')))
})

// Terms and conditions
app.get('/terms', (c) => {
  return c.html(getLayout('Terms & Conditions', getPageTemplate('terms')))
})

// Exchanges
app.get('/exchanges', (c) => {
  return c.html(getLayout('Exchanges', getPageTemplate('exchanges')))
})

// Shipping
app.get('/shipping', (c) => {
  return c.html(getLayout('Shipping & Delivery', getPageTemplate('shipping')))
})

// FAQ
app.get('/faq', (c) => {
  return c.html(getLayout('FAQs', getPageTemplate('faq')))
})

// Contact
app.get('/contact', (c) => {
  return c.html(getLayout('Contact Us', getPageTemplate('contact')))
})

// Privacy policy
app.get('/privacy', (c) => {
  return c.html(getLayout('Privacy Policy', getPageTemplate('privacy-policy')))
})

// Cart page
app.get('/cart', (c) => {
  return c.html(getLayout('Cart', getCartPage()))
})

// Admin dashboard
app.get('/admin', (c) => {
  return c.html(getLayout('Admin Dashboard', getAdminPage()))
})

// ======================
// HTML TEMPLATES
// ======================

function getLayout(title: string, content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - INTRU</title>
    <meta name="description" content="INTRU - Built from scratch with a shared love for minimalism & everyday style">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    </style>
</head>
<body class="bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200/50 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-8">
                    <a href="/" class="text-2xl font-bold tracking-tight hover:text-gray-700 transition">INTRU</a>
                </div>
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/" class="text-gray-700 hover:text-black font-medium transition">Shop</a>
                    <a href="/story" class="text-gray-700 hover:text-black font-medium transition">Our Story</a>
                    <a href="/shipping" class="text-gray-700 hover:text-black font-medium transition">Shipping</a>
                    <a href="/exchanges" class="text-gray-700 hover:text-black font-medium transition">Exchanges</a>
                    <a href="/faq" class="text-gray-700 hover:text-black font-medium transition">FAQ</a>
                    <a href="/contact" class="text-gray-700 hover:text-black font-medium transition">Contact</a>
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
                            <a href="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin</a>
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
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li><a href="/">All Products</a></li>
                        <li><a href="/?category=T-Shirts">T-Shirts</a></li>
                        <li><a href="/?category=Shirts">Shirts</a></li>
                        <li><a href="/?category=Tops">Tops</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Information</h4>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li><a href="/story" class="hover:text-black transition">Our Story</a></li>
                        <li><a href="/shipping" class="hover:text-black transition">Shipping</a></li>
                        <li><a href="/exchanges" class="hover:text-black transition">Exchanges</a></li>
                        <li><a href="/faq" class="hover:text-black transition">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Legal</h4>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li><a href="/terms" class="hover:text-black transition">Terms & Conditions</a></li>
                        <li><a href="/privacy" class="hover:text-black transition">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Connect</h4>
                    <p class="text-sm text-gray-600 mb-3">📧 shop@intru.in</p>
                    <p class="text-sm text-gray-600 mb-3">Managed by:<br/>Ramya Gowda<br/>Venkat Pradeep Vadde</p>
                    <div class="flex space-x-4 mt-4">
                        <a href="https://instagram.com/intru.in" target="_blank" class="text-gray-600 hover:text-black transition"><i class="fab fa-instagram text-xl"></i></a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
                <p>&copy; 2026 INTRU. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Auth Modal -->
    <div id="auth-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Sign In</h2>
                <button onclick="closeAuthModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Google One Tap -->
            <div id="g_id_onload"
                 data-client_id="YOUR_GOOGLE_CLIENT_ID"
                 data-context="signin"
                 data-ux_mode="popup"
                 data-callback="handleGoogleLogin"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin" 
                 data-type="standard"
                 data-shape="rectangular"
                 data-theme="outline"
                 data-text="signin_with"
                 data-size="large"
                 data-logo_alignment="left">
            </div>
            
            <div class="my-4 text-center text-gray-500">or</div>
            
            <!-- Instagram Login -->
            <button onclick="loginInstagram()" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg mb-3 font-medium hover:opacity-90">
                <i class="fab fa-instagram mr-2"></i> Continue with Instagram
            </button>
            
            <div class="my-4 text-center text-gray-500">or</div>
            
            <!-- Email Login -->
            <form onsubmit="loginEmail(event)" class="space-y-4">
                <input type="email" id="email-input" placeholder="Email" required
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                <input type="text" id="name-input" placeholder="Name (optional)"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                <button type="submit" class="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800">
                    Continue with Email
                </button>
            </form>
        </div>
    </div>

    <!-- Cart Sidebar -->
    <div id="cart-sidebar" class="hidden fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Shopping Cart</h2>
                <button onclick="closeCart()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="cart-items" class="space-y-4 mb-6">
                <!-- Cart items will be inserted here -->
            </div>
            <div class="border-t pt-4">
                <div class="flex justify-between text-lg font-bold mb-4">
                    <span>Total</span>
                    <span id="cart-total">₹0</span>
                </div>
                <button onclick="checkout()" class="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800">
                    Checkout
                </button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/app.js"></script>
</body>
</html>
  `
}

function getHomePage() {
  return `
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div class="text-center px-4">
            <h1 class="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                STYLE REDEFINED
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-8">
                Effortlessly Yours
            </p>
            <a href="#products" class="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition">
                Shop Now
            </a>
        </div>
    </section>

    <!-- Products Section -->
    <section id="products" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-12">
            <h2 class="text-4xl font-bold mb-4">New Arrivals</h2>
            <p class="text-gray-600">Shop the Latest Styles: Stay ahead of the curve with our newest arrivals</p>
        </div>
        
        <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Products will be loaded here -->
        </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-50 py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                    <div class="text-4xl mb-4"><i class="fas fa-shipping-fast"></i></div>
                    <h3 class="font-semibold mb-2">Free Shipping</h3>
                    <p class="text-sm text-gray-600">Orders above ₹2000</p>
                </div>
                <div>
                    <div class="text-4xl mb-4"><i class="fas fa-undo"></i></div>
                    <h3 class="font-semibold mb-2">Money-back</h3>
                    <p class="text-sm text-gray-600">7 day Guarantee</p>
                </div>
                <div>
                    <div class="text-4xl mb-4"><i class="fas fa-headset"></i></div>
                    <h3 class="font-semibold mb-2">Premium Support</h3>
                    <p class="text-sm text-gray-600">Email support</p>
                </div>
                <div>
                    <div class="text-4xl mb-4"><i class="fas fa-lock"></i></div>
                    <h3 class="font-semibold mb-2">Secure Payments</h3>
                    <p class="text-sm text-gray-600">Secured by Razorpay</p>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Load products on page load
        window.addEventListener('DOMContentLoaded', () => {
            loadProducts();
        });
    </script>
  `
}

function getProductPage() {
  return `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="product-detail">
            <!-- Product details will be loaded here -->
        </div>
    </section>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            loadProductDetail();
        });
    </script>
  `
}

function getPageTemplate(slug: string) {
  return `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="page-content" class="prose prose-lg max-w-none">
            <!-- Page content will be loaded here -->
        </div>
    </section>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            loadPage('${slug}');
        });
    </script>
  `
}

function getCartPage() {
  return `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8">Shopping Cart</h1>
        <div id="cart-page-content">
            <!-- Cart content will be loaded here -->
        </div>
    </section>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            loadCartPage();
        });
    </script>
  `
}

function getAdminPage() {
  return `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        <div class="mb-8">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button onclick="showAdminTab('products')" class="admin-tab active border-b-2 border-black py-4 px-1 text-sm font-medium">
                        Products
                    </button>
                    <button onclick="showAdminTab('pages')" class="admin-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                        Pages
                    </button>
                </nav>
            </div>
        </div>

        <div id="admin-products" class="admin-panel">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Products</h2>
                <button onclick="openProductModal()" class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                    Add Product
                </button>
            </div>
            <div id="products-list">
                <!-- Products list will be loaded here -->
            </div>
        </div>

        <div id="admin-pages" class="admin-panel hidden">
            <h2 class="text-2xl font-bold mb-6">Pages</h2>
            <div id="pages-list">
                <!-- Pages list will be loaded here -->
            </div>
        </div>
    </section>

    <!-- Product Modal -->
    <div id="product-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Product Details</h2>
                <button onclick="closeProductModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="product-form" class="space-y-4">
                <input type="hidden" id="product-id">
                <input type="text" id="product-name" placeholder="Product Name" required class="w-full px-4 py-2 border rounded-lg">
                <input type="text" id="product-slug" placeholder="Slug (e.g., doodles-tshirt)" required class="w-full px-4 py-2 border rounded-lg">
                <textarea id="product-description" placeholder="Description" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
                <div class="grid grid-cols-2 gap-4">
                    <input type="number" id="product-price" placeholder="Price" required class="w-full px-4 py-2 border rounded-lg">
                    <input type="number" id="product-original-price" placeholder="Original Price" class="w-full px-4 py-2 border rounded-lg">
                </div>
                <input type="text" id="product-image" placeholder="Image URL" required class="w-full px-4 py-2 border rounded-lg">
                <input type="text" id="product-image-2" placeholder="Second Image URL" class="w-full px-4 py-2 border rounded-lg">
                <input type="text" id="product-razorpay" placeholder="Razorpay Buy Now Link" class="w-full px-4 py-2 border rounded-lg">
                <input type="text" id="product-category" placeholder="Category" class="w-full px-4 py-2 border rounded-lg">
                <div class="flex items-center">
                    <input type="checkbox" id="product-featured" class="mr-2">
                    <label for="product-featured">Featured Product</label>
                </div>
                <button type="submit" class="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                    Save Product
                </button>
            </form>
        </div>
    </div>

    <!-- Page Modal -->
    <div id="page-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Edit Page</h2>
                <button onclick="closePageModal()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="page-form" class="space-y-4">
                <input type="hidden" id="page-id">
                <input type="text" id="page-title" placeholder="Page Title" required class="w-full px-4 py-2 border rounded-lg">
                <textarea id="page-content" placeholder="Content (Markdown supported)" rows="15" required class="w-full px-4 py-2 border rounded-lg font-mono text-sm"></textarea>
                <input type="text" id="page-meta-title" placeholder="Meta Title (SEO)" class="w-full px-4 py-2 border rounded-lg">
                <textarea id="page-meta-description" placeholder="Meta Description (SEO)" rows="2" class="w-full px-4 py-2 border rounded-lg"></textarea>
                <button type="submit" class="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                    Save Page
                </button>
            </form>
        </div>
    </div>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            checkAdminAuth();
            loadAdminProducts();
        });
    </script>
  `
}

export default app
