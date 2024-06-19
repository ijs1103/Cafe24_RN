import { TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import { Spacer } from "../Spacer"
import { Typography } from "../Typography"
import { RatingsAndReviews } from "../RatingsAndReviews"
import { CafeDTO } from '../../utils/Types';

interface LikedCafeItemProps {
	cafe: CafeDTO
	onPressAll: () => void;
	onPressOption: () => void;
}

export const LikedCafeItem: React.FC<LikedCafeItemProps> = ({ cafe: { id, place_name: name, address_name: address, distance }, onPressAll, onPressOption }) => {
	return (
		<TouchableOpacity onPress={onPressAll} style={{ flex: 1, gap: 12, paddingVertical: 12 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography fontWeight='800' fontSize={16}>{name}</Typography>
				<TouchableOpacity onPress={onPressOption}>
					<Icon name='trash-sharp' size={16} color={'darkred'} />
				</TouchableOpacity>
			</View>
			<View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
				<Typography fontWeight='600' fontSize={12} color='saddlebrown'>{distance}m</Typography>
				<Typography fontSize={14} color='darkgray'>•</Typography>
				<Typography fontWeight='600' fontSize={12} color='dimgray'>{address}</Typography>
			</View>
		</TouchableOpacity>
	)
}