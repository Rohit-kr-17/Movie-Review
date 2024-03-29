const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailVerificationTokenSchema = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		expires: 360000,
		default: Date.now(),
	},
});

emailVerificationTokenSchema.pre("save", async function (next) {
	if (this.isModified("token")) {
		this.token = await bcrypt.hash(this.token, 10);
	}
	next();
});

emailVerificationTokenSchema.methods.compareToken = async function (token) {
	return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model(
	"EmailVerificationToken",
	emailVerificationTokenSchema
);
