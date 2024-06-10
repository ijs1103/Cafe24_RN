import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRootNavigation } from '../navigation/RootNavigation';
import {
	getCafeList,
	getAddressFromCoords,
	getCoordsFromAddress,
	getCoordsFromKeyword,
} from '../utils/KakaoUtils';
import { CafeDTO } from '../utils/Interfaces';
import { SearchBarHeader } from '../components/header/SearchBarHeader';

export const MainScreen: React.FC = () => {
	const navigation = useRootNavigation<'Main'>();

	const [query, setQuery] = useState<string>('');
	const [isMapReady, setIsMapReady] = useState<boolean>(false);
	const [cafeList, setCafeList] = useState<[CafeDTO] | null>(null);

	const [currentRegion, setCurrentRegion] = useState<{
		latitude: number;
		longitude: number;
	}>({
		latitude: 37.526126,
		longitude: 126.922255,
	});

	const [currentAddress, setCurrentAddress] = useState<string | null>(null);

	const onChangeLocation = useCallback<
		(item: { latitude: number; longitude: number }) => Promise<void>
	>(async item => {
		setCurrentRegion({
			latitude: item.latitude,
			longitude: item.longitude,
		});
		getAddressFromCoords(item.latitude, item.longitude).then(setCurrentAddress);
	}, []);

	const getMyLocation = useCallback(() => {
		Geolocation.getCurrentPosition(position => {
			console.log(position);
			onChangeLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
		});
	}, [onChangeLocation]);

	const onFindAddress = useCallback<() => Promise<void>>(async () => {
		const keywordResult = await getCoordsFromKeyword(query);

		if (keywordResult !== null) {
			setCurrentAddress(keywordResult.address);
			setCurrentRegion({
				latitude: parseFloat(keywordResult.latitude.toString()),
				longitude: parseFloat(keywordResult.longitude.toString()),
			});
			return;
		}
		const addressResult = await getCoordsFromAddress(query);
		if (addressResult === null) {
			console.error('주소값을 찾지 못햇습니다.');
			return;
		}

		setCurrentAddress(addressResult.address);
		setCurrentRegion({
			latitude: parseFloat(addressResult.latitude.toString()),
			longitude: parseFloat(addressResult.longitude.toString()),
		});
	}, [query]);

	const onMapReady = useCallback(async () => {
		setIsMapReady(true);
		// getCafeList(currentRegion.latitude, currentRegion.longitude).then(
		// 	setCafeList,
		// );
	}, []);

	const onPressSearchBarHeader = useCallback(() => {
		navigation.push('SearchScreen');
	}, []);

	useEffect(() => {
		getMyLocation();
	}, [getMyLocation]);

	return (
		<View style={{ flex: 1 }}>
			<SearchBarHeader onPressSearchBarHeader={onPressSearchBarHeader} />
			<MapView
				style={{ flex: 1 }}
				region={{
					latitude: currentRegion.latitude,
					longitude: currentRegion.longitude,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				}}
				onMapReady={onMapReady}
				onLongPress={event => {
					onChangeLocation(event.nativeEvent.coordinate);
				}}>
				{isMapReady && (
					<Marker
						coordinate={{
							latitude: currentRegion.latitude,
							longitude: currentRegion.longitude,
						}}
					/>
				)}
			</MapView>
		</View >
	);
};
