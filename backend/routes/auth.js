const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

let dbUp = true;
pool.query("SELECT 1").catch(() => { dbUp = false; });

const memoryUsers = [];

// ── Seed admin user on startup ──────────────────────────
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@yoto.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345678";

async function seedAdmin() {
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (dbUp) {
    try {
      const existing = await pool.query("SELECT id FROM users WHERE email = $1", [ADMIN_EMAIL]);
      if (existing.rows.length === 0) {
        await pool.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
          [ADMIN_NAME, ADMIN_EMAIL, hashed]
        );
        console.log("✅ Admin user seeded in database");
      } else {
        // Update password to match env var
        await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashed, ADMIN_EMAIL]);
        console.log("✅ Admin user password updated in database");
      }
    } catch (err) {
      console.error("⚠️  Failed to seed admin in DB, falling back to in-memory:", err.message);
      dbUp = false;
      memoryUsers.push({ id: 1, name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed });
      console.log("✅ Admin user seeded in-memory");
    }
  } else {
    memoryUsers.push({ id: 1, name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed });
    console.log("✅ Admin user seeded in-memory");
  }
}

// Run seed after a short delay to let the DB check complete
setTimeout(seedAdmin, 1000);

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    if (dbUp) {
      const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "Email already registered" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    if (dbUp) {
      const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
        [name, email, hashed]
      );
      const user = result.rows[0];
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(201).json({ user, token });
    }

    const id = memoryUsers.length + 1;
    memoryUsers.push({ id, name, email, password: hashed });
    const user = { id, name, email };
    const token = jwt.sign({ userId: id, email }, JWT_SECRET, { expiresIn: "7d" });
    console.warn("DB unavailable, user stored in-memory");
    res.status(201).json({ user, token });

  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    let user;

    if (dbUp) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      user = result.rows[0];
    } else {
      user = memoryUsers.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });

  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

module.exports = router;
