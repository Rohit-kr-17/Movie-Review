import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonMdalClasses } from "../../utils/Theme";
import FormContainer from "../form/FormContainer";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";

const validateUserInfo = ({ name, email, password }) => {
	if (!name.trim()) return { ok: false, error: "Name is missing!" };
	if (!/^[a-z A-Z]+$/.test(name)) return { ok: false, error: "Invalid name" };
	if (!email.trim()) return { ok: false, error: "Email is missing!" };
	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
		return { ok: false, error: "Invalid email" };
	if (!password.trim()) return { ok: false, error: "Password is missing" };
	if (password.length < 8)
		return { ok: false, error: "Password must be 8 charcter long" };

	return { ok: true };
};

function Signup() {
	const navigate = useNavigate();
	const { updateNotification } = useNotification();
	const { authInfo } = useAuth();
	const { isLoggedIn } = authInfo;
	const [userInfo, setUserInfo] = useState({
		name: "",
		email: "",
		password: "",
	});
	const handleChange = ({ target }) => {
		const { value, name } = target;
		setUserInfo({ ...userInfo, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const { ok, error } = validateUserInfo(userInfo);
		if (!ok) return updateNotification("error", error);
		const response = await createUser(userInfo);
		if (response.error) return updateNotification(response.error);
		navigate("/auth/verification", {
			state: { user: response.user },
			replace: true,
		});
	};
	useEffect(() => {
		if (isLoggedIn) navigate("/");
	}, [isLoggedIn]);
	const { name, email, password } = userInfo;
	return (
		<FormContainer>
			<Container>
				<form onSubmit={handleSubmit} className={commonMdalClasses + " w-72"}>
					<Title>Sign Up</Title>
					<FormInput
						value={name}
						onChange={handleChange}
						label="Name"
						placeholder="John Doe"
						name="name"
					/>
					<FormInput
						value={email}
						onChange={handleChange}
						label="Email"
						placeholder="John@email.com"
						name="email"
					/>
					<FormInput
						value={password}
						onChange={handleChange}
						label="Password"
						placeholder="********"
						name="password"
						type="password"
					/>
					<Submit value="Sign up" />
					<div className="flex justify-between">
						<CustomLink to="/auth/forget-password">Forget password</CustomLink>
						<CustomLink to="/auth/signin">Sign In</CustomLink>
					</div>
				</form>
			</Container>
		</FormContainer>
	);
}

export default Signup;
