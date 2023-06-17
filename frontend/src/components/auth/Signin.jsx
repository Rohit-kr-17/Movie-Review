import React, { useContext, useEffect, useState } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import ThemeContext from "../../context/ThemeProvider";
import { useAuth, useTheme } from "../../hooks";
import { commonMdalClasses } from "../../utils/Theme";
import { useNotification } from "../../hooks";
import FormContainer from "../form/FormContainer";
import { Navigate, useNavigate } from "react-router-dom";

const validateUserInfo = ({ email, password }) => {
	if (!email.trim()) return { ok: false, error: "Email is missing!" };
	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
		return { ok: false, error: "Invalid email" };
	if (!password.trim()) return { ok: false, error: "Password is missing" };
	if (password.length < 8)
		return { ok: false, error: "Password must be 8 charcter long" };

	return { ok: true };
};

function Signin() {
	const navigate = useNavigate();
	const { updateNotification } = useNotification();
	const { handleLogin, authInfo } = useAuth();
	const { isPending, isLoggedIn } = authInfo;
	console.log(authInfo);
	const [userInfo, setUserInfo] = useState({
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
		handleLogin(userInfo.email, userInfo.password);
	};
	useEffect(() => {
		if (isLoggedIn) navigate("/");
	}, [isLoggedIn]);
	return (
		<FormContainer>
			<Container>
				<form onSubmit={handleSubmit} className={commonMdalClasses + " w-72"}>
					<Title>Sign In</Title>
					<FormInput
						onChange={handleChange}
						value={userInfo.email}
						label="Email"
						placeholder="John@email.com"
						name="email"
					/>
					<FormInput
						onChange={handleChange}
						value={userInfo.password}
						label="Password"
						placeholder="********"
						name="password"
						type="password"
					/>
					<Submit value="Sign in" busy={isPending} />
					<div className="flex justify-between">
						<CustomLink to="/auth/forget-password">Forget password</CustomLink>
						<CustomLink to="/auth/signup">Sign Up</CustomLink>
					</div>
				</form>
			</Container>
		</FormContainer>
	);
}

export default Signin;
