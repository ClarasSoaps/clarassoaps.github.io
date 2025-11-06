# Clara's Soap Website

A beautiful, modern e-commerce website for Clara's handmade soap business.

## 🌸 Features

- **Clean, minimalist design** with pink floral, brown, and gold aesthetic
- **Full e-commerce functionality** with shopping cart and checkout
- **Automatic bundle discount** - 4 soaps for $20 (saves $4!)
- **Product filtering** by scent family, seasonal, and best sellers
- **Multiple shipping options**: standard, express, farm pickup, church delivery
- **Gift wrapping option** with dried flowers and leaves
- **Seasonal product rotation** with automatic out-of-stock display
- **Customer reviews** on product pages
- **Newsletter signup** for new release notifications
- **Fully responsive** design for all devices

## 📂 File Structure

```
Claras_Soap_Webpage/
├── index.html              # Home page
├── shop.html               # Shop/products page
├── product.html            # Product detail page
├── checkout.html           # Checkout page
├── about.html              # About Clara page
├── contact.html            # Contact page
├── faq.html                # FAQ page
├── styles.css              # Main stylesheet
├── products.js             # Product database
├── cart.js                 # Shopping cart functionality
├── shop.js                 # Shop page filtering
├── product-detail.js       # Product detail functionality
├── checkout.js             # Checkout functionality
├── images/                 # Product images folder
│   └── placeholder.jpg     # Placeholder image
└── README.md              # This file
```

## 🎨 Color Palette

- **Primary Pink**: #E8B4C8
- **Pink Dark**: #D89EB3
- **Accent Pink**: #F5D4E1
- **Brown**: #8B6F47
- **Brown Dark**: #6B5638
- **Gold**: #C9A961
- **Gold Light**: #E6D5A8
- **Cream**: #FAF7F2

## 🚀 Getting Started

### 1. Add Product Images

Create an `images/` folder and add product photos:
- `lavender.jpg`
- `cedarwood.jpg`
- `lemongrass-strawflower.jpg`
- `lemongrass-exfoliating.jpg`
- `cucumber-melon.jpg`
- `peppermint.jpg`
- `sugar-cookie.jpg`
- `christmas-wreath.jpg`
- `clara-portrait.jpg` (for About page)
- `placeholder.jpg` (fallback image)

### 2. Open the Website

Simply open `index.html` in your web browser to view the site locally.

### 3. Test the Features

- Browse products on the Shop page
- Use filters to find specific soaps
- Add items to cart and see bundle discount apply
- Test the checkout process
- Try the contact form

## 💳 Payment Integration (For Production)

The checkout page includes placeholder for payment integration. To enable real payments:

1. **PayPal**: Replace `YOUR_PAYPAL_CLIENT_ID` in checkout.html with your actual PayPal client ID
2. **Stripe**: Add Stripe integration for credit card processing
3. **Venmo**: Implement Venmo business API

## 📦 Products Included

### Core Scents
- **Lavender** - Calming and relaxing
- **Cedarwood, Frankincense & Patchouli** - Earthy and grounding
- **Lemongrass with Strawflower Petals** - Fresh and uplifting
- **Lemongrass with Exfoliating Oats & Tea Tree Oil** - Deep cleansing
- **Cucumber Melon** - Light and refreshing

### Seasonal Scents
- **Peppermint** - Winter favorite
- **Sugar Cookie** - Holiday treat
- **Christmas Wreath** - Festive evergreen

## 🛠️ Customization

### Update Product Prices
Edit the price in `products.js`:
```javascript
'lavender': {
    price: 6.00,  // Change this value
    // ...
}
```

### Change Bundle Discount
Edit the discount logic in `cart.js` (line 71-72):
```javascript
const bundles = Math.floor(totalItems / 4);  // Change bundle size
const discount = bundles * 4;  // Change discount amount
```

### Update Shipping Rates
Edit shipping prices in `checkout.js`:
```javascript
currentShipping = 5.00 + (itemCount * 1.00);  // Base + per item
```

### Modify Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-pink: #E8B4C8;
    --brown: #8B6F47;
    --gold: #C9A961;
    /* ... */
}
```

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔧 Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, lightweight and fast
- **localStorage** - Cart persistence across sessions
- **Google Fonts** - Cormorant (serif) and Montserrat (sans-serif)

## 📝 To-Do for Production

- [ ] Add actual product images
- [ ] Integrate real payment processing
- [ ] Set up backend API for order management
- [ ] Implement email notifications
- [ ] Add SSL certificate for HTTPS
- [ ] Set up analytics (Google Analytics)
- [ ] Implement actual newsletter subscription service
- [ ] Add inventory management
- [ ] Set up automated seasonal product rotation
- [ ] Create admin dashboard for order management

## 🌟 Features Explanation

### Automatic Bundle Discount
When customers add 4 or more soaps to their cart, they automatically receive the bundle pricing ($20 for 4 soaps instead of $24), saving $4 per bundle.

### Seasonal Product Management
Seasonal soaps are marked with a "Seasonal" badge and can be set to show as "out of stock" during off-season in the `products.js` file by changing `inStock: false`.

### Local Pickup & Church Delivery
Free shipping options for local customers who prefer to pick up at the farm or have items delivered to church.

### Gift Wrapping
Customers can add beautiful gift wrapping with dried flowers and leaves for $3.00 per order.

## 📧 Contact

For questions about this website, please use the contact form on the site or reach out to Clara at hello@clarassoap.com

---

**Made with 💕 for Clara's Soap**
*Supporting young entrepreneurs, one bar at a time!*
