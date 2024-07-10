import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput, View, StyleSheet } from "react-native";
import { useMyStackNavigation } from "../navigation/RootNavigation";
import { KeyboardAvoidingLayout } from "../components/KeyboardAvoidingLayout";
import FormInput from "../components/FormInput";
import { SubmitButton } from "../components/SubmitButton";
import { Header } from "../components/header/Header";
import { useGlobalState } from "../providers/GlobalStateProvider";

interface ILoginForm {
	EMAIL: string;
	PASSWORD: string;
}

export const EmailSigninScreen: React.FC = () => {
	const navigation = useMyStackNavigation();
	const { signin, processingSignin, showToastMessage } = useGlobalState();
	const { formState: { errors, isValid }, handleSubmit, control, setValue, clearErrors } =
		useForm<ILoginForm>({ mode: 'onChange' });
	const passwordRef = useRef<TextInput>(null);

	const goBackHandler = () => {
		navigation.goBack();
	};

	const onValid = async ({ EMAIL, PASSWORD }: ILoginForm) => {
		try {
			await signin(EMAIL, PASSWORD)
			showToastMessage('로그인에 성공하였습니다.', goBackHandler)
		} catch (error) {
			showToastMessage('로그인에 실패하였습니다.')
		}
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