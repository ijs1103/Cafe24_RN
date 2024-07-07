import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import { MainScreen } from '../screens/MainScreen';
import { MyScreen } from '../screens/MyScreen';
import { FavoriteScreen } from '../screens/FavoriteScreen';
import { WebViewScreen } from '../screens/WebViewScreen';
import { WebView } from 'react-native-webview';
import { LatLng } from 'react-native-maps';
import { DirectionsScreen } from '../screens/DirectionsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { CafeDTO, Review, ReviewWithUser } from '../utils/Types';
import { SearchFilterModal } from '../components/SearchFilterModal';
import { EmailSigninScreen } from '../screens/EmailSigninScreen';
import { EmailSignupScreen } from '../screens/EmailSignupScreen';
import { WithDrawalScreen } from '../screens/WithDrawalScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { CafeDetailScreen } from '../screens/CafeDetailScreen';
import { WriteReviewScreen } from '../screens/WriteReviewScreen';
import { MyReviewScreen } from '../screens/MyReviewScreen';
import { AppUpdatingScreen } from '../screens/AppUpdatingScreen';

type MainStackParams = {
	Main: { cafe: CafeDTO } | undefined;
	WebView: { uri: string | undefined };
	Directions: { originLatLng: LatLng, destinationLatLng: LatLng };
	Search: undefined;
	CafeDetail: { cafe: CafeDTO | null };
	WriteReview: { cafe: CafeDTO | null };
	AppUpdating: undefined;
};

export const MainStack = createNativeStackNavigator<MainStackParams>();

export const MainStackScreen: React.FC = () => {

	return (
		<MainStack.Navigator
			initialRouteName={'Main'}
			screenOptions={{
				headerShown: false,
			}}>
			<MainStack.Screen name="Main" component={MainScreen} />
			<MainStack.Screen name="WebView" component={WebViewScreen} />
			<MainStack.Screen name="Directions" component={DirectionsScreen} />
			<MainStack.Screen name="Search" component={SearchScreen} />
			<MainStack.Screen name="CafeDetail" component={CafeDetailScreen} />
			<MainStack.Screen name="WriteReview" component={WriteReviewScreen} />
			<MainStack.Screen name="AppUpdating" component={AppUpdatingScreen} />
		</MainStack.Navigator>
	);
};

export const useMainStackNavigation = <RouteName extends keyof MainStackParams>() =>
	useNavigation<NativeStackNavigationProp<MainStackParams, RouteName>>();

export const useMainStackRoute = <RouteName extends keyof MainStackParams>() =>
	useRoute<RouteProp<MainStackParams, RouteName>>();

type FavoriteStackParams = {
	Favorite: undefined;
};

export const FavoriteStack = createNativeStackNavigator<FavoriteStackParams>();

export const FavoriteStackScreen: React.FC = () => {
	return (
		<FavoriteStack.Navigator
			initialRouteName={'Favorite'}
			screenOptions={{
				title: '즐겨찾기',
				headerTitleStyle: { fontFamily: 'Roboto', fontSize: 24, fontWeight: '700', color: 'saddlebrown' }
			}}>
			<FavoriteStack.Screen name="Favorite" component={FavoriteScreen} />
		</FavoriteStack.Navigator>
	);
};

export const useFavoriteStackNavigation = <RouteName extends keyof FavoriteStackParams>() =>
	useNavigation<NativeStackNavigationProp<FavoriteStackParams, RouteName>>();

export const useFavoriteStackRoute = <RouteName extends keyof FavoriteStackParams>() =>
	useRoute<RouteProp<FavoriteStackParams, RouteName>>();

type MyStackParams = {
	My: undefined;
	EmailSignin: undefined;
	EmailSignup: undefined;
	WebView: { uri: string | undefined };
	WithDrawal: undefined;
	EditProfile: undefined;
	MyReview: undefined;
};

export const MyStack = createNativeStackNavigator<MyStackParams>();

export const MyStackScreen: React.FC = () => {
	return (
		<MyStack.Navigator
			initialRouteName={'My'}
			screenOptions={{
				headerShown: false,
			}}>
			<MyStack.Screen name='My' component={MyScreen} />
			<MyStack.Screen name='EmailSignin' component={EmailSigninScreen} />
			<MyStack.Screen name='EmailSignup' component={EmailSignupScreen} />
			<MyStack.Screen name='WebView' component={WebViewScreen} />
			<MyStack.Screen name='WithDrawal' component={WithDrawalScreen} />
			<MyStack.Screen name='EditProfile' component={EditProfileScreen} />
			<MyStack.Screen name='MyReview' component={MyReviewScreen} />
		</MyStack.Navigator>
	);
};

export const useMyStackNavigation = <RouteName extends keyof MyStackParams>() =>
	useNavigation<NativeStackNavigationProp<MyStackParams, RouteName>>();

export const useMyStackRoute = <RouteName extends keyof MyStackParams>() =>
	useRoute<RouteProp<MyStackParams, RouteName>>();
