import React from "react";
import TagsInput from "../components/user/TagsInput";

export default function MovieForm() {
	const handleSubmit = (e) => {
		e.preventDefault();
	};
	const commonInputClasses =
		"w-full outline-none dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary transition bg-transparent dark:text-white text-primary";
	return (
		<form onSubmit={handleSubmit} className="flex space-x-3">
			<div className="w-[70%] h-5 space-y-5">
				<div className="">
					<Label htmlFor="title">Title</Label>
					<input
						id="title"
						type="text"
						placeholder="Titanic"
						className={commonInputClasses + " border-b-2 font-semibold text-xl"}
					/>
				</div>

				<div>
					<Label htmlFor="storyLine">Story Line</Label>
					<textarea
						placeholder="Movie story line"
						id="storyLine"
						className={commonInputClasses + " resize-none h-24 border-b-2"}
					/>
				</div>

				<TagsInput />
			</div>

			<div className="w-[30%]"></div>
		</form>
	);
}

const Label = ({ children, htmlFor }) => {
	return (
		<label
			htmlFor={htmlFor}
			className="dark:text-dark-subtle text-light-subtle font-semibold"
		>
			{children}
		</label>
	);
};
