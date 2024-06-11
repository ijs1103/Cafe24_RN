import { Pressable, View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import { Spacer } from "./Spacer"
import { Typography } from "./Typography"

export const MyLocationButton: React.FC<{ onPress: () => void; }> = ({ onPress }) => {
	return (
		<Pressable onPress={onPress} style={{ position: 'absolute', bottom: 30, right: 30, backgroundColor: 'white', width: 60, height: 60, borderRadius: 30, elevation: 10 }}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Icon name={'man'} size={26} color={'saddlebrown'} />
				<Spacer space={2} />
				<Typography fontSize={12}>내 위치</Typography>
			</View>
		</Pressable>
	)
}