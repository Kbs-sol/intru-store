// API Base URL
const API_URL = '';

// Auth state
let currentUser = null;
let sessionToken = localStorage.getItem('session_token');

// Cart state (localStorage for guests, API for logged-in users)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// ======================
// AUTHENTICATION
// ======================

// Check authentication on page load
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

// Update auth UI based on login state
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

// Open auth modal
function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
}

// Close auth modal
function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

// Google One Tap Login
function handleGoogleLogin(response) {
  // Decode JWT token
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  
  loginWithOAuth('google', payload.sub, payload.email, payload.name, payload.picture);
}

// Instagram Login
function loginInstagram() {
  // In production, implement Instagram OAuth flow
  // For now, show a message
  alert('Instagram login will be configured with your Instagram App credentials');
  // Example OAuth flow:
  // window.location.href = `https://api.instagram.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user_profile&response_type=code`;
}

// Email Login
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
    
    alert('Logged in successfully!');
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please try again.');
  }
}

// OAuth Login
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
    
    alert('Logged in successfully!');
  } catch (error) {
    console.error('OAuth login failed:', error);
    alert('Login failed. Please try again.');
  }
}

// Logout
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

// Toggle user menu dropdown
function toggleUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  dropdown.classList.toggle('hidden');
}

// ======================
// PRODUCTS
// ======================

// Load products
async function loadProducts(featured = false, category = null) {
  try {
    let url = `${API_URL}/api/products`;
    const params = new URLSearchParams();
    
    if (featured) params.append('featured', 'true');
    if (category) params.append('category', category);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await axios.get(url);
    const products = response.data.products;
    
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
      <div class="group">
        <a href="/products/${product.slug}">
          <div class="relative overflow-hidden rounded-lg mb-4 aspect-square">
            <img src="${product.image_url}" alt="${product.name}" 
                 class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            ${product.original_price > product.price ? '<span class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Sale</span>' : ''}
          </div>
        </a>
        <h3 class="font-semibold text-lg mb-2">
          <a href="/products/${product.slug}" class="hover:text-gray-600">${product.name}</a>
        </h3>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <span class="text-lg font-bold">₹${product.price}</span>
            ${product.original_price > product.price ? `<span class="text-sm text-gray-500 line-through">₹${product.original_price}</span>` : ''}
          </div>
        </div>
        <div class="flex space-x-2">
          ${product.razorpay_link ? `
            <a href="${product.razorpay_link}" target="_blank" 
               class="flex-1 bg-black text-white text-center py-2 rounded-lg hover:bg-gray-800 transition text-sm">
              Buy Now
            </a>
          ` : ''}
          <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image_url}', '${product.razorpay_link || ''}')" 
                  class="flex-1 border border-gray-300 py-2 rounded-lg hover:border-gray-400 transition text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

// Load single product
async function loadProductDetail() {
  const slug = window.location.pathname.split('/').pop();
  
  try {
    const response = await axios.get(`${API_URL}/api/products/${slug}`);
    const product = response.data.product;
    
    const container = document.getElementById('product-detail');
    if (!container) return;
    
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div class="relative aspect-square rounded-lg overflow-hidden mb-4">
            <img id="main-image" src="${product.image_url}" alt="${product.name}" 
                 class="w-full h-full object-cover">
          </div>
          ${product.image_url_2 ? `
            <div class="grid grid-cols-2 gap-4">
              <img src="${product.image_url}" alt="${product.name}" 
                   onclick="document.getElementById('main-image').src='${product.image_url}'"
                   class="w-full aspect-square object-cover rounded-lg cursor-pointer border-2 border-black">
              <img src="${product.image_url_2}" alt="${product.name}" 
                   onclick="document.getElementById('main-image').src='${product.image_url_2}'"
                   class="w-full aspect-square object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-gray-300">
            </div>
          ` : ''}
        </div>
        
        <div>
          <h1 class="text-4xl font-bold mb-4">${product.name}</h1>
          <div class="flex items-center space-x-3 mb-6">
            <span class="text-3xl font-bold">₹${product.price}</span>
            ${product.original_price > product.price ? `
              <span class="text-xl text-gray-500 line-through">₹${product.original_price}</span>
              <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Save ${Math.round((1 - product.price / product.original_price) * 100)}%
              </span>
            ` : ''}
          </div>
          
          <p class="text-gray-600 mb-8 leading-relaxed">${product.description || ''}</p>
          
          <div class="space-y-4">
            ${product.razorpay_link ? `
              <a href="${product.razorpay_link}" target="_blank" 
                 class="block w-full bg-black text-white text-center py-4 rounded-lg hover:bg-gray-800 transition font-medium text-lg">
                Buy Now with Razorpay
              </a>
            ` : ''}
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image_url}', '${product.razorpay_link || ''}')" 
                    class="w-full border-2 border-black py-4 rounded-lg hover:bg-gray-50 transition font-medium text-lg">
              Add to Cart
            </button>
          </div>
          
          <div class="mt-8 border-t pt-8 space-y-4">
            <div class="flex items-start">
              <i class="fas fa-truck text-2xl mr-4"></i>
              <div>
                <h4 class="font-semibold">Free Shipping</h4>
                <p class="text-sm text-gray-600">On orders above ₹2000</p>
              </div>
            </div>
            <div class="flex items-start">
              <i class="fas fa-undo text-2xl mr-4"></i>
              <div>
                <h4 class="font-semibold">Easy Returns</h4>
                <p class="text-sm text-gray-600">7 days return policy</p>
              </div>
            </div>
            <div class="flex items-start">
              <i class="fas fa-shield-alt text-2xl mr-4"></i>
              <div>
                <h4 class="font-semibold">Secure Payment</h4>
                <p class="text-sm text-gray-600">Powered by Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load product:', error);
  }
}

