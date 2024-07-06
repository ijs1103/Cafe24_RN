import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStackScreen, FavoriteStackScreen, MyStackScreen } from './RootNavigation';
import { TabIcon } from '../components/TabIcon';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

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
				}
			}}>
			<Tabs.Screen
				name="MainTab"
				component={MainStackScreen}
				options={({ route }) => ({
					tabBarIcon: ({ focused, color }) => (
						<TabIcon name="map" color={color} isFocused={focused} />
					),
					tabBarLabel: '지도',
					tabBarStyle: ((route) => {
						const routeName = getFocusedRouteNameFromRoute(route) ?? ""
						if (['WebView', 'Search', 'CafeDetail', 'WriteReview'].includes(routeName)) {
							return { display: "none" }
						}
						return
					})(route),
				})}
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
				name="MyTab"
				component={MyStackScreen}
				options={({ route }) => ({
					tabBarIcon: ({ focused, color }) => (
						<TabIcon name="person" color={color} isFocused={focused} />
					),
					tabBarLabel: 'MY',
					tabBarStyle: ((route) => {
						const routeName = getFocusedRouteNameFromRoute(route) ?? ""
						if (['EmailSignin', 'EmailSignup', 'WebView', 'WithDrawal', 'EditProfile', 'MyReview'].includes(routeName)) {
							return { display: "none" }
						}
						return
					})(route),
				})}
			/>
		</Tabs.Navigator>
	);
};
