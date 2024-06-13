import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Spacer } from "../Spacer";

export const Header: React.FC<{ goBackHandler: () => void; }> = ({ goBackHandler }) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				height: 56,
				borderBottomColor: 'gray',
				borderBottomWidth: 1,
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
					<Icon name='close' size={32} color={'black'} />
				</TouchableOpacity>
			</View>
			<Spacer horizontal={true} space={12} />
		</View>
	)
};