import { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from 'react-redux';
import {
	createUserDocumentFromAuth,
	signInWithGooglePopup,
} from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";

import { DivSignUpContainer, DivButtonsContainer } from "./sign-in-form.styles";
import { emailSignInStart } from "../../store/user/user.action";

const defaultFormFilelds = {
	email: "",
	password: "",
};

const SigninForm = () => {
	const [formFields, setFormFields] = useState(defaultFormFilelds);
	const { email, password } = formFields;

	const dispatch = useDispatch();

	const resetFormFields = () => {
		setFormFields(defaultFormFilelds);
	};

	const signInWithGoogle = async () => {
		const { user } = await signInWithGooglePopup();
		await createUserDocumentFromAuth(user);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			dispatch(emailSignInStart(email, password));

			resetFormFields();
		} catch (error) {
			switch (error) {
				case "auth/wrong-password":
					alert("incorrect password for email");
					break;
				case "auth/user-not-found":
					alert("no users with this email");
					break;
				default:
					console.log(error);
			}
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormFields({ ...formFields, [name]: value });
	};

	return (
		<DivSignUpContainer>
			<h2>Already have account</h2>
			<span>Sign in with your email and password</span>
			<form onSubmit={ handleSubmit }>
				<FormInput label="Email" type="email" required onChange={ handleChange } name="email" value={ email } />

				<FormInput
					label="Password"
					type="password"
					required
					onChange={ handleChange }
					name="password"
					value={ password }
				/>

				<DivButtonsContainer>
					<Button type="submit">Sign In</Button>
					<Button type="button" buttonType={ BUTTON_TYPE_CLASSES.google } onClick={ signInWithGoogle }>
						Google sign in
					</Button>
				</DivButtonsContainer>
			</form>
		</DivSignUpContainer>
	);
};

export default SigninForm;