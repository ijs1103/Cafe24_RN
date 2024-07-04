import { Pressable, StyleSheet, View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import { Spacer } from "./Spacer"
import { Typography } from "./Typography"

export const MyLocationButton: React.FC<{ onPress: () => void; }> = ({ onPress }) => {
	return (
		<Pressable onPress={onPress} style={styles.container}>
			<View style={styles.buttonContainer}>
				<Icon name={'man'} size={26} color={'saddlebrown'} />
				<Spacer space={2} />
				<Typography fontSize={12}>내 위치</Typography>
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 30,
		right: 30,
		backgroundColor: 'white',
		width: 60,
		height: 60,
		borderRadius: 30,
		elevation: 10
	},
	buttonContainer: {
		flex: 1, 
		justifyContent: 'center', 
		alignItems: 'center'
	}
});