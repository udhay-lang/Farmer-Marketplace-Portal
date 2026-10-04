# FarmConnect &mdash; Farmer Marketplace Portal

A complete, front-end-only farmer-to-customer marketplace built as a final-year
college project. It demonstrates how farmers can list and manage produce and
how customers can browse, buy and track orders &mdash; all running entirely in
the browser with **no backend or database required**.

---

## How to run this project

1. **Extract the ZIP** anywhere on your computer.
2. Open the extracted `Farmer-Marketplace-Portal` folder in **VS Code** (or any editor).
3. Open `index.html` directly in a browser, **or** for the best experience use a
   local server so relative paths and future enhancements behave exactly like a
   real deployment:
   - VS Code: install the **Live Server** extension, right-click `index.html`
     and choose **"Open with Live Server"**.
   - Or run `npx serve .` / `python -m http.server` from the project root and
     visit the printed local URL.
4. That's it &mdash; no `npm install`, no build step, no server-side code, no
   database setup. Everything works instantly.

All data (accounts, products, orders, cart, wishlist) is stored in your
browser's **localStorage**, so the demo is fully self-contained and resets
only if you clear your browser storage.

---

## Demo accounts

| Role     | Email                        | Password     |
|----------|-------------------------------|--------------|
| Farmer   | ramesh@farm.com               | farmer123    |
| Customer | arjun@mail.com                 | customer123  |
| Admin    | admin@farmconnect.com          | admin123     |

You can also register brand-new farmer or customer accounts from the
registration pages &mdash; they're saved to localStorage immediately.

---

## Project structure

```
Farmer-Marketplace-Portal/
├── index.html                 # Home / landing page
├── css/
│   ├── style.css               # Global design system (colors, type, buttons, cards, forms)
│   ├── home.css                 # Home page specific sections
│   └── dashboard.css            # Dashboards, marketplace, cart, checkout, tracking
├── js/
│   ├── data.js                  # Seed data + localStorage read/write helpers
│   ├── main.js                  # Icon set, navbar/footer injection, toast notifications
│   ├── product-card.js          # Shared product card renderer, add-to-cart, wishlist
│   ├── auth.js                  # Farmer/customer register & login validation
│   ├── marketplace.js           # Search, filter, sort logic
│   ├── product-details.js       # Single product page logic
│   ├── cart.js                  # Cart totals, quantity controls, promo codes
│   ├── checkout.js               # Checkout validation & order placement
│   ├── order-tracking.js        # Order timeline rendering
│   ├── customer-dashboard.js    # Customer orders, wishlist, profile
│   ├── farmer-dashboard.js      # Farmer stats, orders, order status updates
│   ├── manage-products.js       # Edit/delete farmer product listings
│   └── admin-dashboard.js       # Admin login gate + platform-wide management
├── pages/                      # All secondary pages (see list below)
└── assets/images/              # SVG illustrations & product placeholder art
```

## Pages included

- Home / Landing Page (`index.html`)
- Farmer Registration & Farmer Login
- Farmer Dashboard (stats, recent orders, low-stock alerts, order status updates)
- Add Product
- Manage Products (edit / delete listings)
- Customer Registration & Customer Login
- Marketplace (search, category/price/location filters, sorting)
- Product Details (gallery, reviews, related products, quantity selector)
- Shopping Cart
- Checkout (address + Cash on Delivery / Online Payment)
- Order Success
- Order Tracking (Order Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered)
- Customer Dashboard (orders, wishlist, profile)
- About Us
- Contact / Support
- Admin Dashboard (farmers, customers, products, orders overview + management)

## Key features

- Fully responsive layout for desktop, tablet and mobile, including a mobile
  slide-out navigation menu and a mobile filter drawer on the marketplace page.
- Custom design system: earthy green & harvest-gold palette, Fraunces +
  Manrope type pairing, consistent buttons/cards/forms across every page.
- Client-side form validation with inline error states for every form
  (registration, login, add product, checkout, contact).
- Realistic sample data: 18 products (rice, tomato, onion, potato, carrot,
  banana, mango, coconut, groundnut, sugarcane, millets, organic turmeric &
  honey, etc.) across 12 sample farmers and 2 sample customers.
- Cart with quantity controls, promo codes, free-delivery threshold and a
  live order summary.
- Order tracking timeline that farmers can advance from their dashboard and
  customers/anyone can look up by Order ID.
- Wishlist and wishlist badge count in the navbar.
- Toast notifications for every success/error action (add to cart, login,
  order placed, profile updated, item deleted, etc.).
- Skeleton loading state on the Product Details page and polished empty
  states everywhere data can be missing (empty cart, empty wishlist, no
  orders, no search results, product not found).
- Admin dashboard with its own login gate and the ability to remove farmers,
  customers and products.

## Notes for evaluators

- This is a **front-end demo**: there is no real backend, database, payment
  gateway, or authentication server. All "Online Payment" and email/SMS
  actions are simulated for demonstration purposes only.
- Product images are custom-generated SVG illustrations (not real photos) so
  the project works fully offline with zero external dependencies, aside
  from Google Fonts loaded over the network for typography.
- To reset all demo data, open your browser dev tools and run
  `localStorage.clear()` on any page, then refresh.

Enjoy exploring FarmConnect!
