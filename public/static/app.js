// API Base URL
const API_URL = '';

// Auth state
let currentUser = null;
let sessionToken = localStorage.getItem('session_token');

// Cart state
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Products cache
let productsCache = [];

// Konami code for admin access
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

// ======================
// AUTHENTICATION
// ======================

async function checkAuth() {
  if (sessionToken) {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
      currentUser = response.data.user;
      updateAuthUI();
      syncCart();
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('session_token');
      sessionToken = null;
    }
  }
  updateCartCount();
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-btn');
  const userMenu = document.getElementById('user-menu');
  const userAvatar = document.getElementById('user-avatar');
  
  if (currentUser) {
    authBtn.classList.add('hidden');
    userMenu.classList.remove('hidden');
    
    if (currentUser.avatar_url) {
      userAvatar.src = currentUser.avatar_url;
    } else {
      userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=000&color=fff`;
    }
  } else {
    authBtn.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function handleGoogleLogin(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  loginWithOAuth('google', payload.sub, payload.email, payload.name, payload.picture);
}

function loginInstagram() {
  alert('Instagram login will be configured with your Instagram App credentials');
}

async function loginEmail(event) {
  event.preventDefault();
  
  const email = document.getElementById('email-input').value;
  const name = document.getElementById('name-input').value;
  
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      name: name || email.split('@')[0]
    });
    
    sessionToken = response.data.sessionToken;
    localStorage.setItem('session_token', sessionToken);
    currentUser = response.data.user;
    
    closeAuthModal();
    updateAuthUI();
    syncCart();
    alert('Welcome back!');
  } catch (error) {
    alert('Login failed. Please try again.');
  }
}

async function loginWithOAuth(provider, provider_id, email, name, avatar_url) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/oauth`, {
      provider,
      provider_id,
      email,
      name,
      avatar_url
    });
    
    sessionToken = response.data.sessionToken;
    localStorage.setItem('session_token', sessionToken);
    currentUser = response.data.user;
    
    closeAuthModal();
    updateAuthUI();
    syncCart();
    alert('Welcome back!');
  } catch (error) {
    alert('Login failed. Please try again.');
  }
}

function toggleUserMenu() {
  document.getElementById('user-dropdown').classList.toggle('hidden');
}

async function logout() {
  try {
    await axios.post(`${API_URL}/api/auth/logout`, {}, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
  
  localStorage.removeItem('session_token');
  sessionToken = null;
  currentUser = null;
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  
  updateAuthUI();
  updateCartCount();
  window.location.href = '/';
}

// ======================
// PRODUCTS
// ======================

async function loadProducts() {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    productsCache = response.data.products;
    return productsCache;
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

// ======================
// CART
// ======================

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (count > 0) {
    countEl.textContent = count;
    countEl.classList.remove('hidden');
  } else {
    countEl.classList.add('hidden');
  }
}

async function addToCart(productId, quantity = 1) {
  const product = productsCache.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.product_id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      product_id: productId,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: quantity,
      razorpay_link: product.razorpay_link
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  if (currentUser) {
    syncCart();
  }
  
  // Show feedback
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check mr-2"></i>Added!';
  btn.classList.add('bg-green-600');
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.classList.remove('bg-green-600');
  }, 1500);
}

