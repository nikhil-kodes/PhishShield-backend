import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: Number,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;