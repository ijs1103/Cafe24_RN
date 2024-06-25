import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '../Typography';

export const MyPageItem: React.FC<{ title: string; onPress: () => void }> = ({ title, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.container}>
			<Typography fontWeight="600" fontSize={14} color='saddlebrown'>{title}</Typography>
			<Icon name='chevron-forward' size={18} color={'gray'} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingVertical: 12,
		paddingLeft: 20,
		paddingRight: 10
	}
})
