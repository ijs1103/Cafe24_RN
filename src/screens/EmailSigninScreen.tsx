import { route } from "next/dist/server/router";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput, Alert, View, StyleSheet } from "react-native";
import { useMyStackNavigation } from "../navigation/RootNavigation";
import { KeyboardAvoidingLayout } from "../components/KeyboardAvoidingLayout";
import FormInput from "../components/FormInput";
import { Spacer } from "../components/Spacer";
import { Division } from "../components/Division";
import { SubmitButton } from "../components/SubmitButton";
import { Header } from "../components/header/Header";
import { AuthContext } from "../auth/AuthContext";

interface ILoginForm {
	EMAIL: string;
	PASSWORD: string;
}

export const EmailSigninScreen: React.FC = () => {
	const navigation = useMyStackNavigation();
	const { signin, processingSignin } = useContext(AuthContext);
	const { formState: { errors, isValid }, handleSubmit, control, setValue, clearErrors } =
		useForm<ILoginForm>({ mode: 'onChange' });
	const passwordRef = useRef<TextInput>(null);

	const goBackHandler = () => {
		navigation.goBack();
	};

	const onValid = async ({ EMAIL, PASSWORD }: ILoginForm) => {
		await signin(EMAIL, PASSWORD)
		goBackHandler()
	};

	const onClear = useCallback((name: string) => {
		setValue(name as keyof ILoginForm, '')
		clearErrors(name as keyof ILoginForm)
	}, []);

	return (
		<KeyboardAvoidingLayout>
			<View style={styles.container}>
				<Header goBackHandler={goBackHandler} noBorderLine />
				<View style={styles.formContainer}>
					<View>
						<FormInput
							name="EMAIL"
							errorMsg={errors.EMAIL?.message}
							control={control}
							textInputConfig={{
								keyboardType: 'email-address',
								placeholder: 'abcde@naver.com',
							}}
							onClear={onClear}
							onNext={() => passwordRef.current?.focus()}
						/>
						<FormInput
							name="PASSWORD"
							errorMsg={errors.PASSWORD?.message}
							control={control}
							textInputConfig={{
								placeholder: '********',
								secureTextEntry: true,
							}}
							inputRef={passwordRef}
							onClear={onClear}
						/>
					</View>
					<SubmitButton
						isLoading={processingSignin}
						title="로그인"
						onPress={handleSubmit(onValid)}
						disabled={!isValid}
					/>
				</View>
			</View>
		</KeyboardAvoidingLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1, backgroundColor: 'antiquewhite'
	},
	formContainer: {
		flex: 1, justifyContent: 'space-between', padding: 20
	},
});