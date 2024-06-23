import { View, Button } from 'react-native';
import { AuthView } from './AuthView';
import { useContext } from 'react';
import { useAuth } from '../../providers/AuthProvider';

export const MyScreen: React.FC = () => {
	const { user, signOut } = useAuth();

	return (
		<View style={{ flex: 1 }}>
			{user ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Button onPress={signOut} title='로그아웃' />
			</View> : <AuthView />}
		</View>
	);
};
