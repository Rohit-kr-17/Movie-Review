import React, { useContext } from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import ThemeContext from "../../context/ThemeProvider";
import { useTheme } from "../../hooks";
import { commonMdalClasses } from "../../utils/Theme";
import FormContainer from "../form/FormContainer";
function Signin() {
	return (
		<FormContainer>
			<Container>
				<form className={commonMdalClasses + " w-72"}>
					<Title>Sign In</Title>
					<FormInput label="Email" placeholder="John@email.com" name="email" />
					<FormInput label="Password" placeholder="********" name="password" />
					<Submit value="Sign in" />
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
