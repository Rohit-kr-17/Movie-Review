import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../Container";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/FormContainer";
import { commonMdalClasses } from "../../utils/Theme";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";

export default function ConfirmPassword() {
	const [isVerifying, setIsVerifying] = useState(false);
	const [password, setPassword] = useState({
		One: "",
		Two: "",
	});
	const [isValid, setIsValid] = useState(false);
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");
	const id = searchParams.get("id");
	// isValid, !isValid
	const navigate = useNavigate();
	const { updateNotification } = useNotification();
	useEffect(() => {
		isValidToken();
	}, []);

	const isValidToken = async () => {
		const { error, valid } = await verifyPasswordResetToken(token, id);
		setIsVerifying(false);
		if (error) {
			console.log(error);
			navigate("/auth/reset-password", { replace: true });
			return updateNotification("error", "Invalid Token");
		}

		if (!valid) {
			setIsValid(false);
			return navigate("/auth/reset-password", { replace: true });
		}

		setIsValid(true);
	};
	const handleChange = ({ target }) => {
		const { name, value } = target;
		setPassword({ ...password, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password.One.trim().length < 8)
			return updateNotification("error", "password must be 8 char long");
		if (password.One !== password.Two)
			return updateNotification("error", "Password do not match");
		const { error, message } = await resetPassword({
			newPassword: password.One,
			userId: id,
			token,
		});
		if (error) {
			return updateNotification("error", error);
		}
		updateNotification("success", message);
		navigate("/auth/signin", { replace: true });
	};

	if (isVerifying)
		return (
			<FormContainer>
				<Container>
					<div className="flex space-x-2 items-center">
						<h1 className="text-4xl font-semibold dark:text-white text-primary">
							Please wait we are verifying your token!
						</h1>
						<ImSpinner3 className="animate-spin text-4xl dark:text-white text-primary" />
					</div>
				</Container>
			</FormContainer>
		);

	if (!isValid)
		return (
			<FormContainer>
				<Container>
					<h1 className="text-4xl font-semibold dark:text-white text-primary">
						Sorry the token is invalid!
					</h1>
				</Container>
			</FormContainer>
		);

	return (
		<FormContainer>
			<Container>
				<form onSubmit={handleSubmit} className={commonMdalClasses + " w-96"}>
					<Title>Enter New Password</Title>
					<FormInput
						value={password.One}
						onChange={handleChange}
						label="New Password"
						placeholder="********"
						name="One"
						type="password"
					/>
					<FormInput
						value={password.Two}
						onChange={handleChange}
						label="Confirm Password"
						placeholder="********"
						name="Two"
						type="password"
					/>
					<Submit value="Confirm Password" />
				</form>
			</Container>
		</FormContainer>
	);
}
