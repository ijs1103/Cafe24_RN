import { StyleSheet, View } from 'react-native';
import { ScreenBannerAds } from '../screens/ScreenBannerAds';

interface Props {
	children?: React.ReactNode;
}

export const ScreenLayout: React.FC<Props> = ({ children }) => {
	return (
		<View style={styles.container}>
			<ScreenBannerAds />
			<View style={styles.contents}>
				{children}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	contents: {
		flex: 1
	},
})

