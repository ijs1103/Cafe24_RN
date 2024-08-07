import Geolocation from '@react-native-community/geolocation';
import { useCallback, useEffect, useState, useRef } from 'react';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import mobileAds from 'react-native-google-mobile-ads';
import { useMainStackNavigation, useMainStackRoute } from '../navigation/RootNavigation';
import { getCafeListFromLatLng } from '../utils/KakaoUtils';
import { CafeDTO } from '../utils/Types';
import { SearchBarHeader } from '../components/header/SearchBarHeader';
import { MyLocationButton } from '../components/MyLocationButton';
import { BottomSheet } from '../components/BottomSheet';
import { DELTA } from '../utils/Constants';
import { deleteFromLikedCafeList, isLikedCafe, addToLikedCafeList } from '../utils/Storage';
import { useGlobalState } from '../providers/GlobalStateProvider';
import { useFirebase } from '../hooks/useFirebase';
import { ScreenLayout } from '../components/ScreenLayout';
import { useCodePush } from '../hooks/useCodePush';
import { YesOrNoModal } from '../components/YesOrNoModal';

export const MainScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'Main'>();
	const routes = useMainStackRoute<'Main'>();
	const { hasAppUpdate } = useCodePush();
	const { currentRegion, setCurrentRegion, showToastMessage } = useGlobalState();
	const { getCafeRatingsAverage, cafeRatings, getReviewsCount, reviewsCount, setProcessingFirebase } = useFirebase();
	const bottomSheetRef = useRef<TrueSheet>(null);
	const mapViewRef = useRef<MapView>(null);
	const [appUpdateModalVisible, setAppUpdateModalVisible] = useState(false);
	const [isMapReady, setIsMapReady] = useState<boolean>(false);
	const [cafeList, setCafeList] = useState<CafeDTO[] | null>(null);
	const [locationFetched, setLocationFetched] = useState<boolean>(false);
	const [selectedCafe, setSelectedCafe] = useState<CafeDTO | null>(null);
	const [isLiked, setIsLiked] = useState<boolean>(false);

	const onChangeLocation = useCallback<
		(item: LatLng) => void
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

	const onPressMarker = useCallback<(cafe: CafeDTO) => void>(async cafe => {
		setProcessingFirebase(true)
		setSelectedCafe(cafe);
		await getCafeRatingsAverage(cafe.id);
		await getReviewsCount(cafe.id);
		presentTrueSheet();
		setProcessingFirebase(false)
	}, []);

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
		showToastMessage(isLiked ? '즐겨찾기에서 삭제 되었습니다.' : '즐겨찾기에 추가 되었습니다.')
		setIsLiked(prev => !prev)
	}, [isLiked, selectedCafe]);

	const sheetSizeChangeHandler = useCallback(async () => {
		if (!selectedCafe?.id) { return }
		navigation.navigate('CafeDetail', { cafe: selectedCafe });
	}, [selectedCafe]);

	const yesHandler = useCallback(() => {
		navigation.navigate('AppUpdating');
	}, []);

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

	useFocusEffect(
		useCallback(() => {
			if (selectedCafe) {
				presentTrueSheet();
			}
		}, [selectedCafe])
	);

	useEffect(() => {
		if (hasAppUpdate) {
			setAppUpdateModalVisible(true);
		}
	}, [hasAppUpdate]);

	useEffect(() => {
		mobileAds()
			.initialize()
			.then(adapterStatuses => {
				console.log(adapterStatuses)
			});
	}, []);

	return (
		<ScreenLayout>
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
			<BottomSheet
				ref={bottomSheetRef}
				cafe={selectedCafe}
				ratings={cafeRatings}
				reviewsCount={reviewsCount}
				webViewHandler={webViewHandler}
				directionsHandler={directionsHandler}
				isLiked={isLiked}
				likeHandler={likeHandler}
				sheetSizeChangeHandler={sheetSizeChangeHandler} />
			<YesOrNoModal title={'최신 업데이트가 있습니다.'} subTitle='업데이트 화면으로 이동합니다.' yesHandler={yesHandler} isVisible={appUpdateModalVisible} />
		</ScreenLayout>
	);
};