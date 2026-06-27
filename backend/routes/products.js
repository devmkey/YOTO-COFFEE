const { Router } = require("express");
const pool = require("../db");

const router = Router();

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Yoto signature latte", price: 4.5, category: "hot", description: "Espresso, steamed milk, caramel.", image: null },
  { id: 2, name: "Cappuccino", price: 4.25, category: "hot", description: "Bold espresso, airy foam.", image: null },
  { id: 3, name: "Pour over", price: 3.9, category: "hot", description: "Single-origin, slow brewed.", image: null },
  { id: 4, name: "Cold brew classic", price: 4.0, category: "cold", description: "Steeped 18 hours, smooth.", image: null },
  { id: 5, name: "Iced mocha", price: 4.75, category: "cold", description: "Espresso, chocolate, cream.", image: null },
  { id: 6, name: "Yoto frappe", price: 5.0, category: "cold", description: "Blended, whipped, indulgent.", image: null },
  { id: 7, name: "Butter croissant", price: 3.25, category: "pastries", description: "Flaky, baked fresh daily.", image: null },
  { id: 8, name: "Cinnamon roll", price: 3.75, category: "pastries", description: "Warm, glazed, fresh.", image: null },
];

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows.map(normalize));
  } catch (err) {
    console.warn("DB unavailable, using static product data —", err.message);
    res.json(FALLBACK_PRODUCTS);
  }
});

function normalize(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    category: row.category,
    description: row.description,
    image: row.image || null,
  };
}

module.exports = router;
