-- Insert initial products from intru.in
INSERT OR IGNORE INTO products (id, name, slug, description, price, original_price, image_url, image_url_2, category, is_featured, is_active, stock) VALUES 
  (1, 'Doodles T-Shirt', 'doodles-tshirt', 'A stylish t-shirt with unique doodle prints. Perfect for everyday wear with a touch of minimalism.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05839_1.jpg?v=1730301823', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05836.jpg?v=1730301823', 'T-Shirts', 1, 1, 100),
  (2, 'No Risk Porsche T-Shirt', 'porsche-tshirt', 'Bold and edgy Porsche-themed t-shirt. Show your love for speed and style.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05927_2.jpg?v=1730301907', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05923.jpg?v=1730301907', 'T-Shirts', 1, 1, 100),
  (3, 'Orange Puff Printed T-Shirt', 'orange-puff-tshirt', 'Vibrant orange t-shirt with unique puff printing. Stand out with this eye-catching design.', 999.00, 1499.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05910_3.jpg?v=1730301968', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05909.jpg?v=1730301968', 'T-Shirts', 0, 1, 100),
  (4, 'Romanticise Crop Tee', 'romanticise-crop-tee', 'Chic crop tee for the modern minimalist. Perfect for creating effortless everyday style.', 699.00, 999.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05883.jpg?v=1730301994', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05877.jpg?v=1730301994', 'Tops', 1, 1, 100),
  (5, 'Stripe 18 Shirt', 'stripe-18-shirt', 'Classic striped shirt with a contemporary twist. Versatile piece for any wardrobe.', 1099.00, 1699.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05899.jpg?v=1730302024', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05895.jpg?v=1730302024', 'Shirts', 0, 1, 100),
  (6, 'Summer Shirt', 'summer-shirt', 'Light and breezy summer shirt. Your go-to for casual summer days.', 999.00, 1599.00, 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05865.jpg?v=1730302047', 'https://cdn.shopify.com/s/files/1/0622/3628/2180/files/DSC05862.jpg?v=1730302047', 'Shirts', 0, 1, 100);

-- Note: No default admin user inserted. First user will become admin automatically.

-- Insert enhanced pages with content from intru.in
INSERT OR IGNORE INTO pages (slug, title, content, meta_title, meta_description, is_active) VALUES 
  ('brand-story', 'Our Brand Story', 
   '# Welcome to INTRU

Built from scratch with a shared love for minimalism & everyday style.

At INTRU, we believe that fashion should be effortless, timeless, and accessible. Our journey began with a simple idea: to create clothing that embodies minimalist aesthetics while celebrating individuality.

## Our Philosophy

We design pieces that transcend trends and seasons. Each item in our collection is carefully crafted to be versatile, comfortable, and stylish - perfect for the modern lifestyle.

Every garment tells a story. From the careful selection of fabrics to the attention to detail in stitching, we pour our passion into creating pieces that you''ll reach for again and again.

## Minimalism Meets Functionality

In a world of fast fashion and fleeting trends, we champion slow fashion. Our minimalist approach isn''t about having less - it''s about having the right pieces that work seamlessly together, giving you more freedom and confidence in your everyday style.

## Sustainability

We are committed to sustainable practices, from sourcing materials to production. Every piece is made with care for both people and the planet. We believe that conscious fashion doesn''t have to compromise on style or quality.

Our commitment extends beyond our products:
- Ethical manufacturing processes
- Sustainable material sourcing
- Minimal packaging waste
- Long-lasting quality over disposable fashion

## Quality & Craftsmanship

Each INTRU piece is designed to last. We work with skilled artisans who share our vision for quality and sustainability. From the first sketch to the final stitch, every step is executed with precision and care.

## Join Our Community

When you choose INTRU, you become part of a community that values quality, simplicity, and conscious living. We''re more than a brand - we''re a movement toward mindful consumption and timeless style.

Share your INTRU moments with us on Instagram @intru.in and become part of our story.',
   'Our Brand Story - INTRU | Minimalism & Everyday Style', 'Discover the story behind INTRU - built from scratch with a shared love for minimalism & everyday style. Quality, sustainability, and timeless design.', 1),
  
  ('terms-and-conditions', 'Terms and Conditions', 
   '# Terms and Conditions

**Last updated:** February 2026

## 1. Introduction

Welcome to INTRU ("we," "us," or "our"). These terms and conditions outline the rules and regulations for the use of INTRU''s website and services located at intru.in.

By accessing this website, we assume you accept these terms and conditions. Do not continue to use intru.in if you do not agree to all of the terms and conditions stated on this page.

## 2. Acceptance of Terms

By using our services, you confirm that you accept these Terms and Conditions and that you agree to comply with them. If you do not agree to these terms, you must not use our website or services.

## 3. Products and Services

### 3.1 Product Availability
- All products are subject to availability
- We reserve the right to limit quantities of products
- Product images are for illustration purposes; actual products may vary slightly
- Prices are subject to change without notice

### 3.2 Product Information
We strive to ensure product descriptions, images, and pricing are accurate. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.

## 4. Orders and Payment

### 4.1 Placing Orders
- Orders are subject to acceptance and availability
- We reserve the right to refuse or cancel any order for any reason
- You will receive order confirmation via email

### 4.2 Payment Processing
- Payment is processed securely through Razorpay
- We accept major credit/debit cards and UPI payments
- All prices are in Indian Rupees (₹)
- You must provide current, complete, and accurate purchase information

### 4.3 Order Confirmation
After placing an order, you will receive:
- An acknowledgment email confirming receipt of your order
- A confirmation email once your order is processed
- Shipping confirmation with tracking details

## 5. Shipping and Delivery

### 5.1 Shipping Policy
- Standard shipping: 5-7 business days
- Express shipping: 2-3 business days
- Free shipping on orders above ₹2,000
- Shipping charges apply for orders below ₹2,000

### 5.2 Delivery
- Delivery times are estimates and not guaranteed
- We are not responsible for delays caused by courier services or force majeure events
- You must provide accurate shipping information

## 6. Returns and Exchanges

Please refer to our [Return & Exchange Policy](/returns) for detailed information about returns, exchanges, and refunds.

Key points:
- 7-day return window from delivery date
- Products must be unused, unwashed, and in original condition
- Free size exchanges subject to availability
- Refunds processed within 5-7 business days

## 7. Intellectual Property

### 7.1 Content Ownership
The content, design, and branding on this website, including but not limited to text, graphics, logos, images, and software, are owned by INTRU and protected by copyright and intellectual property laws.

### 7.2 Limited License
You are granted a limited license to access and use our website for personal, non-commercial purposes. You may not:
- Reproduce, duplicate, copy, or resell any part of our website
- Use our trademarks or branding without written permission
- Modify or create derivative works from our content

## 8. User Accounts

### 8.1 Account Creation
- You may create an account to access certain features
- You are responsible for maintaining account confidentiality
- You must provide accurate and complete information
- You are responsible for all activities under your account

### 8.2 Account Security
- Keep your password secure and confidential
- Notify us immediately of any unauthorized access
- We are not liable for losses due to stolen or compromised passwords

## 9. Privacy and Data Protection

Your use of our website is also governed by our [Privacy Policy](/privacy). By using our services, you consent to the collection and use of information as described in our Privacy Policy.

## 10. Limitation of Liability

### 10.1 Disclaimer
To the maximum extent permitted by law, INTRU shall not be liable for:
- Indirect, incidental, special, or consequential damages
- Loss of profits, data, or business opportunities
- Damages arising from the use or inability to use our products or services

### 10.2 Maximum Liability
Our total liability to you for all claims arising from your use of our website or products shall not exceed the amount you paid for the specific product(s) in question.

## 11. Indemnification

You agree to indemnify, defend, and hold harmless INTRU, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of our website or violation of these terms.

## 12. Third-Party Links

Our website may contain links to third-party websites. We are not responsible for:
- The content or practices of third-party websites
- Any damages or losses caused by third-party services
- The accuracy or reliability of third-party information

## 13. Governing Law

These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Telangana, India.

## 14. Changes to Terms

We reserve the right to modify these terms at any time. We will notify you of significant changes by:
- Posting a notice on our website
- Sending an email to registered users
- Updating the "Last updated" date

Your continued use of our services after changes constitutes acceptance of the revised terms.

## 15. Severability

If any provision of these Terms and Conditions is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.

## 16. Entire Agreement

These Terms and Conditions, together with our Privacy Policy and Return & Exchange Policy, constitute the entire agreement between you and INTRU regarding the use of our website and services.

## 17. Contact Us

For any questions regarding these terms, please contact us at:

**INTRU**  
Email: venkatpradeep2@gmail.com  
Address: 1-34/1, Chinna Mangalaram, Telangana 501504, India

---

By using intru.in, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.',
   'Terms and Conditions - INTRU', 'Read our terms and conditions for using INTRU website and services. Comprehensive legal terms covering orders, payments, shipping, and user rights.', 1),
  
  ('privacy-policy', 'Privacy Policy', 
   '# Privacy Policy

**Last updated:** October 12, 2025

This Privacy Policy describes how INTRU ("the Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from intru.in (the "Site") or otherwise communicate with us regarding the Site (collectively, the "Services").

For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.

**Please read this Privacy Policy carefully.** By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use or access any of the Services.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.

## How We Collect and Use Your Personal Information

To provide the Services, we collect personal information about you from a variety of sources, as set out below. The information that we collect and use varies depending on how you interact with us.

In addition to the specific uses set out below, we may use information we collect about you to communicate with you, provide or improve the Services, comply with any applicable legal obligations, enforce any applicable terms of service, and to protect or defend the Services, our rights, and the rights of our users or others.

## What Personal Information We Collect

The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you.

### Information We Collect Directly from You

Information that you directly submit to us through our Services may include:

- **Contact details** including your name, address, phone number, and email
- **Order information** including your name, billing address, shipping address, payment confirmation, email address, and phone number
- **Account information** including your username, password, security questions and other information used for account security purposes
- **Customer support information** including the information you choose to include in communications with us

Some features of the Services may require you to directly provide us with certain information about yourself. You may elect not to provide this information, but doing so may prevent you from using or accessing these features.

### Information We Collect About Your Usage

We may also automatically collect certain information about your interaction with the Services ("**Usage Data**"). To do this, we may use cookies, pixels and similar technologies ("**Cookies**"). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.

### Information We Obtain from Third Parties

We may obtain information about you from third parties, including:

- Companies who support our Site and Services, such as Shopify
- Our payment processors (Razorpay), who collect payment information to process your orders
- Third-party authentication providers (Google, Instagram) when you use social login features

Any information we obtain from third parties will be treated in accordance with this Privacy Policy.

## How We Use Your Personal Information

- **Providing Products and Services:** We use your personal information to process your orders, fulfill transactions, send order confirmations, arrange shipping, and manage your account

- **Marketing and Advertising:** We may use your information to send marketing communications and show you advertisements for products or services

- **Security and Fraud Prevention:** We use your personal information to detect and prevent fraudulent or malicious activity

- **Communicating with You:** We use your information to provide customer support and improve our Services

## Cookies

Like many websites, we use Cookies on our Site to power and improve our Services, run analytics, and better understand user interaction. Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies through your browser controls.

**Please note:** Removing or blocking Cookies may negatively impact your user experience and may cause some features to work incorrectly or no longer be available.

## How We Disclose Personal Information

We may disclose your personal information to third parties for legitimate purposes, including:

- **Service Providers:** Vendors who perform services on our behalf (IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping)

- **Business Partners:** Marketing partners who help us provide services and advertise to you

- **Legal Compliance:** To comply with applicable legal obligations, respond to subpoenas, enforce our terms of service, and protect our rights and the rights of our users

### Categories of Personal Information Disclosed

| Category | Recipients |
|----------|-----------|
| Identifiers (contact details, account information) | Service providers, business partners, affiliates |
| Commercial information (order information, shopping data) | Service providers, business partners |
| Internet activity (Usage Data) | Service providers, business partners |
| Geolocation data | Service providers |

## Third-Party Authentication

When you sign in using Google or Instagram, we receive basic profile information as permitted by those services. We do not store your passwords from these third-party services.

## Third Party Websites and Links

Our Site may provide links to websites or platforms operated by third parties. We are not responsible for the privacy or security of such sites. You should review their privacy policies before providing any information.

## Children''s Data

The Services are not intended to be used by children under 16 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe we have collected information about your child, please contact us.

## Security and Retention

We implement reasonable security measures to protect your personal information. However, please be aware that no security measures are perfect or impenetrable. We recommend that you do not use insecure channels to communicate sensitive information to us.

We retain your personal information as long as necessary to maintain your account, provide the Services, comply with legal obligations, resolve disputes, and enforce our policies.

## Your Rights

Depending on your location, you may have rights regarding your personal information, including:

- **Right to Access:** Request access to personal information we hold about you
- **Right to Delete:** Request deletion of your personal information
- **Right to Correct:** Request correction of inaccurate information
- **Right to Portability:** Receive a copy of your personal information
- **Withdrawal of Consent:** Withdraw consent where we rely on it
- **Right to Appeal:** Appeal our decision if we decline your request
- **Communication Preferences:** Opt out of promotional emails

To exercise these rights, please contact us using the details below. We will respond in a timely manner as required by law.

## International Users

Your personal information may be transferred to, stored, and processed in countries other than your own. If we transfer your information out of Europe, we will rely on recognized transfer mechanisms like Standard Contractual Clauses.

## Contact Us

For questions about our privacy practices, to exercise your rights, or for any privacy-related concerns, please contact us:

**Email:** venkatpradeep2@gmail.com  
**Address:** 1-34/1, Chinna Mangalaram, Telangana 501504, India

---

We take your privacy seriously and are committed to protecting your personal information. Thank you for trusting INTRU.',
   'Privacy Policy - INTRU', 'Learn how INTRU collects, uses, and protects your personal information. Comprehensive privacy policy covering data collection, cookies, user rights, and security.', 1),
  
  ('return-and-exchange', 'Return & Exchange Policy', 
   '# Return & Exchange Policy

## Easy Returns & Exchanges

At INTRU, we want you to love your purchase. If you''re not completely satisfied, we offer hassle-free returns and exchanges within **7 days** of delivery.

## Return Policy

### Eligibility Criteria

To be eligible for a return, your item must meet the following conditions:

- ✅ Returned within **7 days** of delivery date
- ✅ Products must be **unworn, unwashed**, and in **original condition**
- ✅ Original tags must be **attached** and intact
- ✅ Items must be in **original packaging**
- ✅ Include the **original invoice** or proof of purchase

### Non-Returnable Items

The following items cannot be returned:

- ❌ Sale items marked as "**Final Sale**"
- ❌ Items damaged due to **misuse or negligence**
- ❌ Products **without original tags**
- ❌ Worn, washed, or altered items
- ❌ Items not in original packaging

## Exchange Policy

### Size Exchanges

We offer **free size exchanges** within 7 days of delivery:

- Subject to stock availability
- Item must be in original condition with tags attached
- One size exchange per item
- We''ll arrange pickup and send the replacement

### How to Request an Exchange

1. **Email us** at venkatpradeep2@gmail.com within 7 days
2. **Provide** your order number and reason for exchange
3. **Send photos** of the item with tags visible
4. We''ll **arrange pickup** from your address
5. Your **replacement** will be shipped once we receive the returned item

## Refund Process

### Refund Timeline

- Refunds are processed within **5-7 business days** after receiving the returned item
- Amount will be credited to your **original payment method**
- You will receive **email confirmation** when the refund is processed

### Refund Amount

- **Full refund** for defective, damaged, or incorrect items
- **Product cost** refunded for voluntary returns
- **Shipping charges** are non-refundable (unless item is defective or incorrect)
- **Exchange shipping** is free for the first exchange

## How to Initiate a Return

### Step 1: Contact Us

Email us at **venkatpradeep2@gmail.com** with:

- Your **order number**
- Item(s) you wish to return
- **Reason** for return
- **Photos** of the product (if defective or incorrect)

### Step 2: Return Authorization

We''ll send you:

- Return authorization within **24 hours**
- Return instructions
- Pickup schedule details

### Step 3: Pack the Item

- Pack the item securely in **original packaging**
- Include **original tags** and **invoice**
- Ensure the package is properly sealed

### Step 4: Pickup Arrangement

- We''ll arrange **free pickup** from your address
- Keep the package ready for pickup
- Pickup will be scheduled within **2-3 business days**

### Step 5: Refund Processing

- Refund initiated once item is received and inspected
- Amount credited within **5-7 business days**
- You''ll receive email confirmation

## Defective or Incorrect Items

If you receive a defective, damaged, or incorrect item:

### Immediate Action

1. **Contact us immediately** - don''t wait
2. **Send clear photos** showing the issue
3. **Keep all packaging** and materials

### Our Response

- We''ll arrange **free pickup** immediately
- Send a **replacement** or **full refund** (your choice)
- **Full refund including shipping** if replacement is unavailable
- No questions asked for genuine defects

### What We Cover

- ✅ Manufacturing defects
- ✅ Damaged in transit
- ✅ Wrong item sent
- ✅ Wrong size sent
- ✅ Missing items
- ✅ Quality issues

## Exchange vs Return

| Scenario | Exchange | Return & Refund |
|----------|----------|-----------------|
| Wrong size ordered | ✅ Free exchange | ✅ Refund (minus shipping) |
| Defective item | ✅ Free replacement | ✅ Full refund |
| Don''t like the fit | ✅ Size exchange | ✅ Refund (minus shipping) |
| Changed mind | ❌ No exchange | ✅ Refund (minus shipping) |
| Item damaged | ✅ Free replacement | ✅ Full refund |

## Important Notes

### Inspection Process

- All returned items are **inspected** upon receipt
- Items must meet return eligibility criteria
- Refunds processed only after successful inspection
- We reserve the right to refuse returns that don''t meet criteria

### Pickup Responsibilities

- Please keep the package ready for pickup
- Ensure someone is available at the address
- If pickup is missed, we''ll reschedule once
- Multiple missed pickups may incur return shipping charges

### Refund Method

- Refunds are credited to the **same payment method** used for purchase
- Bank transfers may take 5-7 business days
- UPI/Wallet refunds are usually instant
- Credit card refunds may take 7-10 business days depending on your bank

## Contact Us

Have questions about returns or exchanges?

**Email:** venkatpradeep2@gmail.com  
**Response Time:** Within 24 hours  
**Address:** 1-34/1, Chinna Mangalaram, Telangana 501504, India

We''re here to help make your return or exchange process as smooth as possible!

---

*This policy is subject to change. Please check this page for updates. Last updated: February 2026*',
   'Return & Exchange Policy - INTRU', 'Easy returns and exchanges within 7 days. Learn about our hassle-free return policy, free size exchanges, and refund process at INTRU.', 1);
