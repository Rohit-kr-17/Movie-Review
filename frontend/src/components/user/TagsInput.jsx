import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function TagsInput() {
	const input = useRef();
	const tagsInput = useRef();
	const [tag, setTag] = useState("");
	const [tags, setTags] = useState([]);

	const handleOnFocus = () => {
		tagsInput.current.classList.remove(
			"dark:border-dark-subtle",
			"border-light-subtle"
		);
		tagsInput.current.classList.add("dark:border-white", "border-primary");
	};
	const handleOnBlur = () => {
		tagsInput.current.classList.add(
			"dark:border-dark-subtle",
			"border-light-subtle"
		);
		tagsInput.current.classList.remove("dark:border-white", "border-primary");
	};

	useEffect(() => {
		input.current.scrollIntoView({
			behavior: "smooth",
		});
	}, [tag]);

	const handleonChange = ({ target }) => {
		const { value } = target;
		if (value != ",") setTag(value);
	};

	const handleKeyDown = ({ key }) => {
		if (key === "," || key === "Enter") {
			if (!tag) return;
			if (tags.includes(tag)) return setTag("");
			setTags([...tags, tag]);
			setTag("");
		}
		if (key === "Backspace" && !tag && tags.length) {
			const newTags = tags.filter((_, index) => index !== tags.length - 1);
			setTags([...newTags]);
		}
	};
	const removeTag = (tagToRemove) => {
		const newTags = tags.filter((tag) => tag !== tagToRemove);
		setTags([...newTags]);
	};
	return (
		<div>
			<div
				ref={tagsInput}
				onKeyDown={handleKeyDown}
				className=" transition overflow-x-auto custom-scroll-bar border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full flex items-center dark:text-white space-x-2"
			>
				{tags.map((t) => (
					<Tag onClick={() => removeTag(t)} key={t}>
						{t}
					</Tag>
				))}
				<input
					ref={input}
					value={tag}
					onChange={handleonChange}
					onFocus={handleOnFocus}
					onBlur={handleOnBlur}
					type="text"
					placeholder="Tag one, Tag Two"
					className="h-full flex-grow bg-transparent outline-none dark:text-white"
				/>
			</div>
		</div>
	);
}

const Tag = ({ children, onClick }) => {
	return (
		<span className="whitespace-nowrap dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1">
			{children}{" "}
			<button type="button" onClick={onClick}>
				<AiOutlineClose size={12} />
			</button>
		</span>
	);
};
