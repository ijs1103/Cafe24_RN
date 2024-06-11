import Geolocation from '@react-native-community/geolocation';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Button, Alert, Pressable, View, Touchable, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
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
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Typography } from '../components/Typography';
import { Spacer } from '../components/Spacer';
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { MyLocationButton } from '../components/MyLocationButton';
import Clipboard from '@react-native-clipboard/clipboard';
import { Division } from '../components/Division';

export const MainScreen: React.FC = () => {
	const navigation = useRootNavigation<'Main'>();

	const sheet = useRef<TrueSheet>(null);
	const mapViewRef = useRef<MapView>(null);
	const [query, setQuery] = useState<string>('');
	const [isMapReady, setIsMapReady] = useState<boolean>(false);
	const [cafeList, setCafeList] = useState<[CafeDTO] | null>(null);
	const [currentAddress, setCurrentAddress] = useState<string | null>(null);
	const [locationFetched, setLocationFetched] = useState<boolean>(false);

	const present = async () => {
		await sheet.current?.present()
		console.log('horray! sheet has been presented 💩')
	}

	const dismiss = async () => {
		await sheet.current?.dismiss()
		console.log('Bye bye 👋')
	}

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

	const copyToClipboard = (text: string) => {
		//Clipboard.setString(text);
		Alert.alert("복사 완료", "텍스트가 클립보드에 복사되었습니다.");
	};

	const onPressCall = useCallback(() => {
		//TODO: 전화통화 
	}, []);

	const onPressWebSite = useCallback(() => {
		//TODO: 웹페이지 
	}, []);

	const onPressShare = useCallback(() => {
		//TODO: dynamic links 

	}, []);

	const onPressGetDirections = useCallback(() => {
		//TODO: 길찾기 react-native-maps-directions
	}, []);

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
					return (<Marker
						key={item.id}
						coordinate={{
							latitude: parseFloat(item.y),
							longitude: parseFloat(item.x),
						}}
						image={require('../../assets/cafe_marker.png')}
					/>)
				})}
			</MapView>
			<MyLocationButton onPress={onPressMyLocationButton} />

			<View>
				<Button onPress={present} title="Present" />
				<TrueSheet
					ref={sheet}
					style={{
						elevation: 10
					}}
					sizes={['auto', 'large']}
					dimmed={false}
					cornerRadius={16}
					dismissible={false}
				>
					<View style={{ backgroundColor: 'white' }}>
						<View style={{ paddingHorizontal: 14, paddingVertical: 16 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography fontSize={18} fontWeight='800' color='rebeccapurple' numberOfLines={1}>요거프레소 봉천우성점</Typography>
								<Icon name='heart' size={30} color='crimson' />
							</View>
							<Spacer space={20} />
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Icon name='star-sharp' size={16} color='gold' />
									<Typography fontSize={16} color='dimgray' fontWeight='600'>4.25</Typography>
								</View>
								<Spacer horizontal={true} space={4} />
								<Typography fontSize={16} color='darkgray'>•</Typography>
								<Spacer horizontal={true} space={4} />
								<Typography fontSize={16} color='dimgray' fontWeight='600'>리뷰 100개</Typography>
							</View>
							<Spacer space={10} />
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Typography fontSize={16} fontWeight='900'>515m</Typography>
								<Spacer horizontal={true} space={4} />
								<Typography fontSize={16} color='darkgray'>•</Typography>
								<Spacer horizontal={true} space={4} />
								<Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => copyToClipboard('서울 관악구 관악로 28길 13')}>
									<Typography fontSize={16} color='dimgray' fontWeight='600'>서울 관악구 관악로 28길 13</Typography>
									<Spacer horizontal={true} space={4} />
									<Icon name='copy-sharp' size={14} color='yellowgreen' />
								</Pressable>
							</View>
						</View>
						<Division />
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 16 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 26 }}>
								<TouchableOpacity onPress={onPressCall}>
									<Icon name='call' color={'gray'} size={24} />
								</TouchableOpacity>
								<TouchableOpacity onPress={onPressWebSite}>
									<MCIcon name='web' color={'gray'} size={24} />
								</TouchableOpacity>
								<TouchableOpacity onPress={onPressShare}>
									<Icon name='share-social' color={'gray'} size={24} />
								</TouchableOpacity>
							</View>
							<TouchableOpacity style={{ backgroundColor: 'rebeccapurple', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, alignItems: 'center' }} onPress={onPressGetDirections}>
								<Typography color='mintcream' fontSize={14}>길찾기</Typography>
							</TouchableOpacity>
						</View>
					</View>
				</TrueSheet>
			</View>
		</View >
	);
};
