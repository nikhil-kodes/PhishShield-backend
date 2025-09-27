import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import express from "express";
import fetch from "node-fetch"; // or native fetch if Node >= 18
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js"; // adjust path to your User model

const router = express.Router();

router.post("/scan-url", protect, async (req, res) => {
	try {
		const { url } = req.body;
		if (!url) return res.status(400).json({ message: "URL is required" });

		
		const targetBackend = process.env.SECOND_BACKEND;

		const response = await fetch(targetBackend, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ url }),
		});

		const data = await response.json();
		const { score, status } = data;

		// Prepare update object
		const update = {
			$inc: { linksVisited: 1 },
			$push: {
				history: {
					url,
					score,
					status,
					visitedAt: new Date(),
				},
			},
		};

		// If dangerous, increment linksBlocked
		if (status === "dangerous") {
			update.$inc.linksBlocked = 1;
		}

		// Update the user
		const updatedUser = await User.findByIdAndUpdate(req.user._id, update, {
			new: true,
		});

		res.json( data );
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;
