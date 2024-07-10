import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
	title: string;
	subTitle?: string;
	yesHandler: () => void;
	noHandler?: () => void;
	isVisible: boolean;
}

export const YesOrNoModal: React.FC<Props> = ({ title, subTitle, yesHandler, noHandler, isVisible }) => {
	return (
		<Modal
			isVisible={isVisible}
			backdropOpacity={0.5}
		>
			<View style={styles.container}>
				<Text style={styles.title}>{title}</Text>
				{subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
				<View style={[styles.hStack, { justifyContent: noHandler ? 'space-between' : 'center' }]}>
					<TouchableOpacity onPress={yesHandler}>
						<Text style={styles.yesButtonText}>{noHandler ? '예' : '확인'}</Text>
					</TouchableOpacity>
					{noHandler && <TouchableOpacity onPress={noHandler}>
						<Text style={styles.noButtonText}>아니오</Text>
					</TouchableOpacity>}
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
		gap: 16,
		borderRadius: 16
	},
	title: {
		fontSize: 20,
		color: '#111',
		textAlign: 'center',
		fontWeight: '600'
	},
	subTitle: {
		fontSize: 20,
		color: 'dimgray',
		textAlign: 'center',
	},
	hStack: {
		paddingHorizontal: 16,
		flexDirection: 'row',
	},
	yesButtonText: {
		color: 'royalblue',
		fontSize: 20,
		fontWeight: '600'
	},
	noButtonText: {
		color: 'crimson',
		fontSize: 20,
		fontWeight: '600'
	}
})