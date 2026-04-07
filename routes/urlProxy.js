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
		
		if (!targetBackend) {
			return res.status(500).json({ 
				message: "Secondary backend URL not configured",
				error: "SECOND_BACKEND environment variable is missing"
			});
		}

		const response = await fetch(targetBackend, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ url }),
		});

		// Check if the response is OK
		if (!response.ok) {
			return res.status(response.status).json({
				message: "Secondary backend error",
				error: `Backend returned status ${response.status}`,
				backendUrl: targetBackend
			});
		}

		// Check content type before parsing JSON
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			const textResponse = await response.text();
			return res.status(500).json({
				message: "Secondary backend returned non-JSON response",
				error: "Expected JSON but got: " + contentType,
				backendUrl: targetBackend,
				responsePreview: textResponse.substring(0, 200) + "..."
			});
		}

		const data = await response.json();
		
		// Handle the actual response format from ML backend
		const score = data.phishing_chance !== undefined ? data.phishing_chance : data.score;
		const status = data.status ? data.status.toLowerCase() : undefined;
		
		// Validate response data
		if (score === undefined || status === undefined) {
			return res.status(500).json({
				message: "Invalid response from secondary backend",
				error: "Missing required fields: phishing_chance/score or status",
				receivedData: data
			});
		}

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
		// Handle both "dangerous" and "unsafe" status, opposite of "safe"
		if (status && (status === "dangerous" || status === "unsafe" || (status === "safe" && score > 0.5))) {
			update.$inc.linksBlocked = 1;
		}

		// Update the user
		const updatedUser = await User.findByIdAndUpdate(req.user._id, update, {
			new: true,
		});

		// Return normalized response format while preserving original data
		res.json({
			score,
			status,
			reason: data.reason,
			url: data.url,
			phishing_chance: data.phishing_chance,
			original_response: data
		});
	} catch (error) {
		console.error("URL Proxy Error:", error);
		
		// Handle specific error types
		if (error.code === 'ECONNREFUSED') {
			return res.status(503).json({ 
				message: "Secondary backend is not available",
				error: `Cannot connect to ${process.env.SECOND_BACKEND}`,
				suggestion: "Make sure the ML backend server is running"
			});
		}
		
		if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
			return res.status(500).json({
				message: "Secondary backend returned invalid JSON",
				error: error.message,
				backendUrl: process.env.SECOND_BACKEND
			});
		}

		res.status(500).json({ 
			message: "Server error", 
			error: error.message,
			type: error.name
		});
	}
});

export default router;
