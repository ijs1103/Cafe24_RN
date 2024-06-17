import Icon from 'react-native-vector-icons/Ionicons'
import { Typography } from './Typography';
import { View } from 'react-native';

export const ListEmptyComponent: React.FC = () => {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6 }}>
			<Icon color='#777' name='alert-circle-outline' size={44} />
			<Typography color='#333' fontWeight='800' fontSize={18}>검색 결과가 없습니다.</Typography>
		</View>
	);
}