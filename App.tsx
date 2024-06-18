import { NavigationContainer } from '@react-navigation/native';
import React, { createContext, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabBar } from './src/navigation/TabBar';
import { LatLng } from 'react-native-maps';

// export const CurretRegionContext = createContext<LatLng>({
// 	latitude: 37.526126,
// 	longitude: 126.922255,
// });

interface RegionContextType {
	currentRegion: LatLng;
	setCurrentRegion: React.Dispatch<React.SetStateAction<LatLng>>;
}

export const CurretRegionContext = createContext<RegionContextType>({
	currentRegion: { latitude: 37.526126, longitude: 126.922255 },
	setCurrentRegion: () => { },
});

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';
	const [currentRegion, setCurrentRegion] = useState<LatLng>({
		latitude: 37.526126,
		longitude: 126.922255,
	});

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar
					barStyle={isDarkMode ? 'light-content' : 'dark-content'}
					backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
				/>
				<CurretRegionContext.Provider value={{ currentRegion, setCurrentRegion }}>
					<NavigationContainer>
						<TabBar />
					</NavigationContainer>
				</CurretRegionContext.Provider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default App;
