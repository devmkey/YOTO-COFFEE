# Yoto Coffee House — Next.js frontend

Warm, rustic coffee-house site built with Next.js (App Router) + Tailwind CSS.
Static product data for now — ready to swap for a real API later.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project structure

```
app/
  layout.js        root layout — loads fonts, wraps every page with Navbar + Footer
  page.js           Home
  menu/page.js      Menu (client-side category filter)
  contact/page.js   Contact (location, hours, contact form)
  login/page.js     Login
  globals.css       Tailwind directives + base typography
components/
  Navbar.js         sticky nav with mobile menu
  Footer.js
  Button.js         primary / secondary / outlineLight variants
  Card.js           generic info card (used for hours / location / today's pick)
  ProductCard.js    coffee/pastry item card
  icons.js          small inline SVG icon set
lib/
  products.js       static menu data — id, name, price, category, desc
```

## Design tokens (tailwind.config.js)

| Token | Hex | Use |
|---|---|---|
| `cream` | #FAF3E7 | page background |
| `coffeeDark` | #2A1B12 | hero, footer, headings |
| `coffeeMid` | #6F4E37 | product card art |
| `tan` | #C9A77C | product card art, hero accent circle |
| `terracotta` | #C1440E | primary buttons, links, accents |
| `borderTan` | #E3D4B8 | card and input borders |

Fonts: **Playfair Display** (headings, logo) + **Inter** (body/UI), loaded via `next/font/google` — no extra setup needed, they're bundled at build time.

## Next steps (when you're ready for the backend)

- Replace `lib/products.js` with calls to your Express API (e.g. `GET /api/products`)
- Wire up the Contact and Login forms to real endpoints (`POST /api/contact`, `POST /api/auth/login`)
- Add a PostgreSQL schema for `products`, `orders`, and `users`
- Consider moving cart/checkout state into a small client-side context once you add ordering
