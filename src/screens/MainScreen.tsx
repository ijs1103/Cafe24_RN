import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { Button, Alert, Pressable, View, Touchable, TouchableOpacity } from 'react-native';
import MapView, { Marker, MarkerPressEvent, Region, LatLng } from 'react-native-maps';
import { useMainStackNavigation, useMainStackRoute } from '../navigation/RootNavigation';
import { getCafeListFromLatLng } from '../utils/KakaoUtils';
import { CafeDTO } from '../utils/Types';
import { SearchBarHeader } from '../components/header/SearchBarHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '../components/Typography';
import { Spacer } from '../components/Spacer';
import { MyLocationButton } from '../components/MyLocationButton';
import { Division } from '../components/Division';
import ToastMessage, { ToastMessageRef } from '../components/ToastMessage';
import { BottomSheet } from '../components/BottomSheet';
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { WebView } from 'react-native-webview';
import { DELTA } from '../utils/Constants';
import { CurretRegionContext } from '../../App';
import { deleteFromLikedCafeList, isLikedCafe, addToLikedCafeList } from '../utils/Storage';

export const MainScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'Main'>();
	const routes = useMainStackRoute<'Main'>();

	const { currentRegion, setCurrentRegion } = useContext(CurretRegionContext);
	const toastMessageRef = useRef<ToastMessageRef>(null);
	const bottomSheetRef = useRef<TrueSheet>(null);
	const mapViewRef = useRef<MapView>(null);
	const [isMapReady, setIsMapReady] = useState<boolean>(false);
	const [cafeList, setCafeList] = useState<[CafeDTO] | null>(null);
	const [locationFetched, setLocationFetched] = useState<boolean>(false);
	const [selectedCafe, setSelectedCafe] = useState<CafeDTO | null>(null);
	const [isLiked, setIsLiked] = useState<boolean>(false);

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

	const onMapReady = useCallback(() => {
		setIsMapReady(true);
		getMyLocation();
	}, [getMyLocation]);

	const onPressSearchBarHeader = useCallback(() => {
		navigation.navigate('Search');
	}, [navigation]);

	const onMarkerDeselect = useCallback(() => {
		setSelectedCafe(null);
	}, []);

	const onRegionChangeComplete = useCallback((region: Region) => {
		getCafeListFromLatLng(region.latitude, region.longitude).then(setCafeList)
	}, []);

	const onPressMyLocationButton = useCallback(
		() => {
			mapViewRef.current?.animateToRegion({
				latitude: currentRegion.latitude,
				longitude: currentRegion.longitude,
				latitudeDelta: DELTA.LATITUDE,
				longitudeDelta: DELTA.LONGITUDE,
			})
		}, [mapViewRef, currentRegion]);

	const presentTrueSheet = useCallback(async () => {
		await bottomSheetRef.current?.present()
	}, [bottomSheetRef]);

	const dismissTrueSheet = useCallback(async () => {
		await bottomSheetRef.current?.dismiss()
	}, [bottomSheetRef]);

	const onPressMarker = useCallback<(cafe: CafeDTO) => void>(cafe => {
		setSelectedCafe(cafe);
		presentTrueSheet();
	}, []);

	const messageHandler = useCallback((text: string) => {
		toastMessageRef.current?.showToastMessage(text);
	}, [toastMessageRef]);

	const webViewHandler = useCallback(() => {
		navigation.navigate('WebView', { uri: selectedCafe?.place_url });
	}, [navigation, selectedCafe]);

	const directionsHandler = useCallback(() => {
		if (!selectedCafe) { return; }
		navigation.navigate('Directions', { originLatLng: currentRegion, destinationLatLng: { latitude: parseFloat(selectedCafe.y), longitude: parseFloat(selectedCafe.x) } });
	}, [navigation, selectedCafe]);

	const likeHandler = useCallback(() => {
		if (!selectedCafe) { return }
		if (isLiked) {
			deleteFromLikedCafeList(selectedCafe.id)
		} else {
			addToLikedCafeList(selectedCafe)
		}
		messageHandler(isLiked ? '즐겨찾기에서 삭제 되었습니다.' : '즐겨찾기에 추가 되었습니다.')
		setIsLiked(prev => !prev)
	}, [isLiked, selectedCafe]);

	useEffect(() => {
		if (locationFetched) {
			getCafeListFromLatLng(currentRegion.latitude, currentRegion.longitude).then(
				setCafeList,
			);
		}
	}, [locationFetched, currentRegion]);

	useEffect(() => {
		if (selectedCafe === null) {
			dismissTrueSheet();
		}
	}, [selectedCafe, dismissTrueSheet]);

	useEffect(() => {
		if (routes.params) {
			mapViewRef.current?.animateToRegion({
				latitude: parseFloat(routes.params.cafe.y),
				longitude: parseFloat(routes.params.cafe.x),
				latitudeDelta: DELTA.LATITUDE,
				longitudeDelta: DELTA.LONGITUDE,
			})
			setSelectedCafe(routes.params.cafe);
			presentTrueSheet();
		}
	}, [mapViewRef, routes.params]);

	useEffect(() => {
		const checkIsLiked = async () => {
			if (selectedCafe) {
				const liked = await isLikedCafe(selectedCafe.id);
				setIsLiked(liked);
			}
		};
		checkIsLiked();
	}, [selectedCafe]);

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
				onLongPress={onMarkerDeselect}
				moveOnMarkerPress={false}
				toolbarEnabled={false}
				rotateEnabled={false}
				minZoomLevel={16}
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
							onPress={() => onPressMarker(item)}
							coordinate={{
								latitude: parseFloat(item.y),
								longitude: parseFloat(item.x),
							}}
							image={(selectedCafe?.id === item.id) ? require('../../assets/marker/selected_cafe_marker.png') : require('../../assets/marker/cafe_marker.png')}
						/>
					)
				})}
			</MapView>
			<MyLocationButton onPress={onPressMyLocationButton} />
			<BottomSheet ref={bottomSheetRef} cafe={selectedCafe} toastMessageHandler={() => messageHandler('전화번호가 제공되지 않습니다.')} webViewHandler={webViewHandler} directionsHandler={directionsHandler} isLiked={isLiked} likeHandler={likeHandler} />
			<ToastMessage ref={toastMessageRef} />
		</View >
	);
};
