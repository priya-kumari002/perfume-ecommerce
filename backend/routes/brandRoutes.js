import express from "express";
import { getBrands, createBrand } from "../controllers/brandController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getBrands);
router.post("/", protect, admin, createBrand);

export default router;