import { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Division } from '../components/Division';
import { ReviewItem } from '../components/ListItem/ReviewItem';
import { ImageViewResourceType } from '../utils/Types';
import { useMainStackNavigation, useMainStackRoute } from '../navigation/RootNavigation';
import { FullScreenImageSlider } from '../components/FullScreenImageSlider';
import { CafeDetailListHeader } from '../components/ListItem/CafeDetailListHeader';
import { ListEmptyComponent } from '../components/ListEmptyComponent';
import { useFirebase } from '../hooks/useFirebase';
import { useGlobalState } from '../providers/GlobalStateProvider';
import { YesOrNoModal } from '../components/YesOrNoModal';
import { LoadingView } from '../components/LoadingView';
import { useFocusEffect } from '@react-navigation/native';

export const CafeDetailScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'CafeDetail'>();
	const routes = useMainStackRoute<'CafeDetail'>();
	const { user, showToastMessage } = useGlobalState();
	const { getCafeReviewsWithUser, getCafeRatingsAverage, resetCafeReviewsData, processingFirebase, setProcessingFirebase, deleteReview, cafeReviews, cafeRatings, isMyReviewExisting } = useFirebase()
	const [imageSliderVisible, setImageSliderVisible] = useState(false);
	const [selectedPhotoUrls, setSelectedPhotoUrls] = useState<ImageViewResourceType[]>([]);
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);

	const goBackHandler = useCallback(() => {
		navigation.goBack();
	}, []);

	const imagePressHandler = useCallback((photoUrls: string[]) => {
		setSelectedPhotoUrls(photoUrls.map(value => { return { uri: value } }))
		setImageSliderVisible(true)
	}, []);

	const reviewWriteHandler = useCallback(async () => {
		if (!user) {
			showToastMessage('로그인 해주세요.')
			return
		}
		if (!routes.params.cafe) {
			return
		}
		const myReviewExisting = await isMyReviewExisting(routes.params.cafe.id, user.userId)
		if (myReviewExisting) {
			showToastMessage('이미 작성한 리뷰가 존재합니다.')
		} else {
			navigation.navigate('WriteReview', { cafe: routes.params.cafe })
		}
	}, []);

	const isMyReview = useCallback((reviewerId: string): boolean => {
		return (reviewerId == user?.userId)
	}, []);

	const deleteButtonPressHandler = useCallback(() => {
		setModalVisible(true)
	}, []);

	const reviewDeleteHandler = useCallback(async () => {
		try {
			const cafeId = routes.params.cafe?.id
			if (user?.userId && cafeId) {
				setModalVisible(false)
				await deleteReview(user.userId, cafeId)
				showToastMessage('리뷰를 삭제하였습니다.', onRefresh)
			}
		} catch {
			setModalVisible(false)
			showToastMessage('리뷰 삭제에 실패하였습니다.')
		}
	}, []);

	const onEndReached = useCallback(async () => {
		if (routes.params.cafe?.id && !isFirstLoad) {
			setProcessingFirebase(true)
			await getCafeReviewsWithUser(routes.params.cafe.id)
			setProcessingFirebase(false)
		}
	}, []);

	const onRefresh = useCallback(async () => {
		if (routes.params.cafe?.id) {
			setProcessingFirebase(true)
			resetCafeReviewsData()
			await getCafeReviewsWithUser(routes.params.cafe.id)
			await getCafeRatingsAverage(routes.params.cafe.id)
			setProcessingFirebase(false)
		}
	}, []);

	useEffect(() => {
		setIsFirstLoad(false)
	}, []);

	useFocusEffect(
		useCallback(() => {
			onRefresh();
		}, [])
	);

	if (processingFirebase) {
		return <LoadingView />
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={cafeReviews}
				keyExtractor={(item) => item.reviewId}
				renderItem={({ item }) => <ReviewItem review={item} imagePressHandler={() => imagePressHandler(item.reviewPhotoUrls)} isMyReview={isMyReview(item.userId)} deleteButtonPressHandler={deleteButtonPressHandler} />}
				ItemSeparatorComponent={() => <Division />}
				ListHeaderComponent={() => <CafeDetailListHeader
					goBackHandler={goBackHandler}
					cafeName={routes.params.cafe?.place_name ?? '알 수 없음'}
					cafeRatings={cafeRatings}
					reviewsCount={cafeReviews?.length ?? 0}
					reviewWriteHandler={reviewWriteHandler} />}
				contentContainerStyle={{ paddingBottom: 10 }}
				ListEmptyComponent={() => <View style={styles.emptyViewContainer}><ListEmptyComponent text='리뷰가 없습니다.' /></View>}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
				refreshing={processingFirebase}
				onRefresh={onRefresh}
			/>
			<FullScreenImageSlider
				photoUrls={selectedPhotoUrls}
				visible={imageSliderVisible}
				onRequestClose={() => setImageSliderVisible(false)}
			/>
			<YesOrNoModal title='정말로 삭제하시겠습니까?' yesHandler={reviewDeleteHandler} noHandler={() => setModalVisible(false)} isVisible={modalVisible} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	emptyViewContainer: {
		marginTop: 160
	}
})
