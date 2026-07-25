import express from "express";
import {
  getAllUsers,
  toggleBlockUser,
  updateUserRole,
} from "../controllers/adminUserController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);
router.get("/", getAllUsers);
router.put("/:id/block", toggleBlockUser);
router.put("/:id/role", updateUserRole);

export default router;