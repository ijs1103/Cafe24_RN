import React, { useState, useRef, useCallback, useContext } from 'react';
import { useMainStackNavigation } from "../navigation/RootNavigation";
import { ScrollView, Text, TextInput, Touchable, TouchableOpacity, View, Animated, FlatList } from 'react-native';
import { Header } from '../components/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Spacer } from '../components/Spacer';
import { Typography } from '../components/Typography';
import { FRANCHISE_CAFE_LIST } from '../utils/Constants';
import { FRANCHISE_CAFE, CafeDTO } from '../utils/Types';
import { KeyboardAvoidingLayout } from '../components/KeyboardAvoidingLayout';
import { LogoBackground } from '../components/LogoBackground';
import { SearchResultItem } from '../components/ListItem/SearchResultItem';
import { Division } from '../components/Division';
import { ListEmptyComponent } from '../components/ListEmptyComponent';
import { getCafeListFromKeyword } from '../utils/KakaoUtils';
import { CurretRegionContext } from '../../App';

export const SearchScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'Search'>();

	const { currentRegion } = useContext(CurretRegionContext);
	const headerBgAnim = useRef(new Animated.Value(0)).current;
	const [selectedFranchise, setSelectedFranchise] = useState<FRANCHISE_CAFE | null>(null);
	const [keyword, setKeyword] = useState<string | null>(null);
	const [cafeList, setCafeList] = useState<[CafeDTO] | null>(null);

	const goBackHandler = useCallback(() => {
		navigation.goBack()
	}, [navigation]);

	const onPressFranchise = useCallback(async (cafe: FRANCHISE_CAFE) => {
		const data = (selectedFranchise === cafe) ? null : cafe
		setKeyword(data)
		setSelectedFranchise(data)
		if (data) {
			await getCafeListFromKeyword(data, currentRegion.latitude, currentRegion.longitude).then(setCafeList)
		} else {
			setCafeList(null)
		}
	}, [selectedFranchise, currentRegion]);

	const itemPressHandler = useCallback((cafe: CafeDTO) => {
		navigation.navigate('Main', { cafe })
	}, [navigation]);

	return (
		<KeyboardAvoidingLayout>
			<View style={{ flex: 1, backgroundColor: 'antiquewhite' }}>
				<Header goBackHandler={goBackHandler} noBorderLine />
				<View style={{ flex: 1, padding: 16 }}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: 'snow',
							height: 40,
							borderRadius: 10,
							paddingHorizontal: 20,
						}}>
						<Icon name="search" size={20} color={'black'} />
						<Spacer horizontal space={10} />
						<TextInput value={keyword ?? ''} onChangeText={text => setKeyword(text)} placeholder='내 주변 카페를 검색해보세요.' placeholderTextColor={'darkgray'} style={{ flex: 1, color: 'black', fontSize: 16, fontWeight: '700' }} />
					</View>
					<Spacer space={20} />
					<Typography color='dimgray' fontSize={16} fontWeight='bold'>인기 검색어</Typography>
					<View>
						<ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ flexDirection: 'row' }}>
							{FRANCHISE_CAFE_LIST.map((value, index) => {
								return (
									<TouchableOpacity key={index} onPress={() => onPressFranchise(value)}>
										<View
											style={{
												paddingVertical: 8,
												paddingHorizontal: 12,
												borderWidth: 0.5,
												backgroundColor:
													selectedFranchise === value ? 'saddlebrown' : 'floralwhite',
												borderColor: '#ffffff30',
												marginVertical: 16,
												marginHorizontal: 6,
												borderRadius: 8,
												elevation: 4
											}}
										>
											<Text
												style={{
													color: selectedFranchise === value ? 'white' : 'saddlebrown',
													fontWeight: '600'
												}}
											>
												{value}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>
					<Typography color='dimgray' fontSize={16} fontWeight='bold'>검색 결과</Typography>
					<View style={{ flex: 1, position: 'relative', paddingVertical: 12 }}>
						<LogoBackground selectedCafe={selectedFranchise} headerBgAnim={headerBgAnim} />
						<FlatList data={cafeList} renderItem={({ item }) => <SearchResultItem cafeId={item.id} cafeName={item.place_name} cafeAddress={item.address_name} ratings={4.25} reviewsCount={100} onPress={() => itemPressHandler(item)} />} keyExtractor={item => item.id} ListEmptyComponent={<ListEmptyComponent />} ItemSeparatorComponent={() => <Division separatorStyle />} contentContainerStyle={{ flexGrow: 1 }} />
					</View>
				</View>
			</View >
		</KeyboardAvoidingLayout>

	);
}