import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import { RootNavigation, Stack } from './src/navigation/RootNavigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabBar } from './src/components/tabbar/TabBar';

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar
					barStyle={isDarkMode ? 'light-content' : 'dark-content'}
					backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
				/>
				<NavigationContainer>
					<TabBar />
				</NavigationContainer>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default App;
