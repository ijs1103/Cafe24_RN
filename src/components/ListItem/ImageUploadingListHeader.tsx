import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
	pressHandler: () => void;
}

export const ImageUploadingListHeader: React.FC<Props> = ({ pressHandler }) => {
	return (
		<TouchableOpacity onPress={pressHandler} style={styles.container}>
			<Icon name='camera-plus' size={24} color='gray' />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 0.5,
		borderColor: 'gray',
		borderRadius: 8,
		width: 100,
		height: 100,
		backgroundColor: '#fff',
		marginRight: 16
	}
})