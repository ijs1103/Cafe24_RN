import Icon from 'react-native-vector-icons/Ionicons'
import { Typography } from './Typography';
import { StyleSheet, View } from 'react-native';

export const ListEmptyComponent: React.FC<{ text: string }> = ({ text }) => {
	return (
		<View style={styles.container}>
			<Icon color='#777' name='alert-circle-outline' size={44} />
			<Typography color='dimgray' fontWeight='800' fontSize={18}>{text}</Typography>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 6
	}
});