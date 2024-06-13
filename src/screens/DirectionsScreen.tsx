
import { useEffect } from 'react';
import { Alert, View } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Header } from '../components/header/Header';
import { useRootNavigation, useRootRoute } from '../navigation/RootNavigation';
import { DELTA } from '../utils/Constants';

export const DirectionsScreen: React.FC = () => {
	const navigation = useRootNavigation<'Directions'>();
	const routes = useRootRoute<'Directions'>();

	const goBackHandler = () => {
		navigation.goBack();
	};

	const onError = () => {
		Alert.alert('서버 에러', '길찾기를 표시할 수 없습니다.', [ { text: '확인', onPress: goBackHandler } ])
	};

	return (
		<View style={{ flex: 1 }}>
			<Header goBackHandler={goBackHandler} />
			<MapView initialRegion={{
				latitude: routes.params.originLatLng.latitude
				, longitude: routes.params.originLatLng.longitude,
				latitudeDelta: DELTA.LATITUDE, longitudeDelta: DELTA.LONGITUDE
			}}>
				<MapViewDirections
					origin={routes.params.originLatLng}
					destination={routes.params.destinationLatLng}
					apikey={'AIzaSyAwjM0OQjavCzXF1Qqz8vC41K-4s-EzHNY'}
					onError={onError}
				/>
			</MapView>
		</View >
	);
}; 