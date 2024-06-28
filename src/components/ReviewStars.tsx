import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
	count: number;
}

export const ReviewStars: React.FC<Props> = ({ count }) => {
	const stars = Array.from({ length: 5 }, (_, index) => {
		if (index < count) {
			return <Icon key={index} name='star' color={'red'} size={16} />;
		} else {
			return <Icon key={index} name='star' color={'gray'} size={16} />;
		}
	});

	return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: 2
	}
})

