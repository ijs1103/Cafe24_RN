import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMainStackNavigation } from '../navigation/RootNavigation';
import { Division } from '../components/Division';
import { ListEmptyComponent } from '../components/ListEmptyComponent';
import { LikedCafeItem } from '../components/ListItem/LikedCafeItem';
import { useCallback, useState } from 'react';
import { deleteFromLikedCafeList, getLikedCafeList } from '../utils/Storage';
import { CafeDTO } from '../utils/Types';

export const FavoriteScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'Main'>();
	const [cafeList, setCafeList] = useState<CafeDTO[] | null>(null);

	const itemPressHandler = useCallback((cafe: CafeDTO) => {
		navigation.navigate('Main', { cafe })
	}, [navigation]);

	const cafeDeleteHandler = useCallback((id: string) => {
		deleteFromLikedCafeList(id)
		getLikedCafeList().then(setCafeList)
	}, []);

	const optionPressHandler = useCallback((id: string) => {
		Alert.alert(
			'즐겨찾기 해제',
			'정말로 삭제하시겠습니까?',
			[
				{
					text: '확인',
					onPress: () => cafeDeleteHandler(id),
					style: 'default',
				},
				{
					text: '취소',
					style: 'cancel',
				},
			],
			{
				cancelable: false,
			},)
	}, []);

	useFocusEffect(
		useCallback(() => {
			getLikedCafeList().then(setCafeList);
		}, [])
	);

	return (
		<View style={styles.container}>
			<FlatList
				style={styles.flatList}
				data={cafeList}
				renderItem={({ item }) => <LikedCafeItem key='item.id' cafe={item} onPressAll={() => itemPressHandler(item)} onPressOption={() => optionPressHandler(item.id)} />}
				keyExtractor={item => item.id}
				ListEmptyComponent={() => <ListEmptyComponent text='즐겨찾기 한 카페가 없습니다.' />}
				ItemSeparatorComponent={() => <Division />}
				contentContainerStyle={styles.contentContainer} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	flatList: {
		padding: 16
	},
	contentContainer: {
		flexGrow: 1
	}
});