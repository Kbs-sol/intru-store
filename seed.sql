-- Insert initial products from intru.in
INSERT OR IGNORE INTO products (id, name, slug, description, price, original_price, image_url, image_url_2, category, is_featured, is_active, stock) VALUES 
  (1, 'Doodles T-Shirt', 'doodles-tshirt', 'A stylish t-shirt with unique doodle prints. Perfect for everyday wear with a touch of minimalism.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05839_1.jpg?v=1730301823', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05836.jpg?v=1730301823', 'T-Shirts', 1, 1, 100),
  (2, 'No Risk Porsche T-Shirt', 'porsche-tshirt', 'Bold and edgy Porsche-themed t-shirt. Show your love for speed and style.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05927_2.jpg?v=1730301907', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05923.jpg?v=1730301907', 'T-Shirts', 1, 1, 100),
  (3, 'Orange Puff Printed T-Shirt', 'orange-puff-tshirt', 'Vibrant orange t-shirt with unique puff printing. Stand out with this eye-catching design.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05910_3.jpg?v=1730301968', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05909.jpg?v=1730301968', 'T-Shirts', 0, 1, 100),
  (4, 'Romanticise Crop Tee', 'romanticise-crop-tee', 'Chic crop tee for the modern minimalist. Perfect for creating effortless everyday style.', 699.00, 999.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05883.jpg?v=1730301994', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05877.jpg?v=1730301994', 'Tops', 1, 1, 100),
  (5, 'Stripe 18 Shirt', 'stripe-18-shirt', 'Classic striped shirt with a contemporary twist. Versatile piece for any wardrobe.', 1099.00, 1699.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05899.jpg?v=1730302024', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05895.jpg?v=1730302024', 'Shirts', 0, 1, 100),
  (6, 'Summer Shirt', 'summer-shirt', 'Light and breezy summer shirt. Your go-to for casual summer days.', 999.00, 1599.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05865.jpg?v=1730302047', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05862.jpg?v=1730302047', 'Shirts', 0, 1, 100);

-- Insert all pages with correct content from intru.in
INSERT OR IGNORE INTO pages (slug, title, content, meta_title, meta_description, is_active) VALUES 
  ('brand-story', 'Our Story', 
   '<div class="prose max-w-none">
      <h1 class="text-4xl font-bold mb-8">Welcome to INTRU</h1>
      <p class="text-xl text-gray-700 mb-6">Built from scratch with a shared love for minimalism & everyday style.</p>
      
      <p class="text-gray-700 mb-6">At INTRU, we believe that fashion should be effortless, timeless, and accessible. Our journey began with a simple idea: to create clothing that embodies minimalist aesthetics while celebrating individuality.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Our Philosophy</h2>
      <p class="text-gray-700 mb-6">We design pieces that transcend trends and seasons. Each item in our collection is carefully crafted to be versatile, comfortable, and stylish - perfect for the modern lifestyle.</p>
      
      <p class="text-gray-700 mb-6">Every garment tells a story. From the careful selection of fabrics to the attention to detail in stitching, we pour our passion into creating pieces that you''ll reach for again and again.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Minimalism Meets Functionality</h2>
      <p class="text-gray-700 mb-6">In a world of fast fashion and fleeting trends, we champion slow fashion. Our minimalist approach isn''t about having less - it''s about having the right pieces that work seamlessly together, giving you more freedom and confidence in your everyday style.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Sustainability</h2>
      <p class="text-gray-700 mb-6">We are committed to sustainable practices, from sourcing materials to production. Every piece is made with care for both people and the planet.</p>
      
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Ethical manufacturing processes</li>
        <li>Sustainable material sourcing</li>
        <li>Minimal packaging waste</li>
        <li>Long-lasting quality over disposable fashion</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Quality & Craftsmanship</h2>
      <p class="text-gray-700 mb-6">Each INTRU piece is designed to last. We work with skilled artisans who share our vision for quality and sustainability. From the first sketch to the final stitch, every step is executed with precision and care.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Join Our Community</h2>
      <p class="text-gray-700">When you choose INTRU, you become part of a community that values quality, simplicity, and conscious living. Share your INTRU moments with us on Instagram @intru.in and become part of our story.</p>
    </div>',
   'Our Story - INTRU | Minimalism & Everyday Style', 'Discover the story behind INTRU - built from scratch with a shared love for minimalism & everyday style.', 1),
  
  ('returns', 'Returns & Exchanges', 
   '<div class="prose max-w-none">
      <h1 class="text-4xl font-bold mb-8">Returns & Exchanges</h1>
      
      <div class="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
        <p class="text-lg font-medium">Every piece is thoughtfully crafted and packed with care.</p>
      </div>
      
      <p class="text-gray-700 mb-6">While we don''t offer returns or exchanges for sizing or personal preference—especially since sizes are subject to availability due to limited stock—we''re always here to help if something isn''t quite right.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">When We Accept Returns/Exchanges</h2>
      <p class="text-gray-700 mb-4">We accept returns and exchanges <strong>only</strong> for the following reasons:</p>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li><strong>Damaged items:</strong> Products that arrive with manufacturing defects or damage</li>
        <li><strong>Defective items:</strong> Items that have quality issues or don''t meet our standards</li>
        <li><strong>Wrong item:</strong> If you received an incorrect product</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">How to Request an Exchange</h2>
      <ol class="list-decimal pl-6 text-gray-700 mb-6 space-y-2">
        <li><strong>Contact us within 36 hours</strong> of receiving your delivery</li>
        <li>Email us at <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a></li>
        <li>Include your <strong>order number</strong> and <strong>clear photos</strong> of the issue</li>
        <li>Keep the item <strong>unused</strong> in its original packaging with all tags attached</li>
      </ol>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Conditions for Returns/Exchanges</h2>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Item must be unused and in its original condition</li>
        <li>Original packaging, tags, and labels must be intact</li>
        <li>Item must not be washed, worn, or altered</li>
        <li>Request must be made within 36 hours of delivery</li>
        <li>Proof of purchase (order confirmation) required</li>
      </ul>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
        <h3 class="font-semibold mb-2">Need Help?</h3>
        <p class="text-gray-700">If you have any questions about our exchange policy, please contact us at <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a> or <a href="mailto:support@intru.in" class="text-black font-medium underline">support@intru.in</a>.</p>
      </div>
    </div>',
   'Returns & Exchanges - INTRU', 'Learn about INTRU''s returns and exchanges policy for damaged, defective, or wrong items.', 1),
  
  ('shipping', 'Shipping Policy', 
   '<div class="prose max-w-none">
      <h1 class="text-4xl font-bold mb-8">Shipping Policy</h1>
      
      <div class="grid md:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-semibold mb-4"><i class="fas fa-clock text-gray-600 mr-2"></i>Processing Time</h2>
          <p class="text-gray-700">Orders are processed within <strong>1-2 business days</strong>. Orders placed on weekends or holidays will be processed the next business day.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-2xl font-semibold mb-4"><i class="fas fa-shipping-fast text-gray-600 mr-2"></i>Delivery Time</h2>
          <ul class="text-gray-700 space-y-2">
            <li><strong>Metro cities:</strong> 3-5 business days</li>
            <li><strong>Other locations:</strong> 4-7 business days</li>
          </ul>
        </div>
      </div>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Shipping Coverage</h2>
      <p class="text-gray-700 mb-6">We currently ship only within <strong>India</strong>. Shipping to all major cities and towns is available.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Shipping Charges</h2>
      <div class="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
        <p class="text-lg font-medium">We offer <strong>FREE SHIPPING</strong> on all orders across India! 🎉</p>
      </div>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Order Tracking</h2>
      <p class="text-gray-700 mb-6">Once your order ships, you''ll receive a tracking number via email. Use this number to monitor your delivery status on the courier''s website.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">Issues with Delivery</h2>
      <p class="text-gray-700 mb-4">If you experience any issues with your delivery, please:</p>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Contact us at <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a> within <strong>48 hours</strong> of the expected delivery date</li>
        <li>Provide your order number and tracking details</li>
        <li>Include photos if the package appears damaged</li>
      </ul>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
        <h3 class="font-semibold mb-2">Questions?</h3>
        <p class="text-gray-700">For any shipping-related queries, reach out to us at <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a> or <a href="mailto:support@intru.in" class="text-black font-medium underline">support@intru.in</a>.</p>
      </div>
    </div>',
   'Shipping Policy - INTRU', 'Learn about INTRU''s shipping policy, delivery times, and free shipping across India.', 1),
  
  ('faq', 'Frequently Asked Questions', 
   '<div class="prose max-w-none">
      <h1 class="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-question-circle text-gray-600 mr-2"></i>How long does order processing take?</h3>
          <p class="text-gray-700">Orders are processed within 1-2 business days. You''ll receive a confirmation email once your order ships with tracking information.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-map-marker-alt text-gray-600 mr-2"></i>How can I track my order?</h3>
          <p class="text-gray-700">Once your order ships, you''ll receive a tracking number via email. Use this number to track your package on the courier''s website. Delivery typically takes 3-5 business days for metro cities and 4-7 business days for other locations.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-times-circle text-gray-600 mr-2"></i>Can I cancel or change my order?</h3>
          <p class="text-gray-700">Please contact us at <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a> immediately if you need to cancel or modify your order. Once shipped, orders cannot be cancelled. However, you may be able to refuse delivery and we''ll process a refund once the item is returned to us.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-exchange-alt text-gray-600 mr-2"></i>What is your exchange policy?</h3>
          <p class="text-gray-700">We accept exchanges only for damaged, defective, or wrong items. Please contact us within 36 hours of delivery with your order number and photos. Visit our <a href="/returns" class="text-black font-medium underline">Returns & Exchanges</a> page for full details. Note: We don''t accept returns or exchanges for sizing or personal preference due to limited stock availability.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-globe text-gray-600 mr-2"></i>Do you ship internationally?</h3>
          <p class="text-gray-700">Currently, we only ship within India. We''re working on expanding our shipping to international destinations in the future.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-rupee-sign text-gray-600 mr-2"></i>Do you charge for shipping?</h3>
          <p class="text-gray-700">No! We offer <strong>FREE SHIPPING</strong> on all orders across India. No minimum order value required.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-credit-card text-gray-600 mr-2"></i>What payment methods do you accept?</h3>
          <p class="text-gray-700">We accept all major payment methods through Razorpay, including credit/debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-box text-gray-600 mr-2"></i>What if my item is out of stock?</h3>
          <p class="text-gray-700">Due to our focus on quality and limited production runs, some items may go out of stock. If an item you want is unavailable, please contact us at <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a> to inquire about restocks.</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-semibold mb-3"><i class="fas fa-envelope text-gray-600 mr-2"></i>How do I contact customer support?</h3>
          <p class="text-gray-700">You can reach us at:</p>
          <ul class="list-disc pl-6 text-gray-700 mt-2 space-y-1">
            <li>Email: <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a></li>
            <li>Support: <a href="mailto:support@intru.in" class="text-black font-medium underline">support@intru.in</a></li>
            <li>Instagram: <a href="https://instagram.com/intru.in" class="text-black font-medium underline" target="_blank">@intru.in</a></li>
          </ul>
          <p class="text-gray-700 mt-2">We typically respond within 24 hours during business days.</p>
        </div>
      </div>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
        <h3 class="font-semibold mb-2">Still have questions?</h3>
        <p class="text-gray-700">Feel free to reach out to us at <a href="mailto:support@intru.in" class="text-black font-medium underline">support@intru.in</a> and we''ll be happy to help!</p>
      </div>
    </div>',
   'FAQ - INTRU', 'Find answers to frequently asked questions about ordering, shipping, exchanges, and more at INTRU.', 1),
  
  ('terms', 'Terms & Conditions', 
   '<div class="prose max-w-none">
      <h1 class="text-4xl font-bold mb-8">Terms & Conditions</h1>
      <p class="text-gray-600 mb-8">Last updated: ' || datetime('now') || '</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">1. General</h2>
      <p class="text-gray-700 mb-4">By accessing and using the INTRU website (intru.in), you accept and agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our website.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">2. Products & Pricing</h2>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>All product descriptions, prices, and availability are subject to change without notice</li>
        <li>We reserve the right to limit quantities of products offered</li>
        <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
        <li>Product images are for illustration purposes and may vary slightly from actual products</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">3. Orders & Payment</h2>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Orders are processed within 1-2 business days</li>
        <li>We accept payments through Razorpay (cards, UPI, net banking, wallets)</li>
        <li>All transactions are secure and encrypted</li>
        <li>We reserve the right to refuse or cancel any order</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">4. Shipping & Delivery</h2>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Free shipping across India</li>
        <li>Delivery times: 3-5 days for metro cities, 4-7 days for other locations</li>
        <li>We are not responsible for delays caused by courier services</li>
        <li>Please verify your shipping address before placing an order</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">5. Returns & Exchanges</h2>
      <p class="text-gray-700 mb-4">Please refer to our <a href="/returns" class="text-black font-medium underline">Returns & Exchanges Policy</a> for detailed information. In summary:</p>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Exchanges accepted only for damaged, defective, or wrong items</li>
        <li>Contact us within 36 hours of delivery</li>
        <li>No returns/exchanges for sizing or personal preference</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
      <p class="text-gray-700 mb-6">All content on this website, including text, graphics, logos, images, and software, is the property of INTRU and protected by copyright laws. Unauthorized use is prohibited.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
      <p class="text-gray-700 mb-6">INTRU shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">8. Privacy</h2>
      <p class="text-gray-700 mb-6">Your privacy is important to us. Please review our <a href="/privacy" class="text-black font-medium underline">Privacy Policy</a> to understand how we collect and use your information.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
      <p class="text-gray-700 mb-6">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Continued use of the site constitutes acceptance of modified terms.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
      <p class="text-gray-700 mb-6">These terms shall be governed by and construed in accordance with the laws of India.</p>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
        <h3 class="font-semibold mb-2">Questions?</h3>
        <p class="text-gray-700">If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:support@intru.in" class="text-black font-medium underline">support@intru.in</a>.</p>
      </div>
    </div>',
   'Terms & Conditions - INTRU', 'Read INTRU''s terms and conditions for using our website and purchasing our products.', 1),
  
  ('privacy-policy', 'Privacy Policy', 
   '<div class="prose max-w-none">
      <h1 class="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p class="text-gray-600 mb-8">Last updated: ' || datetime('now') || '</p>
      
      <p class="text-gray-700 mb-6">At INTRU, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <h3 class="text-xl font-medium mt-4 mb-3">Personal Information</h3>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Name, email address, and phone number</li>
        <li>Shipping and billing addresses</li>
        <li>Payment information (processed securely through Razorpay)</li>
        <li>Order history and preferences</li>
      </ul>
      
      <h3 class="text-xl font-medium mt-4 mb-3">Automatically Collected Information</h3>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>IP address and browser type</li>
        <li>Device information</li>
        <li>Pages visited and time spent on site</li>
        <li>Referring website addresses</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Process and fulfill your orders</li>
        <li>Communicate with you about your orders and account</li>
        <li>Send promotional emails (with your consent)</li>
        <li>Improve our website and customer experience</li>
        <li>Detect and prevent fraud</li>
        <li>Comply with legal obligations</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
      <p class="text-gray-700 mb-4">We do not sell or rent your personal information to third parties. We may share your information with:</p>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li><strong>Service Providers:</strong> Payment processors (Razorpay), shipping companies, and email services</li>
        <li><strong>Legal Compliance:</strong> When required by law or to protect our rights</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
      <p class="text-gray-700 mb-6">We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted and processed through secure payment gateways. However, no method of transmission over the internet is 100% secure.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">5. Cookies</h2>
      <p class="text-gray-700 mb-6">We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
      <p class="text-gray-700 mb-4">You have the right to:</p>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-2">
        <li>Access and update your personal information</li>
        <li>Request deletion of your data</li>
        <li>Opt-out of marketing communications</li>
        <li>Object to data processing</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">7. Data Retention</h2>
      <p class="text-gray-700 mb-6">We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">8. Children''s Privacy</h2>
      <p class="text-gray-700 mb-6">Our website is not intended for children under 13. We do not knowingly collect personal information from children.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
      <p class="text-gray-700 mb-6">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
      
      <h2 class="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
      <p class="text-gray-700 mb-4">If you have any questions or concerns about this Privacy Policy, please contact us:</p>
      <ul class="list-disc pl-6 text-gray-700 mb-6 space-y-1">
        <li>Email: <a href="mailto:support@intru.in" class="text-black font-medium underline">support@intru.in</a></li>
        <li>Email: <a href="mailto:shop@intru.in" class="text-black font-medium underline">shop@intru.in</a></li>
      </ul>
      
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
        <p class="text-gray-700">By using our website, you consent to this Privacy Policy.</p>
      </div>
    </div>',
   'Privacy Policy - INTRU', 'Learn how INTRU collects, uses, and protects your personal information.', 1);
