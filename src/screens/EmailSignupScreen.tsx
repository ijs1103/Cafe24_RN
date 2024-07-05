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
import { useGlobalState } from "../providers/GlobalStateProvider";

interface ISignupForm {
	EMAIL: string;
	PASSWORD: string;
	PASSWORD_CHECK: string;
	NAME: string;
}

export const EmailSignupScreen: React.FC = () => {
	const navigation = useMyStackNavigation();
	const { emailSignup, processingSignup, showToastMessage } = useGlobalState();
	const { formState: { errors, isValid }, handleSubmit, control, getValues, setValue, clearErrors } =
		useForm<ISignupForm>({ mode: 'onChange' });
	const passwordRef = useRef<TextInput>(null);
	const passwordCheckRef = useRef<TextInput>(null);
	const nameRef = useRef<TextInput>(null);

	const goBackHandler = () => {
		navigation.goBack();
	};

	const onValid = async ({ EMAIL, PASSWORD, NAME }: ISignupForm) => {
		try {
			await emailSignup(EMAIL, PASSWORD, NAME)
			showToastMessage('회원가입에 성공하였습니다.', goBackHandler)
		} catch (error: any) {
			console.log(error)
			if (error.code === 'auth/email-already-in-use') {
				showToastMessage('중복된 이메일입니다.')
			} else {
				showToastMessage('회원가입에 실패하였습니다.')
			}
		}
	};

	const onClear = useCallback((name: string) => {
		setValue(name as keyof ISignupForm, '')
		clearErrors(name as keyof ISignupForm)
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
							onNext={() => passwordCheckRef.current?.focus()}
						/>
						<FormInput
							name="PASSWORD_CHECK"
							errorMsg={errors.PASSWORD_CHECK?.message}
							control={control}
							textInputConfig={{
								placeholder: '********',
								secureTextEntry: true,
							}}
							passwordVal={getValues('PASSWORD')}
							inputRef={passwordCheckRef}
							onNext={() => nameRef.current?.focus()}
							onClear={onClear}
						/>
						<FormInput
							name="NAME"
							errorMsg={errors.NAME?.message}
							control={control}
							textInputConfig={{
								placeholder: '이름은 최대 12자까지 입력.',
							}}
							inputRef={nameRef}
							onClear={onClear}
						/>
					</View>
					<SubmitButton
						isLoading={processingSignup}
						title="회원가입"
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