// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import rateLimit from "express-rate-limit";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";   // ← Import
// import categoryRoutes from "./routes/categoryRoutes.js";
// import brandRoutes from "./routes/brandRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import path from "path";
// import cartRoutes from "./routes/cartRoutes.js";
// import { fileURLToPath } from "url";
// import couponRoutes from "./routes/couponRoutes.js";
// import wishlistRoutes from "./routes/wishlistRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// // server.js
// import userRoutes from "./routes/userRoutes.js";
// // server.js
// import dashboardRoutes from "./routes/dashboardRoutes.js";

// // server.js
// import adminUserRoutes from "./routes/adminUserRoutes.js";
// import Review from "./models/Review.js";
// // server.js
// import aiRoutes from "./routes/aiRoutes.js";


// import reviewRoutes from "./routes/reviewRoutes.js";

// // baaki routes ke saath:


// dotenv.config();
// connectDB();

// const app = express();

// app.use(helmet());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(morgan("dev"));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 200,
// });
// app.use("/api", limiter);

// app.get("/", (req, res) => {
//   res.json({ message: "Perfume E-commerce API is running..." });
// });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(
//   "/uploads",
//   (req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//     next();
//   },
//   express.static(path.join(__dirname, "uploads"))
// );
// // Routes
// app.use("/api/auth", authRoutes);   // ← Yeh line missing thi
// app.use("/api/categories", categoryRoutes);
// app.use("/api/brands", brandRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/coupons", couponRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/admin/users", adminUserRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/ai", aiRoutes);
// // server.js
// // app.use("/api/wishlist", wishlistRoutes);
// // Error Handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: err.message || "Server Error" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Crash protectors
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security + CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
app.use("/api", limiter);

// Static uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Health
app.get("/", (req, res) => {
  res.json({ message: "Perfume E-commerce API is running..." });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} already in use. Kill it first.`);
  } else {
    console.error("Server error:", err);
  }
});