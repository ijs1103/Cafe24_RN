import { StyleSheet, View, Text } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useMainStackNavigation, useMainStackRoute } from '../navigation/RootNavigation';
import { useCallback, useEffect, useState } from 'react';
import { StarRatingView } from '../components/StarRatingView';
import { KeyboardAvoidingLayout } from '../components/KeyboardAvoidingLayout';
import { LongTextInput } from '../components/LongTextInput';
import { SubmitButton } from '../components/SubmitButton';
import { BackButtonTitleHeader } from '../components/header/BackButtonTitleHeader';
import { ImageUploadingView } from '../components/ImageUploadingView';
import { useFirebase } from '../hooks/useFirebase';
import { useGlobalState } from '../providers/GlobalStateProvider';
import firestore from '@react-native-firebase/firestore';

export const WriteReviewScreen = () => {
	const navigation = useMainStackNavigation<'WriteReview'>();
	const routes = useMainStackRoute<'WriteReview'>();
	const { user, showToastMessage} = useGlobalState();
	const { addReview, uploadAndGetDownloadedUrls, processingFirebase, setProcessingFirebase } = useFirebase();
	const [rating, setRating] = useState(0);
	const [text, setText] = useState('');
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [isFormValid, setIsFormValid] = useState(false);

	const goBackHandler = () => {
		navigation.goBack();
	};

	const openImagePicker = useCallback(async () => {
		try {
			const croppedImages = await ImagePicker.openPicker({
				width: 100,
				height: 100,
				cropping: true,
				multiple: true
			})
			setImageUrls(croppedImages.map(image => image.path))
		} catch {
			showToastMessage('이미지를 선택해주세요.')
		}
	}, []);

	const imageCloseHandler = useCallback((url: string) => {
		setImageUrls(prev => prev.filter(value => value != url))
	}, []);

	const onPressSaveButton = useCallback(async () => {
		try {
			setProcessingFirebase(true)
			if (routes.params.cafe?.id && user?.userId) {
				const cafeId = routes.params.cafe.id
				const userId = user.userId
				const downloadedUrls = await uploadAndGetDownloadedUrls(cafeId, imageUrls)
				await addReview({
					reviewId: `${cafeId}_${userId}`,
					userId,
					cafeId,
					cafeName: routes.params.cafe.place_name,
					rating,
					comment: text,
					reviewPhotoUrls: downloadedUrls,
					createdAt: firestore.Timestamp.now()
				})
			}
			showToastMessage('리뷰를 등록하였습니다.', goBackHandler)
		} catch (error) {
			console.log(error)
			showToastMessage('리뷰 작성에 실패하였습니다.')
		} finally {
			setProcessingFirebase(true)
		}
	}, [routes.params, imageUrls, text]);

	useEffect(() => {
		if (rating > 0 && text.length > 0) {
			setIsFormValid(true)
		}
	}, [rating, text]);

	return (
		<KeyboardAvoidingLayout>
			<View style={styles.container}>
				<BackButtonTitleHeader title='리뷰 작성' goBackHandler={goBackHandler} />
				<View style={styles.subContainer}>
					<View style={styles.formContainer}>
						<Text numberOfLines={2} style={styles.title}>{routes.params.cafe?.place_name ?? '알 수 없음'}</Text>
						<StarRatingView onRatingChange={setRating} />
						<ImageUploadingView label={'카페 사진'} imageUrls={imageUrls} imageCloseHandler={imageCloseHandler} openImagePicker={openImagePicker} />
						<LongTextInput label='리뷰 내용' placeholder='카페에 대한 감상을 남겨주세요' maxLength={50} textChangeHandler={setText} />
					</View>
					<SubmitButton title='저장' onPress={onPressSaveButton} disabled={!isFormValid} isLoading={processingFirebase} />
				</View>
			</View>
		</KeyboardAvoidingLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	subContainer: {
		flex: 1,
		padding: 20,
		justifyContent: 'space-between'
	},
	formContainer: {
		gap: 20
	},
	title: {
		textAlign: 'center',
		fontSize: 24,
		fontWeight: '700',
		color: 'saddlebrown',
	}
})