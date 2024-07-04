import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Spacer } from "../Spacer";

interface HeaderProps {
	goBackHandler: () => void;
	noBorderLine?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ goBackHandler, noBorderLine }) => {
	const styles = getStyles(noBorderLine);

	return (
		<View
			style={styles.container}>
			<Spacer horizontal={true} space={12} />
			<View style={styles.subContainer}>
				<Spacer horizontal={true} space={1} />
				<TouchableOpacity onPress={goBackHandler}>
					<Icon name='close' size={32} color={'saddlebrown'} />
				</TouchableOpacity>
			</View>
			<Spacer horizontal={true} space={12} />
		</View>
	)
};

const getStyles = (noBorderLine?: boolean) => StyleSheet.create({
	container: {
		flexDirection: 'row',
		height: 56,
		borderBottomColor: 'gray',
		borderBottomWidth: noBorderLine ? 0 : 1,
		alignItems: 'center',
	},
	subContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	}
});