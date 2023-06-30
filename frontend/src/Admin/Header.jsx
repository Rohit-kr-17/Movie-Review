import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { useTheme } from "../hooks";

export default function Header() {
	const [showOptions, setShowOptions] = useState(false);
	const { toggleTheme } = useTheme();
	return (
		<div className="flex items-center justify-between relative">
			<input
				type="text"
				placeholder="Search Movies"
				className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white dark:text-white focus:border-primary transition bg-transparent rounded text-lg p-1"
			/>
			<div className="flex items-center space-x-3">
				<button
					onClick={toggleTheme}
					className="dark:text-white text-light-subtle"
				>
					<BsFillSunFill size={24} />
				</button>
				<button
					onClick={() => setShowOptions(true)}
					className="flex items-center space-x-2 dark:border-dark-subtle  border-light-subtle  dark:text-dark-subtle  text-light-subtle hover:opacity-80 font-semibold border-2 text-lg px-3 py-1"
				>
					<span>Create</span>
					<AiOutlinePlus />
				</button>
				<CreateOptions
					visible={showOptions}
					onClose={() => setShowOptions(false)}
				/>
			</div>
		</div>
	);
}

const CreateOptions = ({ visible, onClose }) => {
	const container = useRef();
	const containerID = "option-container";
	useEffect(() => {
		const handleClose = (e) => {
			if (!visible) return;
			const { parentElement, id } = e.target;
			if (parentElement.id === containerID || id === containerID) return;

			if (container.current) {
				if (!container.current.classList.contains("animate-scale"))
					container.current.classList.add("animate-scale-reverse");
			}
		};

		document.addEventListener("click", handleClose);
		return () => {
			document.removeEventListener("click", handleClose);
		};
	}, [visible]);
	if (!visible) return <></>;
	const handleAnimationEnd = (e) => {
		if (e.target.classList.contains("animate-scale-reverse")) onClose();
		e.target.classList.remove("animate-scale");
	};
	return (
		<div
			id={containerID}
			ref={container}
			className="absolute right-0 top-12 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale "
			onAnimationEnd={handleAnimationEnd}
		>
			<Option>Add Movie</Option>
			<Option>Add Actor</Option>
		</div>
	);
};

const Option = ({ children, onClick }) => {
	return (
		<button
			onClick={onClick}
			className="dark:text-white text-secondary hover:opacity-80 transition"
		>
			{children}
		</button>
	);
};
