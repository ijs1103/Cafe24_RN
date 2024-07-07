import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { ProgressBar } from "../components/ProgressBar";
import { BlinkingText } from '../components/BlinkingText';
import { Spacer } from "../components/Spacer";
import { useEffect } from "react";
import { useMainStackNavigation } from "../navigation/RootNavigation";
import { useCodePush } from "../hooks/useCodePush";

export const AppUpdatingScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'AppUpdating'>();
	const { progress, proceedUpdating } = useCodePush();

	useEffect(() => {
		proceedUpdating();
	}, []);

	useEffect(() => {
		if (progress?.receivedBytes == 100) {
			navigation.goBack();
		}
	}, [progress]);

	return (
		<View style={styles.container}>
			<LottieView style={styles.lottieView} autoPlay source={require('../../assets/etc/coffee_loading.json')} />
			<BlinkingText text='최신 버전 업데이트 중입니다 ...' />
			<Spacer space={20} />
			<ProgressBar width={240} total={progress?.totalBytes ?? 100} now={progress?.receivedBytes ?? 0} />
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'wheat',
	},
	lottieView: {
		width: 300,
		height: 300
	}
});