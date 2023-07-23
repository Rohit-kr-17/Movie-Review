import React, { forwardRef, useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../utils/Theme";

export default function LiveSearch({
	inputStyle,
	value = "",
	onChange = null,
	placeholder = "",
	results = [],
	selectedResultStyle,
	resultContainerStyle,
	renderItem = null,
	onselect = null,
}) {
	const [displaySearch, setDisplaySearch] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const handleOnFocus = () => {
		if (results.length) setDisplaySearch(true);
	};
	const handleOnBlur = () => {
		setDisplaySearch(false);
		setFocusedIndex(-1);
	};

	const handleSelection = (selectedItem) => {
		onselect(selectedItem);
	};
	const handleKeyDown = ({ key }) => {
		let nextCount;
		const keys = ["ArrowUp", "ArrowDown", "Enter", "Escape"];
		if (!keys.includes(key)) return;
		//move selection up and down
		if (key === "ArrowDown") {
			nextCount = (focusedIndex + 1) % results.length;
		}
		if (key === "ArrowUp") {
			nextCount = (focusedIndex + results.length - 1) % results.length;
		}
		if (key === "Enter") {
			return handleSelection(results[focusedIndex]);
		}
		setFocusedIndex(nextCount);
	};
	const getInputStyle = () => {
		return inputStyle
			? inputStyle
			: commonInputClasses + " rounded border-2 p-1 text-lg ";
	};
	return (
		<div className="relative">
			<input
				type="text"
				className={getInputStyle()}
				placeholder={placeholder}
				onFocus={handleOnFocus}
				onBlur={handleOnBlur}
				onKeyDown={handleKeyDown}
				value={value}
				onChange={onChange}
			/>
			<SearchResults
				focusedIndex={focusedIndex}
				visible={displaySearch}
				results={results}
				onselect={handleSelection}
				renderItem={renderItem}
				resultContainerStyle={resultContainerStyle}
				selectedResultStyle={selectedResultStyle}
			/>
		</div>
	);
}
const renderItem = ({ id, name, avatar }) => {
	return (
		<div className="flex">
			<img src={avatar} alt="" />
			<p>{name}</p>
		</div>
	);
};

const SearchResults = ({
	visible,
	results = [],
	focusedIndex,
	onselect,
	renderItem,
	resultContainerStyle,
	selectedResultStyle,
}) => {
	const resultContainer = useRef();
	useEffect(() => {
		//console.log(resultContainer);
		resultContainer.current?.scrollIntoView(
			{
				behaviour: "smooth",
				block: "center",
			},
			[focusedIndex]
		);
	});
	if (!visible) return null;
	return (
		<div className="absolute right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar">
			{results.map((result, index) => {
				const getSelectedClass = () => {
					return selectedResultStyle
						? selectedResultStyle
						: "dark:bg-dark-subtle bg-light-subtle";
				};
				return (
					<ResultCard
						ref={index === focusedIndex ? resultContainer : null}
						key={result.id}
						item={result}
						renderItem={renderItem}
						resultContainerStyle={resultContainerStyle}
						selectedResultStyle={
							index === focusedIndex ? getSelectedClass() : ""
						}
						onMouseDown={() => onselect(result)}
					/>
				);
			})}
		</div>
	);
};

const ResultCard = forwardRef((props, ref) => {
	const {
		item,
		renderItem,
		resultContainerStyle,
		selectedResultStyle,
		onMouseDown,
	} = props;

	const getClasses = () => {
		if (resultContainerStyle)
			return resultContainerStyle + " " + selectedResultStyle;
		return (
			selectedResultStyle +
			" cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition"
		);
	};
	return (
		<div onMouseDown={onMouseDown} ref={ref} className={getClasses()}>
			{renderItem(item)}
		</div>
	);
});
