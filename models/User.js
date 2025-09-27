import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: { type: String, required: true },
		phoneNumber: { type: Number, required: true, unique: true },
		credits: { type: Number, default: 0 },
		linksVisited: { type: Number, default: 0 },
		linksBlocked: { type: Number, default: 0 },
		history: [
			{
				url: String,
				score: Number,
				status: { type: String, enum: ["safe", "suspicious", "dangerous"] },
				visitedAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema)

export default User