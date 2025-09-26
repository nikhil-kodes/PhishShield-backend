import { body, validationResult } from "express-validator";

export const signupValidator = [
	body("name")
		.isLength({ min: 2 })
		.withMessage("Name must be at least 2 characters"),
	body("email").isEmail().withMessage("Please provide a valid email"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters"),
	body("phoneNumber")
		.isMobilePhone("en-IN")
		.withMessage("Phone Number should be at least 10 digits"),
	(req, res, next) => {
        console.log(req.body)
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		next();
	},
];

export const loginValidator = [
	body("email").isEmail().withMessage("Valid email required"),
	body("password").exists().withMessage("Password is required"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		next();
	},
];
