const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passwordResetTokenSchema = mongoose.Schema({
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
		expires: 3600000,
		default: Date.now(),
	},
});

passwordResetTokenSchema.pre("save", async function (next) {
	if (this.isModified("token")) {
		this.token = await bcrypt.hashSync(this.token, 10);
	}
	next();
});

passwordResetTokenSchema.methods.compareToken = async function (token) {
	return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
