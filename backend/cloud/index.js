const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: "dsb17sjd3",
	api_key: "328989592731833",
	api_secret: "_puk5CGuMg_RF9_7HXIFHFkwF_A",
	secure: true,
});

module.exports = cloudinary;
