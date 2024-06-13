import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStackScreen, FavoriteStackScreen, SettingsStackScreen } from './RootNavigation';
import { TabIcon } from '../components/TabIcon';
import { FavoriteScreen } from '../screens/FavoriteScreen';
import { MainScreen } from '../screens/MainScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tabs = createBottomTabNavigator();

export const TabBar: React.FC = () => {
	return (
		<Tabs.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: 'saddlebrown',
				tabBarInactiveTintColor: 'gray',
				tabBarShowLabel: true,
				tabBarStyle: {
					backgroundColor: 'white',
					shadowColor: '#000',
					shadowOffset: { width: 0, height: -2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				},
			}}>
			<Tabs.Screen
				name="MainTab"
				component={MainStackScreen}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<TabIcon name="map" color={color} isFocused={focused} />
					),
					tabBarLabel: '지도',
				}}
			/>
			<Tabs.Screen
				name="FavoriteTab"
				component={FavoriteStackScreen}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<TabIcon name="star" color={color} isFocused={focused} />
					),
					tabBarLabel: '즐겨찾기',
				}}
			/>
			<Tabs.Screen
				name="SettingsTab"
				component={SettingsStackScreen}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<TabIcon name="settings" color={color} isFocused={focused} />
					),
					tabBarLabel: '설정',
				}}
			/>
		</Tabs.Navigator>
	);
};
