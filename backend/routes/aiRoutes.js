import express from "express";
import {
  getRecommendations,
  chatAssistant,
  summarizeReviews,
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/recommendations", getRecommendations);
router.post("/chat", chatAssistant);
router.get("/reviews/summary/:productId", summarizeReviews);

export default router;