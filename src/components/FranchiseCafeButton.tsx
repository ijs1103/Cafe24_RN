import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { FRANCHISE_CAFE_TYPE } from "../utils/Types";

interface FranchiseCafeButtonProps {
	onPress: () => void;
	isSelected: boolean;
	cafe: FRANCHISE_CAFE_TYPE;
}

export const FranchiseCafeButton: React.FC<FranchiseCafeButtonProps> = ({ onPress, isSelected, cafe }) => {
	const styles = getStyles(isSelected);
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<Text style={styles.text}>{cafe}</Text>
		</TouchableOpacity>
	);
}

const getStyles = (isSelected: boolean) => {
	return StyleSheet.create({
		container: {
			paddingVertical: 8,
			paddingHorizontal: 12,
			borderWidth: 0.5,
			backgroundColor:
				isSelected ? 'saddlebrown' : 'floralwhite',
			borderColor: '#ffffff30',
			marginVertical: 16,
			marginHorizontal: 6,
			borderRadius: 8,
			elevation: 4
		},
		text: {
			color: isSelected ? 'white' : 'saddlebrown',
			fontWeight: '600'
		}
	})
};