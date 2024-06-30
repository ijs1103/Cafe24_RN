import { useState, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { Division } from '../components/Division';
import { ReviewItem } from '../components/ListItem/ReviewItem';
import { Typography } from '../components/Typography';
import { CafeDTO, Review, ImageViewResourceType } from '../utils/Types';
import { Spacer } from '../components/Spacer';
import { RatingsAndReviews } from '../components/RatingsAndReviews';
import { Header } from '../components/header/Header';
import { useMainStackNavigation, useMainStackRoute } from '../navigation/RootNavigation';
import { FullScreenImageSlider } from './FullScreenImageSlider';
import { CafeDetailListHeader } from '../components/ListItem/CafeDetailListHeader';
import { ListEmptyComponent } from '../components/ListEmptyComponent';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../providers/AuthProvider';
import { YesOrNoModal } from '../components/YesOrNoModal';
import { useToastMessage } from '../providers/ToastMessageProvider';
import { LoadingView } from '../components/LoadingView';

export const CafeDetailScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'CafeDetail'>();
	const routes = useMainStackRoute<'CafeDetail'>();
	const { user } = useAuth()
	const { showToastMessage } = useToastMessage()
	const { getCafeReviewsWithUser, getCafeRatingsAverage, resetCafeReviewsData, processingFirebase, setProcessingFirebase, deleteReview, cafeReviews, cafeRatings } = useFirebase()
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

	const reviewWriteHandler = useCallback(() => {

	}, []);

	const isMyReview = useCallback((reviewerId: string): boolean => {
		return (reviewerId == user?.userId)
	}, []);

	const deleteButtonPressHandler = useCallback(() => {
		setModalVisible(true)
	}, []);

	const reviewDeleteHandler = useCallback(async () => {
		try {
			if (user?.userId && routes.params.cafe?.id) {
				await deleteReview(user.userId, routes.params.cafe.id)
				await getCafeReviewsWithUser(routes.params.cafe.id)
				setModalVisible(false)
				showToastMessage('리뷰를 삭제하였습니다.')
			}
		} catch {
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
			setProcessingFirebase(false)
		}
	}, []);

	useEffect(() => {
		setIsFirstLoad(false)
		const fetchData = async (cafeId: string) => {
			setProcessingFirebase(true)
			await getCafeReviewsWithUser(cafeId)
			await getCafeRatingsAverage(cafeId)
			setProcessingFirebase(false)
		}
		if (routes.params.cafe?.id) {
			fetchData(routes.params.cafe.id)
		}
	}, []);

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
				ListEmptyComponent={<ListEmptyComponent text='리뷰가 없습니다.' />}
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
})
