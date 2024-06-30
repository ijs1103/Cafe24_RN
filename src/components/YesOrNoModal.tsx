import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
	title: string;
	yesHandler: () => void;
	noHandler: () => void;
	isVisible: boolean;
}

export const YesOrNoModal: React.FC<Props> = ({ title, yesHandler, noHandler, isVisible }) => {
	return (
		<Modal
			isVisible={isVisible}
			backdropOpacity={0.5}
		>
			<View style={styles.container}>
				<Text style={styles.titleText}>{title}</Text>
				<View style={styles.hStack}>
					<TouchableOpacity onPress={yesHandler}>
						<Text style={styles.yesButtonText}>예</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={noHandler}>
						<Text style={styles.noButtonText}>아니오</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 20,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		marginHorizontal: 50,
		gap: 20,
		borderRadius: 16
	},
	titleText: {
		fontSize: 20,
		color: '#111',
		textAlign: 'center',
		fontWeight: '600'
	},
	hStack: {
		paddingHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	yesButtonText: {
		color: 'dimgray',
		fontSize: 20,
		fontWeight: '600'
	},
	noButtonText: {
		color: 'crimson',
		fontSize: 20,
		fontWeight: '600'
	}
})