import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signJwt = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

export const verifyJwt = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
