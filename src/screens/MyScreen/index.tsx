import { View, Button } from 'react-native';
import { AuthView } from './SubViews/AuthView';
import { useContext } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { MyPageView } from './SubViews/MyPageView';
import { LoadingView } from '../../components/LoadingView';

export const MyScreen: React.FC = () => {
	const { user, processingSignin } = useAuth();

	if (processingSignin) {
		return (
			<LoadingView />
		);
	}

	return (
		<View style={{ flex: 1 }}>
			{user ? <MyPageView /> : <AuthView />}
		</View>
	);
};
