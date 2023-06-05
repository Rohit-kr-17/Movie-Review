import React from "react";
import Container from "../Container";
import FormInput from "../form/FormInput";
import CustomLink from "../CustomLink";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/FormContainer";
import { commonMdalClasses } from "../../utils/Theme";
export default function ForgetPassword() {
	return (
		<FormContainer>
			<Container>
				<form className={commonMdalClasses + " w-96"}>
					<Title>Please Enter Your Email</Title>
					<FormInput label="Email" placeholder="John@email.com" name="email" />
					<Submit value="Send Link" />
					<div className="flex justify-between">
						<CustomLink to="/auth/signin">Sign In</CustomLink>
						<CustomLink to="/auth/signup">Sign Up</CustomLink>
					</div>
				</form>
			</Container>
		</FormContainer>
	);
}
