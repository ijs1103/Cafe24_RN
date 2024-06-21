import { TouchableOpacity, View, Text } from "react-native";
import { FRANCHISE_CAFE_TYPE } from "../utils/Types";

interface FranchiseCafeButtonProps {
	onPress: () => void;
	isSelected: boolean;
	cafe: FRANCHISE_CAFE_TYPE;
}

export const FranchiseCafeButton: React.FC<FranchiseCafeButtonProps> = ({ onPress, isSelected, cafe }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<View
				style={{
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
				}}
			>
				<Text
					style={{
						color: isSelected ? 'white' : 'saddlebrown',
						fontWeight: '600'
					}}
				>
					{cafe}
				</Text>
			</View>
		</TouchableOpacity>
	);
}