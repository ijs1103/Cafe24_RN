import { View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Typography } from '../../components/Typography';
import { Spacer } from '../../components/Spacer';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GoogleButton from '../../../assets/google_button.svg';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { useEffect } from 'react';

export const SigninLayout: React.FC = () => {
	useEffect(() => {
		GoogleSignin.configure({
			webClientId: GOOGLE_WEB_CLIENT_ID,
		});
	}, []);

	const onPressGoogleButton = async () => {
		await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
		const { idToken } = await GoogleSignin.signIn();
		const googleCredential = auth.GoogleAuthProvider.credential(idToken);
		const userCredential = await auth().signInWithCredential(googleCredential);
	};

	return (
		<ImageBackground style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 36 }} source={require('../../../assets/login_bg.jpg')} resizeMode='cover'>
			<Image style={{ width: 240, height: 240 }} source={require('../../../assets/logo.png')} />
			<TouchableOpacity onPress={onPressGoogleButton}>
				<GoogleButton />
			</TouchableOpacity>
		</ImageBackground>
	)
}