const { check, validationResult } = require("express-validator");

exports.userValidator = [
	check("name").trim().not().isEmpty().withMessage("Name is missing"),
	check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
	check("password")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password is invalid")
		.isLength({ min: 8 })
		.withMessage("Password must be 8 charactes long"),
];
exports.validatePassword = [
	check("newPassword")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password is invalid")
		.isLength({ min: 8 })
		.withMessage("Password must be 8 charactes long"),
];
exports.signInValidator = [
	check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
	check("password").trim().not().isEmpty().withMessage("Password is invalid"),
];

exports.validate = (req, res, next) => {
	const error = validationResult(req).array();
	if (error.length) {
		return res.json({ error: error[0].msg });
	}
	next();
};

exports.actorInfoValidator = [
	check("name").trim().not().isEmpty().withMessage("Name is missing"),
	check("about").trim().not().isEmpty().withMessage("about is missing"),
	check("gender").trim().not().isEmpty().withMessage("Gender is missing"),
];
