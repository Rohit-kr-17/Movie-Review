const multer = require("multer");
const storage = multer.diskStorage({});
const fileFilter = (req, res, cb) => {
	cb(null, true);
};
exports.uploadImage = multer({ storage, fileFilter });
