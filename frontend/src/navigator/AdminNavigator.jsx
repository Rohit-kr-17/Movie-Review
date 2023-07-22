import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "../components/user/NotFound";
import Actors from "../Admin/Actors";
import Movies from "../Admin/Movies";
import Dashboard from "../Admin/Dashboard";
import Navbar from "../Admin/Navbar";
import Header from "../Admin/Header";

export default function AdminNavigator() {
	return (
		<div className="flex dark:bg-primary bg-white">
			<Navbar />
			<div className="flex-1 p-2 max-w-screen-sl">
				<Header onAddMovieClick={() => console.log("Hello")} />
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/movies" element={<Movies />} />
					<Route path="/actors" element={<Actors />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</div>
	);
}
