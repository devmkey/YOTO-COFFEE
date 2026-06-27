require("dotenv").config();

const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");
const contactRouter = require("./routes/contact");
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4000;

const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({ origin: frontendURL }));
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect(301, frontendURL);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
