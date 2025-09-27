import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js"; // your User model

const router = express.Router();

router.get("/summary", protect, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Example: assuming your User schema has:
    // - blockedLinks (number)
    // - visitedLinks (number)
    // - history (array of { url, visitedAt, status, score })
    // - credits (number)

    const blockedCount = user.blockedLinks || 0;
    const attemptsDetected = user.visitedLinks || 0;
    const total = blockedCount + attemptsDetected;
    const protectedPercentage =
      total > 0 ? Math.round((blockedCount / total) * 100) : 0;

    res.json({
      protectedPercentage,
      blockedCount,
      attemptsDetected,
      credits: user.credits || 0,
      carouselTips: [
        "Never click suspicious links in emails.",
        "Check the sender address carefully.",
        "Use 2FA whenever possible.",
      ],
      history: user.history || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
