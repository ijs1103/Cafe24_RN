import { Alert, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Header } from '../components/header/Header';
import { useMainStackNavigation, useMainStackRoute } from '../navigation/RootNavigation';
import { DELTA } from '../utils/Constants';
import { REACT_APP_GOOGLE_MAP_API_KEY } from '@env';

export const DirectionsScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'Directions'>();
	const routes = useMainStackRoute<'Directions'>();

	const goBackHandler = () => {
		navigation.goBack();
	};

	const onError = () => {
		Alert.alert('서버 에러', '길찾기를 표시할 수 없습니다.', [{ text: '확인', onPress: goBackHandler }])
	};

	return (
		<View style={styles.container}>
			<Header goBackHandler={goBackHandler} />
			<MapView initialRegion={{
				latitude: routes.params.originLatLng.latitude
				, longitude: routes.params.originLatLng.longitude,
				latitudeDelta: DELTA.LATITUDE, longitudeDelta: DELTA.LONGITUDE
			}}>
				<MapViewDirections
					origin={routes.params.originLatLng}
					destination={routes.params.destinationLatLng}
					apikey={REACT_APP_GOOGLE_MAP_API_KEY}
					onError={onError}
				/>
			</MapView>
		</View >
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});