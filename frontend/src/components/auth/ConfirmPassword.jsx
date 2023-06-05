import React from "react";
import Container from "../Container";
import FormInput from "../form/FormInput";
import CustomLink from "../CustomLink";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/FormContainer";
import { commonMdalClasses } from "../../utils/Theme";

export default function ConfirmPassword() {
	return (
		<FormContainer>
			<Container>
				<form className={commonMdalClasses + " w-96"}>
					<Title>Enter new password</Title>
					<FormInput
						label="New Password"
						placeholder="********"
						name="password"
						type="password"
					/>
					<FormInput
						label="Confirm Password"
						placeholder="********"
						name="confirmPassword"
						type="password"
					/>
					<Submit value="Reset Password" />
				</form>
			</Container>
		</FormContainer>
	);
}
