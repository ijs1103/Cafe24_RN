import { TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import { Spacer } from "../Spacer"
import { Typography } from "../Typography"
import { RatingsAndReviews } from "../RatingsAndReviews"

interface SearchResultItemProps {
	cafeId: string;
	cafeName: string;
	cafeAddress: string;
	onPress: () => void;
	distance: string;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ cafeId, cafeName, cafeAddress, onPress, distance }) => {
	return (
		<TouchableOpacity key={cafeId} onPress={onPress} style={{ flex: 1, paddingVertical: 12 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Typography fontWeight='800' fontSize={16} color='#111'>{cafeName}</Typography>
				<Typography fontWeight='900' fontSize={12} color='saddlebrown'>{distance}m</Typography>
			</View>
			<Spacer space={6} />
			<Typography fontWeight='600' fontSize={14} color='dimgray'>{cafeAddress}</Typography>
			<Spacer space={4} />
		</TouchableOpacity>
	)
}