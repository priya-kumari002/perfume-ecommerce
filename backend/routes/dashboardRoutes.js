import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, admin, getDashboardStats);

export default router;