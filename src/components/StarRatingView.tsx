import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
	onRatingChange: (index: number) => void;
}

export const StarRatingView: React.FC<Props> = ({ onRatingChange }) => {
	const [rating, setRating] = useState(0);

	const handleRatingPress = (index: number) => {
    setRating(index + 1);
    onRatingChange(index + 1);
  };

	return (
		<View style={styles.container}>
			{[1, 2, 3, 4, 5].map((_, index) => (
				<TouchableOpacity key={index} onPress={() => handleRatingPress(index)}>
					<Icon
						name="star"
						size={30}
						color={index < rating ? 'red' : 'gray'}
					/>
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 10
	},
})