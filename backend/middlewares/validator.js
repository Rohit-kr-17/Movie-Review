const { check, validationResult } = require("express-validator");
const genres = require("../utils/genres");

const { isValidObjectId } = require("mongoose");
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

exports.validateMovie = [
	check("title").trim().not().isEmpty().withMessage("Movie title is missing"),
	check("storyLine").trim().not().isEmpty().withMessage("Storyline is missing"),
	check("language").trim().not().isEmpty().withMessage("language is missing"),
	check("releaseDate")
		.isDate()
		.isEmpty()
		.withMessage("Release date is missing"),
	check("status")
		.isIn(["public", "private"])
		.isEmpty()
		.withMessage("Movie status must be public or private"),
	check("type").trim().not().isEmpty().withMessage("Movie type is missing"),
	check("genres")
		.isArray()
		.withMessage("Genres must be an Array of string")
		.custom((value) => {
			for (let g of value) {
				if (!genres.includes(g)) throw Error("Invalid genre");
			}
			return true;
		}),
	check("tags")
		.isArray({ min: 1 })
		.withMessage("Tags must be an array of strings!")
		.custom((tags) => {
			for (let tag of tags) {
				if (!genres.includes(tag)) throw Error("Invalid tag");
			}
			return true;
		}),
	check("cast")
		.isArray()
		.withMessage("Tags must be an array of strings!")
		.custom((cast) => {
			for (let c of cast) {
				if (!isValidObjectId(c.actor)) throw Error("Invalid cast Id");
				if (!c.roleAs?.trim()) throw Error("Role as is missing inside cast");
				if (typeof c.leadActor !== "boolean")
					throw Error("Only accepted boolean value for lead actor");
			}
			return true;
		}),
	check("trailer")
		.isObject()
		.withMessage("Trailer info must be an object with url and public Id")
		.custom(({ url, public_id }) => {
			try {
				const result = new URL(url);
				if (!result.protocol.includes("http"))
					throw Error("Trailer url is Invalid");
				const arr = url.split("/");
				const publicId = arr[arr.length - 1].split(".")[0];
				if (public_id !== publicId) throw Error("Trailer public_id is invalid");
				return true;
			} catch (error) {
				throw Error("Trailer url is Invalid");
			}
		}),
	// check("poster").custom((_, { req }) => {
	// 	if (!req.file) throw Error("Poster file is Invalid");
	// 	return true;
	// }),
];

exports.actorInfoValidator = [
	check("name").trim().not().isEmpty().withMessage("Name is missing"),
	check("about").trim().not().isEmpty().withMessage("about is missing"),
	check("gender").trim().not().isEmpty().withMessage("Gender is missing"),
];

exports.validate = (req, res, next) => {
	const error = validationResult(req).array();
	if (error.length) {
		console.log(error);
		return res.json({ error: error[0].msg });
	}
	next();
};
