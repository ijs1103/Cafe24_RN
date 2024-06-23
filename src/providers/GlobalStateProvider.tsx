import { createContext, useState, useContext, useMemo } from "react"
import { LatLng } from "react-native-maps/lib/sharedTypes";

interface GlobalStateValueContextType {
	currentRegion: LatLng;
}

const GlobalStateValueContext = createContext<GlobalStateValueContextType>({
	currentRegion: { latitude: 37.526126, longitude: 126.922255 },
});

interface GlobalStateActionsContextType {
	setCurrentRegion(region: LatLng): void;
}

const GlobalStateActionsContext = createContext<GlobalStateActionsContextType>({ setCurrentRegion: () => { } });

const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [globalState, setGlobalState] = useState<GlobalStateValueContextType>({ currentRegion: { latitude: 37.526126, longitude: 126.922255 } });

	const actions = useMemo(() => ({
		setCurrentRegion(region: LatLng) {
			setGlobalState((prev) => ({ ...prev, currentRegion: region }))
		},
	}), []);

	return (
		<GlobalStateActionsContext.Provider value={actions}>
			<GlobalStateValueContext.Provider value={globalState}>
				{children}
			</GlobalStateValueContext.Provider>
		</GlobalStateActionsContext.Provider>
	);
}

const useGlobalStateValue = () => {
	const value = useContext(GlobalStateValueContext)
	return value
}

const useGlobalStateActions = () => {
	const actions = useContext(GlobalStateActionsContext)
	return actions
}

export { GlobalStateProvider, useGlobalStateValue, useGlobalStateActions }