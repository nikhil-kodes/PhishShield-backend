import jwt from "jsonwebtoken";
dotenv.config();

const signJwt = (payload) => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || "1h",
	});
};

const verifyJwt = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { signJwt, verifyJwt };
