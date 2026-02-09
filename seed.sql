-- Insert 6 products from intru.in with complete data
INSERT OR IGNORE INTO products (id, name, slug, description, price, original_price, image_url, image_url_2, category, is_featured, is_active, stock) VALUES 
  (1, 'Doodles T-Shirt', 'doodles-tshirt', 'Oversized tee with unique doodle artwork. Made for comfort and style, perfect for everyday wear. Limited stock available.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05839_1.jpg?v=1730301823', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05836.jpg?v=1730301823', 'T-Shirts', 1, 1, 50),
  (2, 'No Risk Porsche T-Shirt', 'porsche-tshirt', 'Bold Porsche graphic tee. Oversized fit with premium cotton blend. Express your passion for speed and style.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05927_2.jpg?v=1730301907', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05923.jpg?v=1730301907', 'T-Shirts', 1, 1, 50),
  (3, 'Orange Puff Printed T-Shirt', 'orange-puff-tshirt', 'Statement piece with 3D puff printing. Vibrant orange accents on premium fabric. Stand out from the crowd.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05910_3.jpg?v=1730301968', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05909.jpg?v=1730301968', 'T-Shirts', 1, 1, 50),
  (4, 'Romanticise Crop Tee', 'romanticise-crop-tee', 'Minimalist crop tee for effortless style. Perfect for layering or solo wear. Limited edition design.', 699.00, 999.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05883.jpg?v=1730301994', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05877.jpg?v=1730301994', 'Tops', 1, 1, 50),
  (5, 'Stripe 18 Shirt', 'stripe-18-shirt', 'Classic striped shirt reimagined. Premium fabric with modern fit. Versatile piece for any occasion.', 1099.00, 1699.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05899.jpg?v=1730302024', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05895.jpg?v=1730302024', 'Shirts', 1, 1, 50),
  (6, 'Summer Shirt', 'summer-shirt', 'Lightweight summer essential. Breathable fabric perfect for Indian summers. Minimal design, maximum comfort.', 999.00, 1599.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05865.jpg?v=1730302047', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05862.jpg?v=1730302047', 'Shirts', 1, 1, 50);

-- Insert all policy and content pages
INSERT OR IGNORE INTO pages (slug, title, content, meta_title, meta_description, is_active) VALUES 
  
  -- Shipping & Delivery Page
  ('shipping', 'Shipping & Delivery', 
   '<div class="prose max-w-none">
      <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-2xl mb-8">
        <h1 class="text-4xl font-bold mb-4 text-white">Shipping & Delivery</h1>
        <p class="text-xl text-gray-100">Fast, reliable shipping across India. Track your order every step of the way.</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <div class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-clock text-white text-xl"></i>
            </div>
            <h2 class="text-2xl font-bold">Processing Time</h2>
          </div>
          <p class="text-gray-700 mb-4">Orders are processed within <strong>1-2 business days</strong> after payment confirmation.</p>
          <p class="text-gray-600 text-sm">Orders placed on weekends or public holidays will be processed the next business day.</p>
        </div>
        
        <div class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-shipping-fast text-white text-xl"></i>
            </div>
            <h2 class="text-2xl font-bold">Delivery Time</h2>
          </div>
          <ul class="text-gray-700 space-y-2">
            <li><i class="fas fa-check-circle text-green-500 mr-2"></i><strong>Metro cities:</strong> 3-5 business days</li>
            <li><i class="fas fa-check-circle text-green-500 mr-2"></i><strong>Other cities:</strong> 4-7 business days</li>
            <li><i class="fas fa-check-circle text-green-500 mr-2"></i><strong>Remote areas:</strong> 7-10 business days</li>
          </ul>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-8 mb-8">
        <div class="flex items-center mb-4">
          <i class="fas fa-gift text-green-600 text-3xl mr-4"></i>
          <h2 class="text-2xl font-bold text-gray-900">FREE Shipping</h2>
        </div>
        <p class="text-lg text-gray-700 mb-2"><strong>Enjoy FREE shipping on all orders across India!</strong></p>
        <p class="text-gray-600">No minimum order value. No hidden charges. What you see is what you pay.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">Shipping Coverage</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8">
        <p class="text-gray-700 mb-4">We currently ship <strong>India-wide only</strong>. All orders are shipped via trusted courier partners with full tracking capabilities.</p>
        <div class="grid md:grid-cols-3 gap-4 mt-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-box text-3xl text-gray-700 mb-2"></i>
            <p class="font-semibold">Secure Packaging</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-shield-alt text-3xl text-gray-700 mb-2"></i>
            <p class="font-semibold">Insurance Covered</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-map-marker-alt text-3xl text-gray-700 mb-2"></i>
            <p class="font-semibold">Real-time Tracking</p>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-bold mb-4">Order Tracking</h2>
      <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <p class="text-gray-700 mb-4">Once your order is shipped, you will receive:</p>
        <ul class="space-y-2 text-gray-700">
          <li><i class="fas fa-envelope text-blue-600 mr-2"></i>Email notification with tracking number</li>
          <li><i class="fas fa-sms text-blue-600 mr-2"></i>SMS updates on delivery status</li>
          <li><i class="fas fa-link text-blue-600 mr-2"></i>Direct tracking link to monitor your shipment</li>
        </ul>
        <p class="text-gray-600 mt-4 text-sm"><strong>Note:</strong> Tracking information is updated within 24 hours of dispatch.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">Delivery Issues?</h2>
      <div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <p class="text-gray-700 mb-4">If you face any delivery issues, please contact us <strong>within 48 hours</strong> of expected delivery date:</p>
        <div class="flex flex-wrap gap-4 mt-4">
          <a href="mailto:shop@intru.in" class="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            <i class="fas fa-envelope mr-2"></i>shop@intru.in
          </a>
          <a href="mailto:support@intru.in" class="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
            <i class="fas fa-headset mr-2"></i>support@intru.in
          </a>
        </div>
        <p class="text-gray-600 mt-4 text-sm">We typically respond within 24 hours on business days.</p>
      </div>

      <div class="mt-8 p-6 bg-gray-50 rounded-xl">
        <p class="text-gray-600 text-sm"><strong>Important:</strong> Delivery timelines are estimated and may vary due to unforeseen circumstances like weather, holidays, or courier delays. We appreciate your patience and understanding.</p>
      </div>
    </div>',
   'Shipping & Delivery - INTRU', 'Free shipping across India. Fast delivery in 3-5 days. Track your order with INTRU.', 1),

  -- Returns & Exchanges Page
  ('returns', 'Returns & Exchanges', 
   '<div class="prose max-w-none">
      <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-2xl mb-8">
        <h1 class="text-4xl font-bold mb-4 text-white">Returns & Exchanges</h1>
        <p class="text-xl text-gray-100">Quality guaranteed. Every piece is thoughtfully crafted and packed with care.</p>
      </div>
      
      <div class="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-xl">
        <div class="flex items-center mb-2">
          <i class="fas fa-info-circle text-amber-600 text-2xl mr-3"></i>
          <h3 class="text-xl font-bold text-gray-900">Important Notice</h3>
        </div>
        <p class="text-gray-700">We don''t offer returns or exchanges for sizing or personal preference—especially since sizes are subject to availability due to <strong>limited stock</strong>. However, we''re always here to help if something isn''t quite right with your order.</p>
      </div>

      <h2 class="text-3xl font-bold mb-6">When We Accept Returns/Exchanges</h2>
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white border-2 border-red-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">Damaged Items</h3>
          <p class="text-gray-600">Products that arrive with manufacturing defects or shipping damage</p>
        </div>
        <div class="bg-white border-2 border-red-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-tools text-red-600 text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">Defective Items</h3>
          <p class="text-gray-600">Items with quality issues that don''t meet our high standards</p>
        </div>
        <div class="bg-white border-2 border-red-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-exchange-alt text-red-600 text-xl"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">Wrong Item</h3>
          <p class="text-gray-600">If you received an incorrect product or wrong size/color</p>
        </div>
      </div>

      <h2 class="text-3xl font-bold mb-6">How to Request an Exchange</h2>
      <div class="bg-white border-2 border-blue-200 rounded-xl p-6 mb-8">
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
            <div>
              <h4 class="font-bold text-lg mb-1">Contact Us Within 36 Hours</h4>
              <p class="text-gray-600">Reach out within 36 hours of receiving your delivery</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
            <div>
              <h4 class="font-bold text-lg mb-1">Email Us</h4>
              <p class="text-gray-600">Send an email to <a href="mailto:shop@intru.in" class="text-blue-600 underline">shop@intru.in</a> with your concern</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
            <div>
              <h4 class="font-bold text-lg mb-1">Provide Details</h4>
              <p class="text-gray-600">Include your <strong>order number</strong> and <strong>clear photos</strong> of the issue</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
            <div>
              <h4 class="font-bold text-lg mb-1">Keep Item Unused</h4>
              <p class="text-gray-600">Item must be <strong>unused</strong> in original packaging with all tags attached</p>
            </div>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-bold mb-6">Exchange Conditions</h2>
      <div class="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
        <ul class="space-y-3">
          <li class="flex items-start">
            <i class="fas fa-check-circle text-green-600 text-xl mr-3 mt-1"></i>
            <span class="text-gray-700">Item must be <strong>unused</strong> and in its <strong>original condition</strong></span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-check-circle text-green-600 text-xl mr-3 mt-1"></i>
            <span class="text-gray-700">Original packaging, tags, and labels must be <strong>intact</strong></span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-check-circle text-green-600 text-xl mr-3 mt-1"></i>
            <span class="text-gray-700">Item must not be <strong>washed, worn, or altered</strong></span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-check-circle text-green-600 text-xl mr-3 mt-1"></i>
            <span class="text-gray-700">Request must be made within <strong>36 hours of delivery</strong></span>
          </li>
          <li class="flex items-start">
            <i class="fas fa-check-circle text-green-600 text-xl mr-3 mt-1"></i>
            <span class="text-gray-700"><strong>Proof of purchase</strong> (order confirmation) required</span>
          </li>
        </ul>
      </div>

      <div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
        <div class="flex items-center mb-4">
          <i class="fas fa-headset text-blue-600 text-3xl mr-4"></i>
          <h3 class="text-2xl font-bold text-gray-900">Need Help?</h3>
        </div>
        <p class="text-gray-700 mb-4">If you have any questions about our exchange policy, we''re here to help:</p>
        <div class="flex flex-wrap gap-4">
          <a href="mailto:shop@intru.in" class="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            <i class="fas fa-envelope mr-2"></i>shop@intru.in
          </a>
          <a href="mailto:support@intru.in" class="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
            <i class="fas fa-life-ring mr-2"></i>support@intru.in
          </a>
        </div>
        <p class="text-gray-600 mt-4 text-sm">Our customer support team typically responds within 24 hours on business days.</p>
      </div>
    </div>',
   'Returns & Exchanges - INTRU', 'INTRU exchange policy. We accept exchanges for damaged, defective, or wrong items within 36 hours.', 1),

  -- FAQs Page  
  ('faq', 'Frequently Asked Questions',
   '<div class="prose max-w-none">
      <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-2xl mb-8">
        <h1 class="text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
        <p class="text-xl text-gray-100">Everything you need to know about shopping with INTRU</p>
      </div>

      <div class="space-y-4">
        <!-- FAQ 1 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">How long does it take to process my order?</h3>
                <p class="text-gray-700">Orders are processed within <strong>1-2 business days</strong> after payment confirmation. You''ll receive a tracking number via email once your order is dispatched. Orders placed on weekends or holidays are processed on the next business day.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 2 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">What are the delivery timelines?</h3>
                <p class="text-gray-700 mb-2">Delivery times vary based on your location:</p>
                <ul class="list-disc pl-6 text-gray-700 space-y-1">
                  <li><strong>Metro cities:</strong> 3-5 business days</li>
                  <li><strong>Tier 2 cities:</strong> 4-7 business days</li>
                  <li><strong>Remote areas:</strong> 7-10 business days</li>
                </ul>
                <p class="text-gray-600 mt-2 text-sm">All deliveries include real-time tracking.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 3 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">Is shipping really free?</h3>
                <p class="text-gray-700">Yes! We offer <strong>FREE shipping on all orders</strong> across India, with no minimum order value. There are no hidden charges—what you see is what you pay.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 4 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">Can I track my order?</h3>
                <p class="text-gray-700">Absolutely! Once your order is shipped, you''ll receive a tracking number via email and SMS. You can track your package in real-time using the provided link. Tracking updates are available within 24 hours of dispatch.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 5 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">5</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">What is your return/exchange policy?</h3>
                <p class="text-gray-700 mb-2">We accept exchanges <strong>only</strong> for:</p>
                <ul class="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Damaged items</li>
                  <li>Defective products</li>
                  <li>Wrong item received</li>
                </ul>
                <p class="text-gray-700 mt-2">Please contact us within <strong>36 hours of delivery</strong> at <a href="mailto:shop@intru.in" class="text-blue-600 underline">shop@intru.in</a> with your order number and photos of the issue.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 6 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">6</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">Can I cancel or modify my order?</h3>
                <p class="text-gray-700">You can cancel or modify your order within <strong>24 hours</strong> of placing it by contacting us at <a href="mailto:shop@intru.in" class="text-blue-600 underline">shop@intru.in</a>. Once an order is processed and shipped, cancellation is not possible, but you may be eligible for an exchange if the product meets our exchange criteria.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 7 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">7</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">What payment methods do you accept?</h3>
                <p class="text-gray-700">We accept multiple secure payment methods including:</p>
                <ul class="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                  <li>Credit & Debit Cards (Visa, MasterCard, Rupay)</li>
                  <li>UPI (Google Pay, PhonePe, Paytm)</li>
                  <li>Net Banking</li>
                  <li>Digital Wallets</li>
                </ul>
                <p class="text-gray-600 mt-2 text-sm">All transactions are encrypted and secure via Razorpay.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 8 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">8</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">How do I know what size to order?</h3>
                <p class="text-gray-700">All our products are <strong>oversized</strong> and designed for a relaxed, comfortable fit. We recommend checking the product description for specific measurements. Since we have limited stock and don''t accept size-related returns, please choose carefully.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 9 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">9</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">Are INTRU products sustainable?</h3>
                <p class="text-gray-700">Yes! We''re committed to sustainable fashion. All our products are made in Bharat with ethical manufacturing practices, sustainable materials, and minimal packaging waste. We believe in quality over quantity—each piece is designed to last.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 10 -->
        <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors">
          <div class="p-6">
            <div class="flex items-start">
              <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">10</div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-3">How can I contact customer support?</h3>
                <p class="text-gray-700 mb-3">We''re here to help! Reach out to us via:</p>
                <div class="flex flex-wrap gap-3">
                  <a href="mailto:shop@intru.in" class="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm">
                    <i class="fas fa-envelope mr-2"></i>shop@intru.in
                  </a>
                  <a href="mailto:support@intru.in" class="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition text-sm">
                    <i class="fas fa-headset mr-2"></i>support@intru.in
                  </a>
                  <a href="https://instagram.com/intru.in" target="_blank" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition text-sm">
                    <i class="fab fa-instagram mr-2"></i>@intru.in
                  </a>
                </div>
                <p class="text-gray-600 mt-3 text-sm">We typically respond within 24 hours on business days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 class="text-2xl font-bold mb-3">Still have questions?</h3>
        <p class="text-gray-700 mb-4">Can''t find the answer you''re looking for? Feel free to reach out to our support team. We''re always happy to help!</p>
        <a href="mailto:shop@intru.in" class="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          <i class="fas fa-paper-plane mr-2"></i>Contact Support
        </a>
      </div>
    </div>',
   'FAQs - INTRU', 'Frequently asked questions about INTRU products, shipping, returns, and more.', 1),

  -- Terms & Conditions Page
  ('terms', 'Terms & Conditions',
   '<div class="prose max-w-none">
      <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-2xl mb-8">
        <h1 class="text-4xl font-bold mb-4 text-white">Terms & Conditions</h1>
        <p class="text-xl text-gray-100">Last updated: February 9, 2026</p>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-xl">
        <p class="text-gray-700">By accessing and using the INTRU website (intru.in), you accept and agree to be bound by the terms and conditions outlined below. Please read these terms carefully before using our services.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4 mt-8">1. General Terms</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">INTRU reserves the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of the site constitutes acceptance of the updated terms.</p>
        <p class="text-gray-700">These terms apply to all visitors, users, and customers of intru.in</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">2. Use of Website</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the site.</p>
        <p class="text-gray-700 font-semibold mb-2">Prohibited activities include:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Using automated systems to access or scrape website content</li>
          <li>Attempting to gain unauthorized access to our systems</li>
          <li>Transmitting malicious code or viruses</li>
          <li>Engaging in fraudulent activities</li>
          <li>Impersonating INTRU or our staff</li>
        </ul>
      </div>

      <h2 class="text-3xl font-bold mb-4">3. Product Information & Pricing</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">We make every effort to ensure product descriptions, images, and prices are accurate. However:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Colors may vary slightly due to screen settings</li>
          <li>Product availability is subject to change without notice</li>
          <li>Prices are subject to change without prior notification</li>
          <li>We reserve the right to limit quantities purchased per customer</li>
          <li>In case of pricing errors, we reserve the right to cancel orders</li>
        </ul>
      </div>

      <h2 class="text-3xl font-bold mb-4">4. Orders & Payment</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <h3 class="text-xl font-bold mb-3">Order Acceptance</h3>
        <p class="text-gray-700 mb-4">All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for reasons including but not limited to:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Product unavailability</li>
          <li>Pricing or product information errors</li>
          <li>Suspected fraudulent transactions</li>
          <li>Violation of our terms and conditions</li>
        </ul>
        <h3 class="text-xl font-bold mb-3">Payment</h3>
        <p class="text-gray-700">All payments must be made in full at the time of purchase via Razorpay. We accept credit cards, debit cards, UPI, net banking, and digital wallets. Payment information is processed securely and we do not store your card details.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">5. Shipping & Delivery</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">We ship India-wide only. Delivery timelines are estimates and may vary due to unforeseen circumstances. For detailed shipping information, please refer to our <a href="/shipping" class="text-blue-600 underline">Shipping Policy</a>.</p>
        <p class="text-gray-700">Risk of loss and title for products pass to you upon delivery to the shipping carrier.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">6. Returns & Exchanges</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">We accept exchanges only for damaged, defective, or wrong items within 36 hours of delivery. Size-related exchanges are not accepted due to limited stock availability.</p>
        <p class="text-gray-700">For complete details, please review our <a href="/returns" class="text-blue-600 underline">Returns & Exchanges Policy</a>.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">7. Intellectual Property</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">All content on intru.in including text, graphics, logos, images, and software is the property of INTRU and is protected by copyright and trademark laws.</p>
        <p class="text-gray-700">You may not reproduce, distribute, modify, or create derivative works without our explicit written permission.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">8. User Accounts</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">If you create an account on our website:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>You are responsible for maintaining confidentiality of your account</li>
          <li>You agree to provide accurate and current information</li>
          <li>You are responsible for all activities under your account</li>
          <li>You must notify us immediately of any unauthorized access</li>
          <li>We reserve the right to suspend or terminate accounts that violate our terms</li>
        </ul>
      </div>

      <h2 class="text-3xl font-bold mb-4">9. Limitation of Liability</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">INTRU shall not be liable for any indirect, incidental, special, or consequential damages arising from:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>Use or inability to use our website or products</li>
          <li>Delays or interruptions in service</li>
          <li>Errors or omissions in content</li>
          <li>Loss of data or profits</li>
        </ul>
      </div>

      <h2 class="text-3xl font-bold mb-4">10. Governing Law</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700">These terms are governed by the laws of India. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of courts in India.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">11. Contact Information</h2>
      <div class="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <p class="text-gray-700 mb-4">If you have any questions about these Terms & Conditions, please contact us:</p>
        <div class="flex flex-wrap gap-4">
          <a href="mailto:shop@intru.in" class="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            <i class="fas fa-envelope mr-2"></i>shop@intru.in
          </a>
          <a href="mailto:support@intru.in" class="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
            <i class="fas fa-life-ring mr-2"></i>support@intru.in
          </a>
        </div>
        <p class="text-gray-600 mt-4 text-sm">INTRU - Made in Bharat with love for minimalism & everyday style.</p>
      </div>
    </div>',
   'Terms & Conditions - INTRU', 'INTRU terms and conditions. Read our policies for using intru.in and purchasing our products.', 1),

  -- Contact Us Page
  ('contact', 'Contact Us',
   '<div class="prose max-w-none">
      <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-2xl mb-8">
        <h1 class="text-4xl font-bold mb-4 text-white">Contact Us</h1>
        <p class="text-xl text-gray-100">We''re here to help. Reach out to us anytime!</p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <div class="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6">
            <i class="fas fa-envelope text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold mb-4">Email Us</h2>
          <p class="text-gray-700 mb-4">For orders, product inquiries, and general questions:</p>
          <a href="mailto:shop@intru.in" class="text-xl font-semibold text-blue-600 hover:text-blue-800 block mb-2">shop@intru.in</a>
          <p class="text-gray-700 mb-4">For customer support and assistance:</p>
          <a href="mailto:support@intru.in" class="text-xl font-semibold text-blue-600 hover:text-blue-800 block">support@intru.in</a>
          <p class="text-gray-600 text-sm mt-4">We typically respond within 24 hours on business days.</p>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6">
            <i class="fab fa-instagram text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold mb-4">Follow Us</h2>
          <p class="text-gray-700 mb-4">Stay updated with our latest drops, behind-the-scenes content, and minimalist style inspiration:</p>
          <a href="https://instagram.com/intru.in" target="_blank" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition text-lg font-semibold">
            <i class="fab fa-instagram mr-2"></i>@intru.in
          </a>
          <p class="text-gray-600 text-sm mt-4">DM us on Instagram for quick responses!</p>
        </div>
      </div>

      <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-8">
        <h2 class="text-3xl font-bold mb-6">Business Hours</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-bold mb-3"><i class="fas fa-calendar-check text-blue-600 mr-2"></i>Customer Support</h3>
            <p class="text-gray-700"><strong>Monday - Saturday:</strong> 10:00 AM - 7:00 PM IST</p>
            <p class="text-gray-700"><strong>Sunday:</strong> Closed</p>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-3"><i class="fas fa-shipping-fast text-blue-600 mr-2"></i>Order Processing</h3>
            <p class="text-gray-700"><strong>Monday - Saturday:</strong> Orders processed within 1-2 business days</p>
            <p class="text-gray-700"><strong>Weekends & Holidays:</strong> Processed next business day</p>
          </div>
        </div>
      </div>

      <div class="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
        <h2 class="text-3xl font-bold mb-6">What Can We Help You With?</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-box text-4xl text-gray-700 mb-3"></i>
            <h4 class="font-bold mb-2">Order Status</h4>
            <p class="text-gray-600 text-sm">Track your order or inquire about delivery</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-exchange-alt text-4xl text-gray-700 mb-3"></i>
            <h4 class="font-bold mb-2">Returns & Exchanges</h4>
            <p class="text-gray-600 text-sm">Questions about our exchange policy</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-tshirt text-4xl text-gray-700 mb-3"></i>
            <h4 class="font-bold mb-2">Product Info</h4>
            <p class="text-gray-600 text-sm">Sizing, materials, and product details</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-credit-card text-4xl text-gray-700 mb-3"></i>
            <h4 class="font-bold mb-2">Payment Issues</h4>
            <p class="text-gray-600 text-sm">Help with transactions and refunds</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-truck text-4xl text-gray-700 mb-3"></i>
            <h4 class="font-bold mb-2">Shipping Info</h4>
            <p class="text-gray-600 text-sm">Delivery timelines and tracking</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <i class="fas fa-comments text-4xl text-gray-700 mb-3"></i>
            <h4 class="font-bold mb-2">General Inquiries</h4>
            <p class="text-gray-600 text-sm">Any other questions or feedback</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl p-8">
        <h2 class="text-3xl font-bold mb-4 text-white">Quick Response Tips</h2>
        <p class="text-gray-100 mb-4">To help us assist you faster, please include:</p>
        <ul class="space-y-2 text-gray-100">
          <li><i class="fas fa-check-circle text-green-400 mr-2"></i>Your order number (if applicable)</li>
          <li><i class="fas fa-check-circle text-green-400 mr-2"></i>Clear photos (for product issues)</li>
          <li><i class="fas fa-check-circle text-green-400 mr-2"></i>Detailed description of your inquiry</li>
          <li><i class="fas fa-check-circle text-green-400 mr-2"></i>Your preferred contact method</li>
        </ul>
        <p class="text-gray-300 mt-6 text-sm">We value your time and strive to provide the best customer experience possible. Thank you for choosing INTRU!</p>
      </div>
    </div>',
   'Contact Us - INTRU', 'Get in touch with INTRU. Email us at shop@intru.in or support@intru.in for assistance.', 1),

  -- Privacy Policy Page
  ('privacy', 'Privacy Policy',
   '<div class="prose max-w-none">
      <div class="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8 rounded-2xl mb-8">
        <h1 class="text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
        <p class="text-xl text-gray-100">Last updated: February 9, 2026</p>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-xl">
        <p class="text-gray-700">At INTRU, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you use intru.in</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">1. Information We Collect</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <h3 class="text-xl font-bold mb-3">Personal Information</h3>
        <p class="text-gray-700 mb-3">When you make a purchase or create an account, we collect:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Name and contact information (email, phone number)</li>
          <li>Shipping and billing address</li>
          <li>Payment information (processed securely via Razorpay)</li>
          <li>Order history and preferences</li>
        </ul>
        
        <h3 class="text-xl font-bold mb-3 mt-6">Automatically Collected Information</h3>
        <p class="text-gray-700 mb-3">We automatically collect certain information when you visit our website:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>IP address and browser type</li>
          <li>Device information and operating system</li>
          <li>Pages viewed and time spent on site</li>
          <li>Referring website and search terms</li>
        </ul>
      </div>

      <h2 class="text-3xl font-bold mb-4">2. How We Use Your Information</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">We use your information to:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Process orders:</strong> Fulfill and deliver your purchases</li>
          <li><strong>Customer support:</strong> Respond to inquiries and resolve issues</li>
          <li><strong>Improve services:</strong> Enhance website functionality and user experience</li>
          <li><strong>Marketing:</strong> Send promotional emails (with your consent)</li>
          <li><strong>Fraud prevention:</strong> Detect and prevent fraudulent activities</li>
          <li><strong>Legal compliance:</strong> Meet legal and regulatory requirements</li>
        </ul>
      </div>

      <h2 class="text-3xl font-bold mb-4">3. Information Sharing</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">We do not sell your personal information. We may share your data with:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-3">
          <li><strong>Service providers:</strong> Payment processors (Razorpay), shipping partners, email services</li>
          <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
          <li><strong>Business transfers:</strong> In case of merger, acquisition, or sale of assets</li>
        </ul>
        <p class="text-gray-700 mt-4">All third-party partners are required to maintain confidentiality and security of your information.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">4. Data Security</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">We implement industry-standard security measures to protect your information:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li>SSL encryption for all data transmission</li>
          <li>Secure payment processing via Razorpay (PCI DSS compliant)</li>
          <li>Regular security audits and updates</li>
          <li>Restricted access to personal information</li>
          <li>Secure data storage with regular backups</li>
        </ul>
        <p class="text-gray-600 mt-4 text-sm">While we use reasonable measures to protect your data, no method of transmission over the internet is 100% secure.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">5. Cookies & Tracking</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">We use cookies and similar technologies to:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Remember your preferences and settings</li>
          <li>Analyze website traffic and user behavior</li>
          <li>Personalize content and advertisements</li>
          <li>Improve website performance</li>
        </ul>
        <p class="text-gray-700">You can control cookies through your browser settings, but disabling them may affect website functionality.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">6. Your Rights</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700 mb-4">You have the right to:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Access:</strong> Request a copy of your personal information</li>
          <li><strong>Correction:</strong> Update or correct inaccurate data</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          <li><strong>Data portability:</strong> Request transfer of your data</li>
        </ul>
        <p class="text-gray-700 mt-4">To exercise these rights, contact us at <a href="mailto:privacy@intru.in" class="text-blue-600 underline">privacy@intru.in</a> or <a href="mailto:support@intru.in" class="text-blue-600 underline">support@intru.in</a></p>
      </div>

      <h2 class="text-3xl font-bold mb-4">7. Data Retention</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700">We retain your personal information for as long as necessary to:</p>
        <ul class="list-disc pl-6 text-gray-700 space-y-2 mt-3">
          <li>Fulfill the purposes outlined in this policy</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce agreements</li>
        </ul>
        <p class="text-gray-700 mt-4">Inactive accounts and data may be deleted after a reasonable period of inactivity.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">8. Third-Party Links</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700">Our website may contain links to third-party websites (e.g., payment gateways, social media). We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">9. Children''s Privacy</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700">Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">10. Changes to Privacy Policy</h2>
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <p class="text-gray-700">We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Significant changes will be communicated via email or website notification.</p>
      </div>

      <h2 class="text-3xl font-bold mb-4">11. Contact Us</h2>
      <div class="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <p class="text-gray-700 mb-4">If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:</p>
        <div class="flex flex-wrap gap-4 mb-4">
          <a href="mailto:privacy@intru.in" class="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            <i class="fas fa-shield-alt mr-2"></i>privacy@intru.in
          </a>
          <a href="mailto:support@intru.in" class="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
            <i class="fas fa-headset mr-2"></i>support@intru.in
          </a>
        </div>
        <p class="text-gray-600 text-sm">INTRU - Made in Bharat with commitment to your privacy and security.</p>
      </div>
    </div>',
   'Privacy Policy - INTRU', 'INTRU privacy policy. Learn how we collect, use, and protect your personal information.', 1);
