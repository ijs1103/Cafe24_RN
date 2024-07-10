import { FlatList, StyleSheet, View } from 'react-native';
import { BackButtonTitleHeader } from '../components/header/BackButtonTitleHeader';
import { useMyStackNavigation } from '../navigation/RootNavigation';
import { useCallback, useEffect, useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { Division } from '../components/Division';
import { ListEmptyComponent } from '../components/ListEmptyComponent';
import { MyReviewItem } from '../components/ListItem/MyReviewItem';
import { ImageViewResourceType } from '../utils/Types';
import { FullScreenImageSlider } from '../components/FullScreenImageSlider';

export const MyReviewScreen: React.FC = () => {
	const navigation = useMyStackNavigation<'MyReview'>();
	const { getMyReviews, myReviews, resetMyReviewsData, processingFirebase } = useFirebase();
	const [imageSliderVisible, setImageSliderVisible] = useState(false);
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [selectedPhotoUrls, setSelectedPhotoUrls] = useState<ImageViewResourceType[]>([]);

	const goBackHandler = useCallback(() => {
		navigation.goBack();
	}, []);

	const imagePressHandler = useCallback((photoUrls: string[]) => {
		setSelectedPhotoUrls(photoUrls.map(value => { return { uri: value } }))
		setImageSliderVisible(true)
	}, []);

	const onEndReached = useCallback(() => {
		if (!isFirstLoad) {
			getMyReviews();
		}
	}, []);

	const onRefresh = useCallback(() => {
		resetMyReviewsData();
		getMyReviews();
	}, []);

	useEffect(() => {
		setIsFirstLoad(false);
		getMyReviews();
	}, []);

	return (
		<View style={styles.container}>
			<BackButtonTitleHeader goBackHandler={goBackHandler} title={'작성한 리뷰'} />
			<View style={styles.subContainer}>
				<FlatList
					data={myReviews}
					keyExtractor={(item) => item.reviewId}
					renderItem={({ item }) => <MyReviewItem review={item} imagePressHandler={() => imagePressHandler(item.reviewPhotoUrls)} />}
					ItemSeparatorComponent={() => <Division />}
					contentContainerStyle={styles.contentContainer}
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
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	subContainer: {
		flex: 1,
	},
	emptyViewContainer: {
		marginTop: 160
	},
	contentContainer: {
		paddingBottom: 10
	}
})