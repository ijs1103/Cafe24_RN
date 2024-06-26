import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ProfileImageView } from '../components/ProfileImageView';
import FormInput from '../components/FormInput';
import { KeyboardAvoidingLayout } from '../components/KeyboardAvoidingLayout';
import { useForm } from 'react-hook-form';
import { SubmitButton } from '../components/SubmitButton';
import { useAuth } from '../providers/AuthProvider';
import { Header } from '../components/header/Header';
import { useMyStackNavigation } from '../navigation/RootNavigation';
import ImagePicker from 'react-native-image-crop-picker';
import { useToastMessage } from '../providers/ToastMessageProvider';
import { useFirebase } from '../hooks/useFirebase';

interface IEditProfileForm {
	NAME: string;
}

export const EditProfileScreen = () => {
	const navigation = useMyStackNavigation();
	const { user } = useAuth();
	const { showToastMessage } = useToastMessage();
	const { processingFirebase, updateUserName, updateProfileImage } = useFirebase();
	const [uri, setUri] = useState(user?.profileUrl);
	const [isUriChanged, setIsUriChanged] = useState(false);
	const { formState: { errors, isValid: isFormValid }, handleSubmit, control, setValue, clearErrors } =
		useForm<IEditProfileForm>({ mode: 'onChange' });

	const goBackHandler = () => {
		navigation.goBack()
	};

	const onValid = async ({ NAME }: IEditProfileForm) => {
		if (!user?.userId) {
			return
		}
		// 프로필 이미지, 이름 모두 변경되지 않은경우
		if (!isUriChanged && NAME === user?.name) {
			showToastMessage('프로필을 수정하세요.')
			return
		}
		try {
			//1. 이미지를 stroge에 업로드 및 store에 url 저장 
			if (isUriChanged && uri) {
				await updateProfileImage(user.userId, uri)
			}
			//2. 이름 변경
			await updateUserName(user.userId, NAME)
			showToastMessage('프로필을 변경하였습니다.', goBackHandler)
		} catch (error) {
			showToastMessage('알 수 없는 이유로 변경에 실패하였습니다.')
		}
	};

	const onClear = useCallback((name: string) => {
		setValue(name as keyof IEditProfileForm, '')
		clearErrors(name as keyof IEditProfileForm)
	}, []);

	const openImagePicker = async () => {
		try {
			const croppedImage = await ImagePicker.openPicker({
				width: 100,
				height: 100,
				cropping: true
			})
			setUri(croppedImage.path)
			setIsUriChanged(true)
		} catch {
			showToastMessage('이미지를 선택해주세요.')
		}
	};

	useEffect(() => {
		if (user?.name) {
			setValue('NAME', user.name)
		}
	}, [user]);

	return (
		<KeyboardAvoidingLayout>
			<View style={styles.container}>
				<Header goBackHandler={goBackHandler} noBorderLine />
				<View style={styles.subContainer}>
					<TouchableOpacity onPress={openImagePicker}>
						<ProfileImageView uri={uri} editMode />
					</TouchableOpacity>
					<FormInput
						name='NAME'
						errorMsg={errors.NAME?.message}
						control={control}
						textInputConfig={{
							placeholder: '이름은 최대 12자까지 입력.',
						}}
						onClear={onClear}
					/>
				</View>
				<SubmitButton title='저장' onPress={handleSubmit(onValid)} disabled={!isFormValid} isLoading={processingFirebase} />
			</View>
		</KeyboardAvoidingLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		padding: 16,
	},
	subContainer: {
		flex: 1,
	}
})