// ======================
// CART
// ======================

// Add to cart
function addToCart(id, name, price, image, razorpayLink) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, image, razorpayLink, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // If logged in, sync with server
  if (currentUser) {
    syncCartToServer(id, 1);
  }
  
  // Show notification
  showNotification('Added to cart!');
}

// Sync local cart with server
async function syncCart() {
  if (!currentUser) return;
  
  try {
    // Get server cart
    const response = await axios.get(`${API_URL}/api/cart`, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
    
    const serverCart = response.data.items;
    
    // Merge local cart with server cart
    for (const item of cart) {
      const exists = serverCart.find(s => s.product_id === item.id);
      if (!exists) {
        await syncCartToServer(item.id, item.quantity);
      }
    }
    
    // Update local cart from server
    cart = serverCart.map(item => ({
      id: item.product_id,
      name: item.name,
      price: item.price,
      image: item.image_url,
      razorpayLink: item.razorpay_link,
      quantity: item.quantity,
      cartItemId: item.id
    }));
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  } catch (error) {
    console.error('Failed to sync cart:', error);
  }
}

// Sync cart item to server
async function syncCartToServer(productId, quantity) {
  if (!currentUser) return;
  
  try {
    await axios.post(`${API_URL}/api/cart`, {
      product_id: productId,
      quantity: quantity
    }, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
  } catch (error) {
    console.error('Failed to sync cart to server:', error);
  }
}

// Update cart count
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// Open cart sidebar
function openCart() {
  document.getElementById('cart-sidebar').classList.remove('hidden');
  renderCart();
}

// Close cart sidebar
function closeCart() {
  document.getElementById('cart-sidebar').classList.add('hidden');
}

// Render cart
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
    totalEl.textContent = '₹0';
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalEl.textContent = `₹${total.toFixed(2)}`;
  
  container.innerHTML = cart.map(item => `
    <div class="flex items-start space-x-4 pb-4 border-b">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
      <div class="flex-1">
        <h3 class="font-semibold mb-1">${item.name}</h3>
        <p class="text-sm text-gray-600 mb-2">₹${item.price}</p>
        <div class="flex items-center space-x-3">
          <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" 
                  class="w-8 h-8 border rounded-lg hover:bg-gray-100">-</button>
          <span class="font-medium">${item.quantity}</span>
          <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" 
                  class="w-8 h-8 border rounded-lg hover:bg-gray-100">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}

// Update cart quantity
function updateCartQuantity(id, quantity) {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (currentUser && item.cartItemId) {
      updateCartOnServer(item.cartItemId, quantity);
    }
    
    updateCartCount();
    renderCart();
  }
}

// Remove from cart
function removeFromCart(id) {
  const item = cart.find(item => item.id === id);
  
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  if (currentUser && item.cartItemId) {
    deleteCartOnServer(item.cartItemId);
  }
  
  updateCartCount();
  renderCart();
}

// Update cart on server
async function updateCartOnServer(cartItemId, quantity) {
  if (!currentUser) return;
  
  try {
    await axios.put(`${API_URL}/api/cart/${cartItemId}`, {
      quantity: quantity
    }, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
  } catch (error) {
    console.error('Failed to update cart on server:', error);
  }
}

// Delete cart on server
async function deleteCartOnServer(cartItemId) {
  if (!currentUser) return;
  
  try {
    await axios.delete(`${API_URL}/api/cart/${cartItemId}`, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
  } catch (error) {
    console.error('Failed to delete cart item on server:', error);
  }
}

// Checkout
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
  
  // If all items have Razorpay links, open them
  const itemsWithLinks = cart.filter(item => item.razorpayLink);
  
  if (itemsWithLinks.length === cart.length) {
    // All items have Razorpay links
    alert(`Opening ${cart.length} Razorpay payment link(s). Complete your purchase in the new tab(s).`);
    itemsWithLinks.forEach(item => {
      window.open(item.razorpay_link, '_blank');
    });
  } else {
    // Some items don't have links
    alert('Some items in your cart don\'t have payment links configured. Please contact support.');
  }
}

// ======================
// PAGES
// ======================

// Load page content
async function loadPage(slug) {
  try {
    const response = await axios.get(`${API_URL}/api/pages/${slug}`);
    const page = response.data.page;
    
    const container = document.getElementById('page-content');
    if (!container) return;
    
    // Simple markdown rendering (basic)
    let html = page.content
      .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mb-4 mt-8">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-semibold mb-3 mt-6">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>');
    
    html = '<p class="mb-4">' + html + '</p>';
    html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>)/s, '<ul class="list-disc mb-4">$1</ul>');
    
    container.innerHTML = html;
    
    // Update meta tags
    if (page.meta_title) {
      document.title = page.meta_title;
    }
    if (page.meta_description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = page.meta_description;
      }
    }
  } catch (error) {
    console.error('Failed to load page:', error);
  }
}

// ======================
// ADMIN
// ======================

// Check admin auth
async function checkAdminAuth() {
  if (!currentUser) {
    window.location.href = '/';
    return;
  }
  
  if (currentUser.is_admin !== 1) {
    alert('Access denied. Admin privileges required.');
    window.location.href = '/';
  }
}

// Show admin tab
function showAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(el => {
    el.classList.remove('active', 'border-black', 'text-black');
    el.classList.add('border-transparent', 'text-gray-500');
  });
  
  event.target.classList.add('active', 'border-black', 'text-black');
  event.target.classList.remove('border-transparent', 'text-gray-500');
  
  document.querySelectorAll('.admin-panel').forEach(el => el.classList.add('hidden'));
  document.getElementById(`admin-${tab}`).classList.remove('hidden');
  
  if (tab === 'products') {
    loadAdminProducts();
  } else if (tab === 'pages') {
    loadAdminPages();
  }
}

// Load admin products
async function loadAdminProducts() {
  try {
    const response = await axios.get(`${API_URL}/api/admin/products`, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
    
    const products = response.data.products;
    const container = document.getElementById('products-list');
    
    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${products.map(product => `
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img src="${product.image_url}" alt="${product.name}" class="w-10 h-10 rounded object-cover mr-3">
                    <div>
                      <div class="font-medium">${product.name}</div>
                      <div class="text-sm text-gray-500">${product.slug}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">₹${product.price}</td>
                <td class="px-6 py-4 whitespace-nowrap">${product.category}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button onclick='editProduct(${JSON.stringify(product)})' class="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                  <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load admin products:', error);
  }
}

// Open product modal
function openProductModal() {
  document.getElementById('product-modal').classList.remove('hidden');
  document.getElementById('product-form').reset();
  document.getElementById('product-id').value = '';
}

// Close product modal
function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
}

