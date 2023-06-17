const User = require("../models/user");
const jwt = require("jsonwebtoken");
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");
const passwordResetToken = require("../models/passwordResetToken");
exports.create = async (req, res) => {
	const { name, email, password } = req.body;
	const oldUser = await User.findOne({ email });
	if (oldUser) return sendError(res, "This email is already in use");
	const newUser = new User({ name, email, password });
	await newUser.save();
	//generate 6 digit OTP
	let OTP = generateOTP();
	//store OTP inside DB
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: newUser._id,
		token: OTP,
	});
	await newEmailVerificationToken.save();
	//send OTP to user
	var transport = generateMailTransporter();
	transport.sendMail({
		from: "verification@reviewapp.com",
		to: newUser.email,
		subject: "Email Verification",
		html: `
		<p> Your Verification OTP
		<h1>${OTP}</h1>`,
	});
	res.status(201).json({
		user: { id: newUser._id, name: newUser.name, email: newUser.email },
	});
};

exports.verifyEmail = async (req, res) => {
	const { userId, OTP } = req.body;
	if (!isValidObjectId(userId)) return res.json({ error: "Invalid User" });
	const user = await User.findById(userId);
	if (!user) return sendError(res, "User not found", 404);
	if (user.isVerified) return sendError(res, "Email already verified");
	const token = await EmailVerificationToken.findOne({ owner: userId });
	if (!token) return sendError(res, "Token not found");

	const isMatched = await token.compareToken(OTP);
	if (!isMatched) return sendError(res, "Submit a valid OTP");
	user.isVerified = true;
	await user.save();
	await EmailVerificationToken.findByIdAndDelete(token._id);
	console.log(token._id);
	var transport = generateMailTransporter();
	transport.sendMail({
		from: "verification@reviewapp.com",
		to: user.email,
		subject: "Welcome Email",
		html: `
		<p> You are Verified`,
	});
	const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
	res.json({
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			token: jwtToken,
			isVerified: user.isVerified,
		},
		message: "Your email is verified",
	});
};

exports.resendEmailVerificationToken = async (req, res) => {
	const { userId } = req.body;
	const user = await User.findById(userId);
	if (!user) return sendError(res, "User not found", 404);
	if (user.isVerified) return sendError(res, "Email already Verified");
	const alreadyHasToken = await EmailVerificationToken.findOne({
		owner: userId,
	});
	if (alreadyHasToken)
		return sendError(res, "You can request for another OTP after an hour");
	//generate 6 digit OTP
	let OTP = generateOTP();
	//store OTP inside DB
	const newEmailVerificationToken = new EmailVerificationToken({
		owner: user._id,
		token: OTP,
	});
	await newEmailVerificationToken.save();
	//send OTP to user
	var transport = generateMailTransporter();
	transport.sendMail({
		from: "verification@reviewapp.com",
		to: user.email,
		subject: "Email Verification",
		html: `
		<p> Your Verification OTP
		<h1>${OTP}</h1>`,
	});
	return res.json({ message: "New OTP sent to your registered email" });
};

//Pasword Reset

exports.forgetPassword = async (req, res) => {
	const { email } = req.body;
	if (!email) return sendError(res, "Email is missing");
	const user = await User.findOne({ email });
	if (!user) return sendError(res, "User not found", 404);

	const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
	if (alreadyHasToken)
		return sendError(res, "Can request new Token only after an hour");
	const token = await generateRandomByte();
	const newPasswordResetToken = await passwordResetToken({
		owner: user._id,
		token,
	});
	await newPasswordResetToken.save();
	const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;
	const transport = generateMailTransporter();
	transport.sendMail({
		from: "security@reviewapp.com",
		to: user.email,
		subject: "Reset Password Link",
		html: `<p>Click here to reset password</p>
		<a href='${resetPasswordUrl}'>Change password</a>`,
	});
	res.json({ message: "Link Send to your email" });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
	res.json({ valid: true });
};
exports.resetPassword = async (req, res) => {
	const { newPassword, userId } = req.body;
	const user = await User.findById(userId);
	const matched = await user.comparePassword(newPassword);
	if (matched)
		return sendError(res, "New password must be different from the old one");
	user.password = newPassword;
	await user.save();
	await passwordResetToken.findByIdAndDelete(req.resetToken._id);
	const transport = generateMailTransporter();
	transport.sendMail({
		from: "security@reviewapp.com",
		to: user.email,
		subject: " Password changed",
		html: `Password reset Successful`,
	});
	res.json({ message: "Password reset successful" });
};

exports.signIn = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) return sendError(res, "Credential mismatch");

	const matched = await user.comparePassword(password);
	if (!matched) return sendError(res, "Credential mismatch");
	const { _id, name, role, isVerified } = user;
	const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);
	res.json({
		user: { id: _id, name, email, role, token: jwtToken, isVerified },
	});
};
