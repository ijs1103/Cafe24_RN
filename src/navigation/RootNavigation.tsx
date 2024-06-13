import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import { MainScreen } from '../screens/MainScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FavoriteScreen } from '../screens/FavoriteScreen';
import { MyWebView } from '../components/MyWebView';
import { WebView } from 'react-native-webview';

type ScreenParms = {
	Main: undefined;
	Favorite: undefined;
	Settings: undefined;
	WebView: { uri: string | undefined };
};

export const Stack = createNativeStackNavigator<ScreenParms>();

export const RootNavigation: React.FC<{
	initialRouteName: keyof ScreenParms;
}> = props => {
	return (
		<Stack.Navigator
			initialRouteName={props.initialRouteName}
			screenOptions={{
				headerShown: false,
				presentation: 'containedModal',
			}}>
			<Stack.Screen name="Main" component={MainScreen} />
			<Stack.Screen name="Favorite" component={FavoriteScreen} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="WebView" component={MyWebView} />
		</Stack.Navigator>
	);
};

export const useRootNavigation = <RouteName extends keyof ScreenParms>() =>
	useNavigation<NativeStackNavigationProp<ScreenParms, RouteName>>();

export const useRootRoute = <RouteName extends keyof ScreenParms>() =>
	useRoute<RouteProp<ScreenParms, RouteName>>();
