import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { RootNavigation } from './src/navigation/RootNavigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
			/>
			<NavigationContainer>
				<RootNavigation />
			</NavigationContainer>
		</SafeAreaView>
	);
};

export default App;
