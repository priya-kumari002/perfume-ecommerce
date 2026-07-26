import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  getAllProductsAdmin,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/admin/all", protect, admin, getAllProductsAdmin);

router.post("/", protect, admin, upload.array("images", 6), createProduct);
router.put("/:id", protect, admin, upload.array("images", 6), updateProduct);

router.delete("/:id", protect, admin, deleteProduct);
router.get("/:slug", getProductBySlug);

export default router;