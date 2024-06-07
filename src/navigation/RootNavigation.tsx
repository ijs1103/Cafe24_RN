import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import { MainScreen } from '../screens/MainScreen';

type ScreenParms = {
	Main: undefined;
};

const Stack = createNativeStackNavigator<ScreenParms>();

export const RootNavigation: React.FC = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				presentation: 'containedModal',
			}}>
			<Stack.Screen name="Main" component={MainScreen} />
		</Stack.Navigator>
	);
};

export const useRootNavigation = <RouteName extends keyof ScreenParms>() =>
	useNavigation<NativeStackNavigationProp<ScreenParms, RouteName>>();

export const useRootRoute = <RouteName extends keyof ScreenParms>() =>
	useRoute<RouteProp<ScreenParms, RouteName>>();
