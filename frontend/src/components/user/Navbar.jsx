import React from "react";

function Navbar() {
	return (
		<div className="bg-secondary">
			<div className=" mx-auto p-2 max-w-screen-xl">
				<div className="flex justify-between items-center">
					<img className="h-10 " src="./logo.png" alt="" />
					<ul>
						<li>Login</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
