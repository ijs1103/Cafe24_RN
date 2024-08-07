import { View, StyleSheet } from 'react-native';
import { AuthView } from './SubViews/AuthView';
import { useGlobalState } from '../../providers/GlobalStateProvider';
import { MyPageView } from './SubViews/MyPageView';
import { LoadingView } from '../../components/LoadingView';

export const MyScreen: React.FC = () => {
	const { user, processingSignin } = useGlobalState();

	if (processingSignin) {
		return (
			<LoadingView />
		);
	}

	return (
		<View style={styles.container}>
			{user ? <MyPageView /> : <AuthView />}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
