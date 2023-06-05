import React from "react";
import { Link } from "react-router-dom";
export default function CustomLink({ to, children }) {
	return (
		<Link
			to={to}
			className="dark:text-dark-subtle text-light-subtle dark:hover:text-white transition hover:text-primary"
		>
			{children}
		</Link>
	);
}
