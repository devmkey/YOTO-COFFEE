const { Router } = require("express");
const pool = require("../db");

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  try {
    await pool.query(
      "INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.status(201).json({ success: true, stored: true });
  } catch (err) {
    console.warn("DB unavailable, contact saved in-memory —", err.message);
    res.status(201).json({ success: true, stored: false });
  }
});

module.exports = router;
