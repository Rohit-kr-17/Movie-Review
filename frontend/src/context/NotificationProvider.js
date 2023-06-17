import React, { createContext, useState } from "react";

export const NotificationContext = createContext();
let timeoutId;
export default function NotificationProvider({ children }) {
	const [notification, setNotification] = useState("");
	const [classes, setClasses] = useState("");

	const updateNotification = (type, value) => {
		if (timeoutId) clearTimeout(timeoutId);
		switch (type) {
			case "error":
				setClasses("bg-red-500");
				break;
			case "success":
				setClasses("bg-green-500");
				break;
			case "warning":
				setClasses("bg-orange-500");
				break;
			default:
				setClasses("bg-red-500");
		}
		setNotification(value);
		timeoutId = setTimeout(() => {
			setNotification("");
		}, 3000);
	};
	return (
		<NotificationContext.Provider value={{ updateNotification }}>
			{children}
			{notification && (
				<div
					className={
						classes +
						" fixed left-1/2 rounded -translate-x-1/2 top-24 shadow-md shadow-gray-400   "
					}
				>
					<p className="text-white px-4 py-2 ">{notification}</p>
				</div>
			)}
		</NotificationContext.Provider>
	);
}
