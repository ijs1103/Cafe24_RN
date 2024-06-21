import { useContext, useEffect } from 'react';
import { View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Typography } from '../../components/Typography';
import { Spacer } from '../../components/Spacer';
import auth from '@react-native-firebase/auth';
import GoogleButton from '../../../assets/google_button.svg';
import { AuthContext } from '../../auth/AuthContext';

export const SigninLayout: React.FC = () => {
	const { googleSignin } = useContext(AuthContext);

	return (
		<ImageBackground style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 36 }} source={require('../../../assets/login_bg.jpg')} resizeMode='cover'>
			<Image style={{ width: 240, height: 240 }} source={require('../../../assets/logo.png')} />
			<TouchableOpacity onPress={googleSignin}>
				<GoogleButton />
			</TouchableOpacity>
		</ImageBackground>
	)
}