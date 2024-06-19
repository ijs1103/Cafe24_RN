import LottieView from "lottie-react-native";
import { View } from "react-native";

export const LoadingView: React.FC = () => {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<LottieView style={{ width: 160, height: 160 }} autoPlay source={require('../../assets/loading.json')} />
		</View>
	)
};