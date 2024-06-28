import { useState, useCallback } from 'react';
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

export const CafeDetailScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'CafeDetail'>();
	const routes = useMainStackRoute<'CafeDetail'>();
	const [imageSliderVisible, setImageSliderVisible] = useState(false);
	const [selectedPhotoUrls, setSelectedPhotoUrls] = useState<ImageViewResourceType[]>([]);

	const goBackHandler = useCallback(() => {
		navigation.goBack();
	}, []);

	const imagePressHandler = useCallback((photoUrls: string[]) => {
		setSelectedPhotoUrls(photoUrls.map(value => { return { uri: value } }))
		setImageSliderVisible(true)
	}, []);

	const reviewWriteHandler = useCallback(() => {

	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={routes.params.reviews}
				keyExtractor={(item) => item.reviewId}
				renderItem={({ item }) => <ReviewItem review={item} imagePressHandler={() => imagePressHandler(item.reviewPhotoUrls)} />}
				ItemSeparatorComponent={() => <Division />}
				ListHeaderComponent={() => <CafeDetailListHeader
					goBackHandler={goBackHandler}
					cafeName={routes.params.cafe?.place_name ?? '알 수 없음'}
					cafeRatings={routes.params.cafeRatings}
					reviewsCount={routes.params.reviews.length}
					reviewWriteHandler={reviewWriteHandler} />}
				contentContainerStyle={{ paddingBottom: 10 }}
				ListEmptyComponent={<ListEmptyComponent text='리뷰가 없습니다.' />}
			/>
			<FullScreenImageSlider
				photoUrls={selectedPhotoUrls}
				visible={imageSliderVisible}
				onRequestClose={() => setImageSliderVisible(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
})