// Edit product
function editProduct(product) {
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-slug').value = product.slug;
  document.getElementById('product-description').value = product.description || '';
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-original-price').value = product.original_price || '';
  document.getElementById('product-image').value = product.image_url;
  document.getElementById('product-image-2').value = product.image_url_2 || '';
  document.getElementById('product-razorpay').value = product.razorpay_link || '';
  document.getElementById('product-category').value = product.category || '';
  document.getElementById('product-featured').checked = product.is_featured === 1;
  
  document.getElementById('product-modal').classList.remove('hidden');
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    await axios.delete(`${API_URL}/api/admin/products/${id}`, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
    
    loadAdminProducts();
    showNotification('Product deleted successfully!');
  } catch (error) {
    console.error('Failed to delete product:', error);
    alert('Failed to delete product');
  }
}

// Save product
document.getElementById('product-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('product-id').value;
  const data = {
    name: document.getElementById('product-name').value,
    slug: document.getElementById('product-slug').value,
    description: document.getElementById('product-description').value,
    price: parseFloat(document.getElementById('product-price').value),
    original_price: parseFloat(document.getElementById('product-original-price').value) || null,
    image_url: document.getElementById('product-image').value,
    image_url_2: document.getElementById('product-image-2').value || null,
    razorpay_link: document.getElementById('product-razorpay').value || null,
    category: document.getElementById('product-category').value,
    is_featured: document.getElementById('product-featured').checked,
    stock: 100
  };
  
  try {
    if (id) {
      await axios.put(`${API_URL}/api/admin/products/${id}`, data, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
    } else {
      await axios.post(`${API_URL}/api/admin/products`, data, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
    }
    
    closeProductModal();
    loadAdminProducts();
    showNotification('Product saved successfully!');
  } catch (error) {
    console.error('Failed to save product:', error);
    alert('Failed to save product');
  }
});

// Load admin pages
async function loadAdminPages() {
  try {
    const response = await axios.get(`${API_URL}/api/admin/pages`, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
    
    const pages = response.data.pages;
    const container = document.getElementById('pages-list');
    
    container.innerHTML = `
      <div class="space-y-4">
        ${pages.map(page => `
          <div class="border rounded-lg p-6">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-xl font-semibold">${page.title}</h3>
                <p class="text-sm text-gray-500">/${page.slug}</p>
              </div>
              <button onclick='editPage(${JSON.stringify(page)})' class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                Edit
              </button>
            </div>
            <p class="text-gray-600 text-sm mt-2">${page.meta_description || ''}</p>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Failed to load admin pages:', error);
  }
}

// Edit page
function editPage(page) {
  document.getElementById('page-id').value = page.id;
  document.getElementById('page-title').value = page.title;
  document.getElementById('page-content').value = page.content;
  document.getElementById('page-meta-title').value = page.meta_title || '';
  document.getElementById('page-meta-description').value = page.meta_description || '';
  
  document.getElementById('page-modal').classList.remove('hidden');
}

// Close page modal
function closePageModal() {
  document.getElementById('page-modal').classList.add('hidden');
}

// Save page
document.getElementById('page-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('page-id').value;
  const data = {
    title: document.getElementById('page-title').value,
    content: document.getElementById('page-content').value,
    meta_title: document.getElementById('page-meta-title').value,
    meta_description: document.getElementById('page-meta-description').value
  };
  
  try {
    await axios.put(`${API_URL}/api/admin/pages/${id}`, data, {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });
    
    closePageModal();
    loadAdminPages();
    showNotification('Page updated successfully!');
  } catch (error) {
    console.error('Failed to update page:', error);
    alert('Failed to update page');
  }
});

// ======================
// UTILITIES
// ======================

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Load cart page
async function loadCartPage() {
  const container = document.getElementById('cart-page-content');
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-20">
        <i class="fas fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
        <h2 class="text-2xl font-bold mb-4">Your cart is empty</h2>
        <a href="/" class="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800">
          Continue Shopping
        </a>
      </div>
    `;
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        ${cart.map(item => `
          <div class="flex items-start space-x-4 p-6 border rounded-lg">
            <img src="${item.image}" alt="${item.name}" class="w-32 h-32 object-cover rounded-lg">
            <div class="flex-1">
              <h3 class="text-xl font-semibold mb-2">${item.name}</h3>
              <p class="text-gray-600 mb-4">₹${item.price}</p>
              <div class="flex items-center space-x-4">
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" 
                        class="w-10 h-10 border rounded-lg hover:bg-gray-100">-</button>
                <span class="font-medium text-lg">${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})" 
                        class="w-10 h-10 border rounded-lg hover:bg-gray-100">+</button>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold mb-4">₹${(item.price * item.quantity).toFixed(2)}</p>
              <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div>
        <div class="border rounded-lg p-6 sticky top-24">
          <h3 class="text-xl font-bold mb-4">Order Summary</h3>
          <div class="space-y-2 mb-6">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>${total >= 2000 ? 'FREE' : '₹100'}</span>
            </div>
            <div class="border-t pt-2 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹${(total + (total >= 2000 ? 0 : 100)).toFixed(2)}</span>
            </div>
          </div>
          <button onclick="checkout()" class="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 font-medium text-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
