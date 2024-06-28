import React from 'react';
import { Image, StyleSheet, View, Text, Touchable, TouchableOpacity } from 'react-native';
import { ReviewWithUser, User } from '../../utils/Types';
import { Typography } from '../Typography';
import { Spacer } from '../Spacer';
import { formatTimestamp } from '../../utils/Utils';
import { ReviewStars } from '../ReviewStars';

interface Props {
	review: ReviewWithUser;
	imagePressHandler: () => void;
}

export const ReviewItem: React.FC<Props> = ({ review, imagePressHandler }) => {
	return (
		<View style={styles.container}>
			<View style={styles.hStack}>
				<Image style={styles.avatar} resizeMode="cover" source={review.userProfileUrl ? { uri: review.userProfileUrl } : require('../../../assets/no_avatar.jpg')} />
				<View style={styles.vStack}>
					<ReviewStars count={review.rating} />
					<Typography fontSize={12} fontWeight='800'>{review.userName}</Typography>
				</View>
			</View>
			<Spacer space={10} />
			<TouchableOpacity onPress={imagePressHandler}>
				<Image style={styles.cafeImage} source={review.reviewPhotoUrls.length > 0 ? { uri: review.reviewPhotoUrls[0] } : require('../../../assets/no_avatar.jpg')} />
			</TouchableOpacity>
			<Spacer space={10} />
			<Typography fontSize={16} fontWeight='600'>{review.comment}</Typography>
			<Text style={styles.date}>{formatTimestamp(review.createdAt)}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		flex: 1,
		gap: 10
	},
	hStack: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12
	},
	vStack: {
		gap: 4
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
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
})

