import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabBar } from './src/navigation/TabBar';
import { GlobalStateProvider } from './src/providers/GlobalStateProvider';
import CodePush from 'react-native-code-push';

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar
					barStyle={isDarkMode ? 'light-content' : 'dark-content'}
					backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
				/>
				<GlobalStateProvider>
					<NavigationContainer>
						<TabBar />
					</NavigationContainer>
				</GlobalStateProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

const codePushConfig = { checkFrequency: CodePush.CheckFrequency.MANUAL }
export default CodePush(codePushConfig)(App);
// export default App;