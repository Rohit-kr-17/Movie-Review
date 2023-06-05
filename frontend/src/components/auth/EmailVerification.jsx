import React, { useEffect, useRef, useState } from "react";
import Container from "../Container";
import Submit from "../form/Submit";
import Title from "../form/Title";
import FormContainer from "../form/FormContainer";
import { commonMdalClasses } from "../../utils/Theme";
const OTP_LENGTH = 6;
let currentOTPIndex;
export default function EmailVerification() {
	const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
	const [activeOtpIndex, setActiveOtpIndex] = useState(0);
	const inputRef = useRef();
	const focusNextInputField = (index) => {
		setActiveOtpIndex(index + 1);
	};
	const focusPrevInputField = (index) => {
		let nexIndex;
		const diff = index - 1;
		nexIndex = diff !== 0 ? diff : 0;
		setActiveOtpIndex(nexIndex);
	};
	const handleOtpChange = ({ target }) => {
		const { value } = target;
		const newOtp = [...otp];
		newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);
		if (!value) focusPrevInputField(currentOTPIndex);
		else focusNextInputField(currentOTPIndex);
		setOtp([...newOtp]);
	};
	const handleKeyDown = ({ key }, index) => {
		currentOTPIndex = index;
		if (key === "Backspace") {
			const newOtp = [...otp];
			newOtp[currentOTPIndex] = "";
			focusPrevInputField(currentOTPIndex);
			setOtp([...newOtp]);
		}
	};
	useEffect(() => {
		inputRef.current?.focus();
	}, [activeOtpIndex]);
	return (
		<FormContainer>
			<Container>
				<form className={commonMdalClasses}>
					<div className="">
						<Title>Please enter The OTP to verify your account</Title>
						<p className="text-center dark:text-dark-subtle text-light-subtle">
							OTP has been sent to your email
						</p>
					</div>
					<div className=" flex justify-center items-center space-x-4">
						{otp.map((_, index) => {
							return (
								<input
									maxLength={1}
									ref={activeOtpIndex === index ? inputRef : null}
									key={index}
									type="number"
									value={otp[index] || ""}
									onKeyDown={(e) => handleKeyDown(e, index)}
									onChange={handleOtpChange}
									className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none "
								/>
							);
						})}
					</div>

					<Submit value="Send Link" />
				</form>
			</Container>
		</FormContainer>
	);
}
