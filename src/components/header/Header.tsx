import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Spacer } from "../Spacer";

interface HeaderProps {
	goBackHandler: () => void;
	noBorderLine?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ goBackHandler, noBorderLine }) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				height: 56,
				borderBottomColor: 'gray',
				borderBottomWidth: noBorderLine ? 0 : 1,
				alignItems: 'center',
			}}>
			<Spacer horizontal={true} space={12} />
			<View
				style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}>
				<Spacer horizontal={true} space={1} />
				<TouchableOpacity onPress={goBackHandler}>
					<Icon name='close' size={32} color={'saddlebrown'} />
				</TouchableOpacity>
			</View>
			<Spacer horizontal={true} space={12} />
		</View>
	)
};