async function syncCart() {
  if (!currentUser) return;
  
  for (const item of cart) {
    try {
      await axios.post(`${API_URL}/api/cart`, {
        product_id: item.product_id,
        quantity: item.quantity
      }, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  }
}

function openCart() {
  document.getElementById('cart-sidebar').classList.remove('hidden');
  renderCart();
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.add('hidden');
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
    totalEl.textContent = '₹0';
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalEl.textContent = `₹${total.toFixed(0)}`;
  
  container.innerHTML = cart.map(item => `
    <div class="flex items-center gap-4 mb-4 pb-4 border-b">
      <img src="${item.image_url}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
      <div class="flex-1">
        <h3 class="font-medium">${item.name}</h3>
        <p class="text-gray-600">₹${item.price}</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="updateCartQuantity(${item.product_id}, -1)" class="w-6 h-6 bg-gray-200 rounded">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQuantity(${item.product_id}, 1)" class="w-6 h-6 bg-gray-200 rounded">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${item.product_id})" class="text-red-500 hover:text-red-700">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.product_id === productId);
  if (!item) return;
  
  item.quantity += delta;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
  
  if (currentUser) {
    syncCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product_id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function checkout() {
  if (!currentUser) {
    closeCart();
    openAuthModal();
    alert('Please login to checkout');
    return;
  }
  
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  
  const itemsWithLinks = cart.filter(item => item.razorpay_link);
  
  if (itemsWithLinks.length === cart.length) {
    alert(`Opening ${cart.length} Razorpay payment link(s)`);
    itemsWithLinks.forEach(item => {
      window.open(item.razorpay_link, '_blank');
    });
  } else {
    alert('Some items don\'t have payment links. Please contact support.');
  }
}

// ======================
// PAGE RENDERING
// ======================

async function renderHomePage() {
  const container = document.getElementById('home-page');
  if (!container) return;
  
  const products = await loadProducts();
  
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-black rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-gray-400 rounded-full blur-3xl"></div>
      </div>
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 class="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent animate-fade-in">
          INTRU
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-8 animate-slide-up">
          Built from scratch with a shared love for minimalism & everyday style
        </p>
        <button onclick="document.getElementById('products').scrollIntoView({behavior: 'smooth'})" 
                class="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl">
          Explore Collection
        </button>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold mb-6">Our Story</h2>
            <p class="text-gray-700 mb-4 leading-relaxed">
              At INTRU, we believe that fashion should be effortless, timeless, and accessible. 
              Our journey began with a simple idea: to create clothing that embodies minimalist 
              aesthetics while celebrating individuality.
            </p>
            <p class="text-gray-700 mb-6 leading-relaxed">
              Every piece is thoughtfully crafted and packed with care. We champion slow fashion, 
              designing versatile pieces that work seamlessly together, giving you more freedom 
              and confidence in your everyday style.
            </p>
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-3xl font-bold text-gray-900">100%</div>
                <div class="text-sm text-gray-600">Quality Assured</div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-3xl font-bold text-gray-900">FREE</div>
                <div class="text-sm text-gray-600">Shipping India</div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-2xl">
              <img src="${products[0]?.image_url || ''}" alt="INTRU Collection" class="w-full h-full object-cover opacity-90">
            </div>
            <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-black rounded-full blur-2xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section id="products" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">Shop Collection</h2>
          <p class="text-gray-600">Minimalist pieces for everyday style</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${products.map(product => `
            <div class="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="relative overflow-hidden aspect-square">
                <img src="${product.image_url}" 
                     alt="${product.name}" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                ${product.original_price > product.price ? `
                  <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SALE
                  </div>
                ` : ''}
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${product.name}</h3>
                <div class="flex items-baseline gap-2 mb-4">
                  <span class="text-2xl font-bold">₹${product.price}</span>
                  ${product.original_price > product.price ? `
                    <span class="text-gray-400 line-through">₹${product.original_price}</span>
                  ` : ''}
                </div>
                <div class="flex gap-2">
                  <button onclick="addToCart(${product.id})" 
                          class="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium">
                    <i class="fas fa-shopping-bag mr-2"></i>Add to Cart
                  </button>
                  ${product.razorpay_link ? `
                    <a href="${product.razorpay_link}" target="_blank" 
                       class="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-center">
                      Buy Now
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">Why Choose INTRU</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-leaf text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Sustainable</h3>
            <p class="text-gray-600">Ethical manufacturing and sustainable materials for a better planet</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-gem text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Quality First</h3>
            <p class="text-gray-600">Each piece is designed to last, crafted with precision and care</p>
          </div>
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-heart text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3">Made in Bharat</h3>
            <p class="text-gray-600">Every garment is crafted in India with passion and minimalist design</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function renderPolicyPage(slug) {
  const pageMap = {
    'shipping': 'shipping',
    'returns': 'returns',
    'faq': 'faq',
    'terms': 'terms',
    'privacy': 'privacy-policy'
  };
  
  const actualSlug = pageMap[slug] || slug;
  const containerId = `${slug}-page`;
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  try {
    const response = await axios.get(`${API_URL}/api/pages/${actualSlug}`);
    const page = response.data.page;
    
    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-12">
        ${page.content}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold mb-6">Page Not Found</h1>
        <p class="text-gray-600">Sorry, this page could not be loaded.</p>
      </div>
    `;
  }
}

// ======================
// KONAMI CODE
// ======================

function initKonamiCode() {
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      if (konamiIndex === konamiCode.length) {
        // Konami code completed!
        konamiIndex = 0;
        
        // Show Easter egg animation
        const easter = document.createElement('div');
        easter.className = 'fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center';
        easter.innerHTML = `
          <div class="text-center animate-bounce">
            <div class="text-6xl mb-4">🎮</div>
            <div class="text-white text-3xl font-bold mb-4">KONAMI CODE ACTIVATED!</div>
            <div class="text-gray-300 mb-6">Redirecting to admin panel...</div>
          </div>
        `;
        document.body.appendChild(easter);
        
        setTimeout(() => {
          window.location.href = '/intruadmin';
        }, 2000);
      }
    } else {
      konamiIndex = 0;
    }
  });
}

// ======================
// INITIALIZATION
// ======================

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Konami code
  initKonamiCode();
  
  // Check authentication
  await checkAuth();
  
  // Determine current page and render content
  const path = window.location.pathname;
  
  if (path === '/' || path === '/index.html') {
    await renderHomePage();
  } else if (path === '/shipping') {
    await renderPolicyPage('shipping');
  } else if (path === '/returns') {
    await renderPolicyPage('returns');
  } else if (path === '/faq') {
    await renderPolicyPage('faq');
  } else if (path === '/terms') {
    await renderPolicyPage('terms');
  } else if (path === '/privacy') {
    await renderPolicyPage('privacy');
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#user-menu')) {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown) dropdown.classList.add('hidden');
    }
  });
});
