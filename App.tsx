import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabBar } from './src/navigation/TabBar';
import AuthProvider from './src/auth/AuthProvider';
import { GlobalStateProvider } from './src/globalState/GlobalStateProvider';

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar
					barStyle={isDarkMode ? 'light-content' : 'dark-content'}
					backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
				/>
				<AuthProvider>
					<GlobalStateProvider>
						<NavigationContainer>
							<TabBar />
						</NavigationContainer>
					</GlobalStateProvider>
				</AuthProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default App;
