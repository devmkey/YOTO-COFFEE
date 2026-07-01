require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const productsRouter = require("./routes/products");
const contactRouter = require("./routes/contact");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ── Allowed frontend origins ────────────────────────────
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = frontendURL
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

// ── Security ────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// ── Rate limiting ───────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/auth", limiter); // only rate-limit auth routes

// ── CORS ────────────────────────────────────────────────
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Request logging (production-light) ──────────────────
app.use((req, _res, next) => {
  if (NODE_ENV !== "production") {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// ── Routes ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.redirect(301, allowedOrigins[0] || "http://localhost:3000");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: NODE_ENV });
});

app.use("/api/products", productsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ── 404 ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Global error handler ────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ───────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT} [${NODE_ENV}]`);
});
