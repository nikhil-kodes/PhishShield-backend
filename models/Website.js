import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true,
			unique: true,
		},
		score: {
			type: Number,
			required: true,
		},
		reason: [{ type: String, required: true }],
	},
	{
		timestamps: true,
	},
);

export const Website = mongoose.model("Website", websiteSchema);
