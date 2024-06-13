import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import { MainScreen } from '../screens/MainScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FavoriteScreen } from '../screens/FavoriteScreen';
import { WebViewScreen } from '../screens/WebViewScreen';
import { WebView } from 'react-native-webview';
import { LatLng } from 'react-native-maps';
import { DirectionsScreen } from '../screens/DirectionsScreen';

type MainStackParams = {
	Main: undefined;
	WebView: { uri: string | undefined };
	Directions: { originLatLng: LatLng, destinationLatLng: LatLng };
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
				headerShown: false,
			}}>
			<FavoriteStack.Screen name="Favorite" component={FavoriteScreen} />
		</FavoriteStack.Navigator>
	);
};

export const useFavoriteStackNavigation = <RouteName extends keyof FavoriteStackParams>() =>
	useNavigation<NativeStackNavigationProp<FavoriteStackParams, RouteName>>();

export const useFavoriteStackRoute = <RouteName extends keyof FavoriteStackParams>() =>
	useRoute<RouteProp<FavoriteStackParams, RouteName>>();

type SettingsStackParams = {
	Settings: undefined;
};

export const SettingsStack = createNativeStackNavigator<SettingsStackParams>();

export const SettingsStackScreen: React.FC = () => {
	return (
		<SettingsStack.Navigator
			initialRouteName={'Settings'}
			screenOptions={{
				headerShown: false,
			}}>
			<SettingsStack.Screen name="Settings" component={SettingsScreen} />
		</SettingsStack.Navigator>
	);
};

export const useSettingsStackNavigation = <RouteName extends keyof SettingsStackParams>() =>
	useNavigation<NativeStackNavigationProp<SettingsStackParams, RouteName>>();

export const useSettingsStackRoute = <RouteName extends keyof SettingsStackParams>() =>
	useRoute<RouteProp<SettingsStackParams, RouteName>>();
