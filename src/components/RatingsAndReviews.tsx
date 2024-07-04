import { StyleSheet, View } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { Spacer } from "./Spacer"
import { Typography } from "./Typography"

interface Props {
	ratings: number;
	reviewsCount: number;
	small?: boolean;
}

export const RatingsAndReviews: React.FC<Props> = ({ ratings, reviewsCount, small }) => {
	return (
		<View style={styles.hStack}>
			<View style={styles.hStack}>
				<Icon name='star-sharp' size={small ? 12 : 16} color='crimson' />
				<Typography fontSize={small ? 12 : 16} color='dimgray' fontWeight='600'>{`${ratings}`}</Typography>
			</View>
			<Spacer horizontal={true} space={4} />
			<Typography fontSize={small ? 12 : 16} color='darkgray'>•</Typography>
			<Spacer horizontal={true} space={4} />
			<Typography fontSize={small ? 12 : 16} color='dimgray' fontWeight='600'>{`리뷰 ${reviewsCount}개`}</Typography>
		</View>
	)
}

const styles = StyleSheet.create({
	hStack: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});