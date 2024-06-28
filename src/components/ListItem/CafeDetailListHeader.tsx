import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Header } from '../header/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { Division } from '../Division';
import { RatingsAndReviews } from '../RatingsAndReviews';
import { Spacer } from '../Spacer';
import { Typography } from '../Typography';

interface Props {
	goBackHandler: () => void;
	cafeName: string;
	cafeRatings: number;
	reviewsCount: number;
	reviewWriteHandler: () => void;
}

export const CafeDetailListHeader: React.FC<Props> = ({ goBackHandler, cafeName, cafeRatings, reviewsCount, reviewWriteHandler }) => {
	return (
		<>
			<Header goBackHandler={goBackHandler} noBorderLine />
			<View style={styles.headerSubContainer}>
				<Typography fontSize={24} fontWeight='800' color='rebeccapurple' numberOfLines={2}>{cafeName}</Typography>
				<Spacer space={10} />
				<RatingsAndReviews ratings={cafeRatings} reviewsCount={reviewsCount} />
				<Spacer space={10} />
				<Division />
				<Spacer space={20} />
				<View style={styles.hStack}>
					<Typography fontSize={20} fontWeight='700'>리뷰</Typography>
					<TouchableOpacity onPress={reviewWriteHandler} style={styles.reviewButton}>
						<Icon name='pencil' size={14} color={'blue'} />
						<Typography fontSize={14} fontWeight='600' color='blue'>리뷰 쓰기</Typography>
					</TouchableOpacity>
				</View>
			</View>
		</>
	)
};

const styles = StyleSheet.create({
	headerSubContainer: {
		paddingHorizontal: 20
	},
	hStack: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	reviewButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2
	}
})