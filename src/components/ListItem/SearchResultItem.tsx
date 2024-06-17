import { TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'
import { Spacer } from "../Spacer"
import { Typography } from "../Typography"
import { RatingsAndReviews } from "../RatingsAndReviews"

interface SearchResultItemProps {
	cafeId: string;
	cafeName: string;
	cafeAddress: string;
	ratings: number;
	reviewsCount: number;
	onPress: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ cafeId, cafeName, cafeAddress, ratings, reviewsCount, onPress }) => {
	return (
		<TouchableOpacity key={cafeId} onPress={onPress} style={{ flex: 1, paddingVertical: 12 }}>
			<Typography fontWeight='800' fontSize={16} color='#111'>{cafeName}</Typography>
			<Spacer space={6} />
			<Typography fontWeight='600' fontSize={14} color='#333'>{cafeAddress}</Typography>
			<Spacer space={4} />
			<RatingsAndReviews ratings={ratings} reviewsCount={reviewsCount} small />
		</TouchableOpacity>
	)
}