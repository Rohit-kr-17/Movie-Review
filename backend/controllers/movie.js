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
exports.updateMovieWithoutPoster = async (req, res) => {
	const { movieId } = req.params;
	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");

	const movie = await Movie.findById(movieId);
	if (!movie) return sendError(res, "Movie not Found", 404);

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
	} = req.body;
	movie.title = title;
	movie.storyLine = storyLine;
	movie.tags = tags;
	movie.releaseDate = releaseDate;
	movie.status = status;
	movie.genres = genres;
	movie.type = type;
	movie.cast = cast;
	movie.trailer = trailer;
	movie.language = language;

	if (director) {
		if (!isValidObjectId(director)) return sendError(res, "Invalid Director");
		movie.director = director;
	}
	if (writers) {
		for (let writerId of writers) {
			if (isValidObjectId(writerId)) return sendError(res, "Invalid writer");
		}
		movie.writers = writers;
	}
	await movie.save();
	res.json({ message: "Movie is updated", movie });
};
exports.updateMovieWithPoster = async (req, res) => {
	const { movieId } = req.params;
	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");

	if (!req.file) return sendError(res, "Movie poster is missing");
	const movie = await Movie.findById(movieId);
	if (!movie) return sendError(res, "Movie not Found", 404);

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
	} = req.body;
	movie.title = title;
	movie.storyLine = storyLine;
	movie.tags = tags;
	movie.releaseDate = releaseDate;
	movie.status = status;
	movie.genres = genres;
	movie.type = type;
	movie.cast = cast;
	movie.trailer = trailer;
	movie.language = language;

	if (director) {
		if (!isValidObjectId(director)) return sendError(res, "Invalid Director");
		movie.director = director;
	}
	if (writers) {
		for (let writerId of writers) {
			if (isValidObjectId(writerId)) return sendError(res, "Invalid writer");
		}
		movie.writers = writers;
	}
	const posterId = movie.poster?.public_id;
	if (posterId) {
		const { result } = await cloudinary.uploader.destroy(posterId);
		if (result !== "ok")
			return sendError(res, "Could not update poster at the moment");
	}
	// if there's a new image then upload it to Cloudinary and save its id in db
	const {
		secure_url: url,
		public_id,
		responsive_breakpoints,
	} = await cloudinary.uploader.upload(req.file.path, {
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
	movie.poster = finalposter;
	await movie.save();
	res.json({ message: "Movie is updated", movie });
};
exports.removeMovie = async (req, res) => {
	const { movieId } = req.params;
	if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie Id");
	const movie = await Movie.findById(movieId);
	if (!movie) return sendError(res, "Movie not Found", 404);
	const posterId = movie.poster?.public_id;
	if (posterId) {
		const { result } = await cloudinary.uploader.destroy(posterId);
		if (result !== "ok")
			return sendError(res, "Could not remove poster from cloud");
	}
	const trailerId = movie.trailer?.public_id;
	if (trailerId)
		return sendError(res, "could not find thr trailer in the cloud");
	const { result } = await cloudinary.uploader.destroy(trailerId, {
		resource_type: "video",
	});
	if (result !== "ok")
		return sendError(res, "Could not remove trailer from cloud");

	await movie.findByIdAndDelete(movieId);
	res.json({ message: "Movie removed successfully" });
};
