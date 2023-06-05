import React from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { commonMdalClasses } from "../../utils/Theme";
import FormContainer from "../form/FormContainer";

function Signup() {
	return (
		<FormContainer>
			<Container>
				<form className={commonMdalClasses + " w-72"}>
					<Title>Sign Up</Title>
					<FormInput label="Name" placeholder="John Doe" name="name" />
					<FormInput label="Email" placeholder="John@email.com" name="email" />
					<FormInput label="Password" placeholder="********" name="password" />
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
