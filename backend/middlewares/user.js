const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");
const { sendError } = require("../utils/helper");
exports.isValidPassResetToken = async (req, res, next) => {
	const { token, userId } = req.body;
	if (!token.trim() || !isValidObjectId(userId))
		return sendError(res, "Invalid request");

	const resetToken = await PasswordResetToken.findOne({ owner: userId });
	//console.log(resetToken);
	if (!resetToken)
		return sendError(res, "Unauthorize access, invalid request!");

	const matched = await resetToken.compareToken(token);
	if (!matched) return sendError(res, "Unauthorize access, invalid request!");
	req.resetToken = resetToken;
	next();
};
