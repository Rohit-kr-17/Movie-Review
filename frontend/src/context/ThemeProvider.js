import React, { createContext, useEffect } from "react";
const defaultTheme = "light";
const darkTheme = "dark";
export const ThemeContext = createContext();
export default function ThemeProvider({ children }) {
	const toggleTheme = () => {
		const oldTheme = getTheme();
		const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;
		updateTheme(newTheme, oldTheme);
	};
	useEffect(() => {
		const theme = getTheme();
		if (!theme) updateTheme(defaultTheme);
		else updateTheme(theme);
	}, []);
	return (
		<div>
			<ThemeContext.Provider value={{ toggleTheme }}>
				{children}
			</ThemeContext.Provider>
		</div>
	);
}

const getTheme = () => {
	return localStorage.getItem("theme");
};
const updateTheme = (theme, themeToRemove) => {
	if (themeToRemove) document.documentElement.classList.remove(themeToRemove);
	document.documentElement.classList.add(theme);
	localStorage.setItem("theme", theme);
};
