import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { Spacer } from '../Spacer';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const SearchBarHeader: React.FC<{
	onPress: () => void;
}> = ({ onPress }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.searchBar} onPress={onPress}>
				<Icon name="search" size={20} color={'black'} />
				<Spacer horizontal space={10} />
				<Typography fontSize={16}>내 주변 카페를 검색해보세요.</Typography>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		backgroundColor: '#11111100',
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 0.3,
		borderBottomColor: '#888',
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'lightgray',
		height: 40,
		width: '90%',
		borderRadius: 10,
		paddingHorizontal: 20,
	}
});