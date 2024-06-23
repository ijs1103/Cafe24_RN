import { useContext, useEffect } from 'react';
import { View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Typography } from '../../components/Typography';
import { Spacer } from '../../components/Spacer';
import auth from '@react-native-firebase/auth';
import GoogleButton from '../../../assets/google_button.svg';
import { useMyStackNavigation } from '../../navigation/RootNavigation';
import { useAuth } from '../../providers/AuthProvider';

export const AuthView: React.FC = () => {
	const navigation = useMyStackNavigation<'My'>();
	const { googleSignin } = useAuth();
	const onPressEmailSignin = () => {
		navigation.navigate('EmailSignin')
	}
	const onPressEmailSignup = () => {
		navigation.navigate('EmailSignup')
	}
	return (
		<ImageBackground style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 36 }} source={require('../../../assets/login_bg.jpg')} resizeMode='cover'>
			<Image style={{ width: 240, height: 240 }} source={require('../../../assets/logo.png')} />
			<View>
				<TouchableOpacity onPress={googleSignin}>
					<GoogleButton />
				</TouchableOpacity>
				<Spacer space={20} />
				<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
					<TouchableOpacity onPress={onPressEmailSignin}>
						<Typography fontSize={16} fontWeight='600' color='gray'>이메일로 로그인</Typography>
					</TouchableOpacity>
					<Typography fontSize={16} fontWeight='600' color='gray'>|</Typography>
					<TouchableOpacity onPress={onPressEmailSignup}>
						<Typography fontSize={16} fontWeight='600' color='gray'>이메일 회원가입</Typography>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	)
}