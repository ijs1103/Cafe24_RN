import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Spacer } from '../Spacer';

interface Props {
	goBackHandler: () => void;
	title: string;
}

export const BackButtonTitleHeader: React.FC<Props> = ({ goBackHandler, title }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={goBackHandler}>
				<Icon name='chevron-back' size={30} color={'#111'} />
			</TouchableOpacity>
			<Text style={styles.title}>{title}</Text>
			<Spacer space={1} horizontal />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		padding: 10
	},
	title: {
		color: '#111',
		fontSize: 20,
		fontWeight: '800'
	}
})
