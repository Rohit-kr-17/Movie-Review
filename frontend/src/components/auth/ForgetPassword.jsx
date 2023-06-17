import React, { useState } from "react";
import Container from "../Container";
import FormInput from "../form/FormInput";
import CustomLink from "../CustomLink";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/FormContainer";
import { commonMdalClasses } from "../../utils/Theme";
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from "../../utils/helper";
import { useNotification } from "../../hooks";
export default function ForgetPassword() {
	const { updateNotification } = useNotification();
	const [email, setEmail] = useState("");
	const handleChange = ({ target }) => {
		const { value } = target;
		setEmail(value);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isValidEmail(email))
			return updateNotification("error", "Invaliddd Email");
		const { error, message } = await forgetPassword(email);
		if (error) return updateNotification("error", error);
		return updateNotification("success", message);
	};
	return (
		<FormContainer>
			<Container>
				<form onSubmit={handleSubmit} className={commonMdalClasses + " w-96"}>
					<Title>Please Enter Your Email</Title>
					<FormInput
						onChange={handleChange}
						value={email}
						label="Email"
						placeholder="John@email.com"
						name="email"
					/>
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
