import React from "react";
import { ImSpinner3 } from "react-icons/im";
export default function Submit({ value, busy }) {
	return (
		<button
			type="submit"
			className="flex w-full rounded dark:bg-white bg-secondary hover:bg-opacity-70 transition font-semibold text-lg dark:text-secondary text-white cursor-pointer p-1 h-10 items-center justify-center"
			value={value}
		>
			{busy ? <ImSpinner3 className="animate-spin" /> : value}
		</button>
	);
}
