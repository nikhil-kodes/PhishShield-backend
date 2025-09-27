import express from "express";
const router = express.Router();
import { signup, login, profile, updateProfile } from "../controllers/authController.js";
import { signupValidator, loginValidator } from "../middlewares/validators.js";
import { protect } from "../middlewares/authMiddleware.js";

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.get("/profile", protect, profile);
router.put('/profile', protect, updateProfile)

export default router;
