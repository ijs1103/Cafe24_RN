import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Alert, Pressable, View, Touchable, TouchableOpacity } from 'react-native';
import MapView, { Marker, MarkerPressEvent, Region } from 'react-native-maps';
import { useRootNavigation } from '../navigation/RootNavigation';
import {
	getCafeList,
	getAddressFromCoords,
	getCoordsFromAddress,
	getCoordsFromKeyword,
} from '../utils/KakaoUtils';
import { CafeDTO } from '../utils/Interfaces';
import { SearchBarHeader } from '../components/header/SearchBarHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '../components/Typography';
import { Spacer } from '../components/Spacer';
import { MyLocationButton } from '../components/MyLocationButton';
import { Division } from '../components/Division';
import ToastMessage, { ToastMessageRef } from '../components/ToastMessage';
import { BottomSheet } from '../components/BottomSheet';
import { TrueSheet } from "@lodev09/react-native-true-sheet";

export const MainScreen: React.FC = () => {
	const navigation = useRootNavigation<'Main'>();

	const toastMessageRef = useRef<ToastMessageRef>(null);
	const bottomSheetRef = useRef<TrueSheet>(null);
	const mapViewRef = useRef<MapView>(null);
	const [query, setQuery] = useState<string>('');
	const [isMapReady, setIsMapReady] = useState<boolean>(false);
	const [cafeList, setCafeList] = useState<[CafeDTO] | null>(null);
	const [currentAddress, setCurrentAddress] = useState<string | null>(null);
	const [locationFetched, setLocationFetched] = useState<boolean>(false);
	const [currentRegion, setCurrentRegion] = useState<{
		latitude: number;
		longitude: number;
	}>({
		latitude: 37.526126,
		longitude: 126.922255,
	});

	const onChangeLocation = useCallback<
		(item: { latitude: number; longitude: number }) => void
	>(item => {
		setCurrentRegion({
			latitude: item.latitude,
			longitude: item.longitude,
		});
	}, []);

	const getMyLocation = useCallback(async () => {
		Geolocation.getCurrentPosition(position => {
			onChangeLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});
			setLocationFetched(true);
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

	const onMapReady = useCallback(() => {
		setIsMapReady(true);
		getMyLocation();
	}, [getMyLocation]);

	const onPressSearchBarHeader = useCallback(() => {
		navigation.push('SearchScreen');
	}, []);

	const onRegionChangeComplete = useCallback((region: Region) => {
		getCafeList(region.latitude, region.longitude).then(setCafeList)
	}, []);

	const onPressMyLocationButton = useCallback(
		() => {
			mapViewRef.current?.animateToRegion({
				latitude: currentRegion.latitude,
				longitude: currentRegion.longitude,
				latitudeDelta: 0.015,
				longitudeDelta: 0.0121,
			})
		}, [currentRegion]);

	const presentTrueSheet = useCallback(async () => {
		await bottomSheetRef.current?.present()
	}, []);

	const dismissTrueSheet = useCallback(async () => {
		await bottomSheetRef.current?.dismiss()
	}, []);

	const onPressMarker = useCallback<(event: MarkerPressEvent) => void>(({ nativeEvent: { coordinate } }) => {
		presentTrueSheet();
	}, []);

	const showToastMessage = () => {
		if (toastMessageRef.current) {
			toastMessageRef.current.showToastMessage();
		}
	}

	useEffect(() => {
		if (locationFetched) {
			getCafeList(currentRegion.latitude, currentRegion.longitude).then(
				setCafeList,
			);
		}
	}, [locationFetched, currentRegion]);

	return (
		<View style={{ flex: 1 }}>
			<SearchBarHeader onPress={onPressSearchBarHeader} />
			<MapView
				ref={mapViewRef}
				style={{ flex: 1 }}
				region={{
					latitude: currentRegion.latitude,
					longitude: currentRegion.longitude,
					latitudeDelta: 0.015,
					longitudeDelta: 0.0121,
				}}
				onMapReady={onMapReady}
				onRegionChangeComplete={region => {
					onRegionChangeComplete(region)
				}}
				moveOnMarkerPress={false}
				toolbarEnabled={false}
				rotateEnabled={false}
				minZoomLevel={15}
			>
				{isMapReady && (
					<Marker
						coordinate={{
							latitude: currentRegion.latitude,
							longitude: currentRegion.longitude,
						}}
					/>
				)}

				{isMapReady && cafeList?.map(item => {
					return (
						<Marker
							key={item.id}
							onPress={onPressMarker}
							coordinate={{
								latitude: parseFloat(item.y),
								longitude: parseFloat(item.x),
							}}
							image={require('../../assets/cafe_marker.png')}
						/>
					)
				})}
			</MapView>
			<MyLocationButton onPress={onPressMyLocationButton} />
			<BottomSheet ref={bottomSheetRef} />
			<ToastMessage ref={toastMessageRef} message='알람 메시지' />
		</View >
	);
};
