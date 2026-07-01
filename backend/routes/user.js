const { Router } = require("express");
const pool = require("../db");
const { authenticate } = require("../middleware/auth"); // Let me check if authenticate is the right export

const router = Router();

// GET /api/user/profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    let user;
    
    try {
      const result = await pool.query("SELECT id, name, email, contact FROM users WHERE id = $1", [userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      user = result.rows[0];
    } catch (dbErr) {
      // In-memory fallback if DB is not available, but let's assume DB is up or we need to access memoryUsers.
      // For simplicity, we just return an error if DB fails, as memory users aren't accessible here easily.
      // Wait, memoryUsers are exported from auth.js? No, they are local.
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/user/profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, email, contact } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    let user;

    try {
      const result = await pool.query(
        "UPDATE users SET name = $1, email = $2, contact = $3 WHERE id = $4 RETURNING id, name, email, contact",
        [name, email, contact || null, userId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      user = result.rows[0];
    } catch (dbErr) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;
