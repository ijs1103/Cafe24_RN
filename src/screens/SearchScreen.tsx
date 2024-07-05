import React, { useState, useCallback } from 'react';
import { useMainStackNavigation } from "../navigation/RootNavigation";
import { ScrollView, Text, TextInput, Touchable, TouchableOpacity, View, Animated, FlatList, StyleSheet } from 'react-native';
import { Header } from '../components/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Spacer } from '../components/Spacer';
import { Typography } from '../components/Typography';
import { FRANCHISE_CAFE_LIST } from '../utils/Constants';
import { FRANCHISE_CAFE_TYPE, CafeDTO, FILTER_TYPE } from '../utils/Types';
import { KeyboardAvoidingLayout } from '../components/KeyboardAvoidingLayout';
import { LogoBackground } from '../components/LogoBackground';
import { SearchResultItem } from '../components/ListItem/SearchResultItem';
import { Division } from '../components/Division';
import { ListEmptyComponent } from '../components/ListEmptyComponent';
import { getCafeListFromKeyword } from '../utils/KakaoUtils';
import { SearchFilterButton } from '../components/SearchFilterButton';
import { SearchFilterModal } from '../components/SearchFilterModal';
import { FranchiseCafeButton } from '../components/FranchiseCafeButton';
import { LoadingView } from '../components/LoadingView';
import { useGlobalState } from '../providers/GlobalStateProvider';

export const SearchScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'Search'>();
	const { currentRegion } = useGlobalState();
	const [selectedFranchise, setSelectedFranchise] = useState<FRANCHISE_CAFE_TYPE | null>(null);
	const [keyword, setKeyword] = useState<string | null>(null);
	const [cafeList, setCafeList] = useState<CafeDTO[] | null>(null);
	const [isSearchFilterActive, setIsSearchFilterActive] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState<FILTER_TYPE>('거리 가까운순');
	const [isLoading, setIsLoading] = useState(false);

	const goBackHandler = useCallback(() => {
		navigation.goBack()
	}, [navigation]);

	const onPressFranchise = useCallback(async (cafe: FRANCHISE_CAFE_TYPE) => {
		const data = (selectedFranchise === cafe) ? null : cafe
		setKeyword(data)
		setSelectedFranchise(data)
		setSelectedFilter('거리 가까운순')
		if (data) {
			setIsLoading(true)
			await getCafeListFromKeyword(data, currentRegion.latitude, currentRegion.longitude).then(setCafeList)
			setIsLoading(false)
		} else {
			setCafeList(null)
		}
	}, [selectedFranchise, currentRegion]);

	const itemPressHandler = useCallback((cafe: CafeDTO) => {
		navigation.navigate('Main', { cafe })
	}, [navigation]);

	const onSubmitEditing = useCallback(async (text: string) => {
		setIsLoading(true)
		setSelectedFilter('거리 가까운순')
		await getCafeListFromKeyword(text, currentRegion.latitude, currentRegion.longitude).then(setCafeList)
		setIsLoading(false)
	}, [currentRegion]);

	const toggleModal = useCallback(() => {
		setIsSearchFilterActive(prev => !prev)
	}, []);

	const filterPressHandler = useCallback((filter: FILTER_TYPE) => {
		setSelectedFilter(filter)
		if (cafeList) {
			let sortedCafeList: CafeDTO[] = [...cafeList]
			switch (filter) {
				case '거리 가까운순':
					sortedCafeList = sortedCafeList.sort((a, b) => { return parseFloat(a.distance) - parseFloat(b.distance) })
					break
				case '거리 먼순':
					sortedCafeList = sortedCafeList.sort((a, b) => { return parseFloat(b.distance) - parseFloat(a.distance) })
					break
			}
			setCafeList(sortedCafeList)
		}
		toggleModal()
	}, [cafeList]);

	const textInputFocusHandler = useCallback(() => {
		setKeyword('')
		setSelectedFranchise(null)
	}, []);

	return (
		<KeyboardAvoidingLayout>
			<View style={styles.container}>
				<Header goBackHandler={goBackHandler} noBorderLine />
				<View style={styles.subContainer}>
					<View style={styles.searchBar}>
						<Icon name="search" size={20} color={'black'} />
						<Spacer horizontal space={10} />
						<TextInput value={keyword ?? ''} onSubmitEditing={({ nativeEvent: { text } }) => onSubmitEditing(text)} onChangeText={text => setKeyword(text)} placeholder='내 주변 카페를 검색해보세요.' placeholderTextColor={'darkgray'} style={{ flex: 1, color: 'black', fontSize: 16, fontWeight: '700' }} onFocus={textInputFocusHandler} autoFocus />
					</View>
					<Spacer space={20} />
					<Typography color='dimgray' fontSize={16} fontWeight='bold'>인기 검색어</Typography>
					<View>
						<ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.hScrollView}>
							{FRANCHISE_CAFE_LIST.map((value, index) => {
								return <FranchiseCafeButton key={index} onPress={() => onPressFranchise(value)} isSelected={selectedFranchise === value} cafe={value} />
							})}
						</ScrollView>
					</View>
					<View style={styles.hStack}>
						<Typography color='dimgray' fontSize={16} fontWeight='bold'>검색 결과</Typography>
						{cafeList && <SearchFilterButton isActive={isSearchFilterActive} selectedFilter={selectedFilter} SearchFilterButtonPressHandler={() => setIsSearchFilterActive(prev => !prev)} />}
					</View>
					<View style={styles.listContainer}>
						<LogoBackground selectedCafe={selectedFranchise} />
						{isLoading ? <LoadingView /> : <FlatList data={cafeList} renderItem={({ item }) => <SearchResultItem cafeId={item.id} cafeName={item.place_name} cafeAddress={item.address_name} distance={item.distance} onPress={() => itemPressHandler(item)} />} keyExtractor={item => item.id} ListEmptyComponent={<ListEmptyComponent text='검색 결과가 없습니다.' />} ItemSeparatorComponent={() => <Division separatorStyle />} contentContainerStyle={{ flexGrow: 1 }} />
						}
					</View>
				</View>
				<SearchFilterModal isModalVisible={isSearchFilterActive} selectedFilter={selectedFilter} toggleModal={toggleModal} filterPressHandler={filterPressHandler} />
			</View >
		</KeyboardAvoidingLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'antiquewhite'
	},
	subContainer: {
		flex: 1,
		padding: 16
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'snow',
		height: 40,
		borderRadius: 10,
		paddingHorizontal: 20,
	},
	hScrollView: {
		flexDirection: 'row'
	},
	hStack: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	listContainer: {
		flex: 1,
		position: 'relative',
		paddingVertical: 12
	}
});