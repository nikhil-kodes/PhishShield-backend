import { verifyJwt } from "../utils/jwt.js";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// Protect routes - check for Bearer token and attach user to req.user
export const protect = asyncHandler(async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Authorization token missing" });
	}

	const token = authHeader.split(" ")[1];
	try {
		const decoded = verifyJwt(token);

		const user = await User.findById(decoded.id).select("-password");
		if (!user)
			return res.status(401).json({ message: "Invalid token: user not found" });
		req.user = user; // attach user to request
		next();
	} catch (err) {
		return res
			.status(401)
			.json({ message: "Invalid or expired token", error: err.message });
	}
});
