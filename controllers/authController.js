import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signJwt } from "../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

// POST /api/auth/signup
export const signup = async (req, res) => {
	const { name, email, password } = req.body;
	// Prevent duplicate emails
	const existing = await User.findOne({ email });
	if (existing)
		return res.status(409).json({ message: "Email already registered" });

	const hashed = await bcrypt.hash(password, saltRounds);
	const user = new User({ name, email, password: hashed });
	await user.save();

	const token = signJwt({ id: user._id, email: user.email });
	res.status(201).json({
		message: "User created",
		token,
		user: { id: user._id, email: user.email, name: user.name },
	});
};

// POST /api/auth/login
export const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ message: "Invalid credentials" });

	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.status(401).json({ message: "Invalid credentials" });

	const token = signJwt({ id: user._id, email: user.email });
	res.json({
		message: "Login successful",
		token,
		user: { id: user._id, email: user.email, name: user.name },
	});
};

// GET /api/auth/profile - example protected route
export const profile = async (req, res) => {
	// req.user is attached by protect middleware
	res.json({ user: req.user });
};
