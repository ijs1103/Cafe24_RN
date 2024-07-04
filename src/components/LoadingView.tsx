import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export const LoadingView: React.FC = () => {
	return (
		<View style={styles.container}>
			<LottieView style={{ width: 160, height: 160 }} autoPlay source={require('../../assets/loading.json')} />
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});