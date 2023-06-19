const cloudinary = require("../cloud");
const { sendError } = require("../utils/helper");
const Movie = require("../models/movie");
const { isValidObjectId } = require("mongoose");
exports.uploadTrailer = async (req, res) => {
	const { file } = req;
	if (!file) return sendError(res, "Video file is missing");
	const { secure_url: url, public_id } = await cloudinary.uploader.upload(
		file.path,
		{
			resource_type: "video",
		}
	);
	res.status(201).json({ url, public_id });
};
exports.createMovie = async (req, res) => {
	const { file, body } = req;
	const {
		title,
		storyLine,
		director,
		releaseDate,
		status,
		type,
		genres,
		tags,
		cast,
		writers,

		trailer,
		language,
	} = body;

	const newMovie = new Movie({
		title,
		storyLine,
		releaseDate,
		status,
		type,
		genres,
		tags,
		cast,
		trailer,
		language,
	});
	if (director) {
		if (!isValidObjectId(director)) return sendError(res, "Invalid Director");
		newMovie.director = director;
	}
	if (writers) {
		for (let writerId of writers) {
			if (isValidObjectId(writerId)) return sendError(res, "Invalid writer");
		}
		newMovie.writers = writers;
	}

	//uploading poster
	console.log(file);
	const {
		secure_url: url,
		public_id,
		responsive_breakpoints,
	} = await cloudinary.uploader.upload(file.path, {
		transformation: {
			width: 1280,
			height: 720,
		},
		responsive_breakpoints: {
			create_derived: true,
			max_width: 640,
			max_images: 3,
		},
	});
	const finalposter = { url, public_id, responsive: [] };
	const { breakpoints } = responsive_breakpoints[0];
	if (breakpoints.length) {
		for (let imgObj of breakpoints) {
			const { secure_url } = imgObj;
			finalposter.responsive.push(secure_url);
		}
	}
	newMovie.poster = finalposter;
	await newMovie.save();

	res.status(201).json({
		id: newMovie._id,
		title,
	});
};
