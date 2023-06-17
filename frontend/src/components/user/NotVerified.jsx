import React from "react";
import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import Container from "../Container";

export default function NotVerified() {
	const { authInfo } = useAuth();
	console.log(authInfo);

	const navigate = useNavigate();
	const navigateToVerification = () => {
		navigate("/auth/verification", { state: { user: authInfo.profile } });
	};
	return (
		<Container>
			{authInfo.isLoggedIn && !authInfo.profile.isVerified ? (
				<p className="text-lg text-center bg-blue-50 p-2 ">
					It looks like you haven't verified your account,{" "}
					<button
						onClick={navigateToVerification}
						className="text-blue-500 font-semibold hover:underline"
					>
						Click here to verify your account
					</button>
				</p>
			) : null}
		</Container>
	);
}
