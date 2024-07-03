import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Review } from '../../utils/Types';
import { formatTimestamp } from '../../utils/Utils';
import { ReviewStars } from '../ReviewStars';
import { Spacer } from '../Spacer';
import { Typography } from '../Typography';

interface Props {
	review: Review;
	imagePressHandler: () => void;
}

export const MyReviewItem: React.FC<Props> = ({ review, imagePressHandler }) => {
	return (
		<View style={styles.container}>
			<ReviewStars count={review.rating} bigSize />
			<Spacer space={10} />
			{review.reviewPhotoUrls.length > 0 && <><TouchableOpacity onPress={imagePressHandler}>
				<Image style={styles.cafeImage} source={{ uri: review.reviewPhotoUrls[0] }} />
			</TouchableOpacity>
				<Spacer space={10} /></>}
			<Typography fontSize={16} fontWeight='600'>{review.comment}</Typography>
			<Text style={styles.date}>{formatTimestamp(review.createdAt)}</Text>
		</View >
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		flex: 1,
		gap: 10,
	},
	cafeImage: {
		width: '60%',
		height: 200,
		borderRadius: 10
	},
	date: {
		textAlign: 'right',
		fontSize: 12,
		color: 'gray',
		fontWeight: '600'
	}
});