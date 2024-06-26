import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../components/Typography';
import { SubmitButton } from '../components/SubmitButton';
import { useMyStackNavigation } from '../navigation/RootNavigation';
import { Header } from '../components/header/Header';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../providers/AuthProvider';
import { useToastMessage } from '../providers/ToastMessageProvider';

export const WithDrawalScreen = () => {
	const navigation = useMyStackNavigation<'WithDrawal'>();
	const { user, signOut } = useAuth();
	const { showToastMessage } = useToastMessage();
	const { deleteUser, processingFirebase } = useFirebase();
	const goBackHandler = () => {
		navigation.goBack();
	}

	const withDrawal = async () => {
		try {
			if (user?.userId) {
				await deleteUser(user.userId)
				await signOut()
				showToastMessage('탈퇴 성공.', goBackHandler)
			}
		} catch {
			showToastMessage('알 수 없는 이유로 탈퇴에 실패하였습니다.')
		}
	}

	return (
		<View style={styles.container}>
			<Header goBackHandler={goBackHandler} noBorderLine />
			<View style={styles.subContainer}>
				<View style={styles.textContainer}>
					<Typography fontSize={24} fontWeight='800' >🙋 잠깐만요!</Typography>
					<Typography fontSize={22} color='dimgray'>탈퇴 시 계정 및 이용 기록은 모두 삭제되며, 삭제된 데이터는 복구가 불가능해요.{"\n"}그래도 탈퇴를 진행할까요?</Typography>
				</View>
				<View style={styles.buttonContainer}>
					<SubmitButton color='saddlebrown' title='유지하기' onPress={goBackHandler} disabled={false} />
					<SubmitButton color='gray' title='탈퇴하기' onPress={withDrawal} disabled={false} isLoading={processingFirebase} />
				</View>
			</View>
		</View >
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16
	},
	subContainer: {
		flex: 1,
		justifyContent: 'space-between',
	},
	textContainer: {
		alignItems: 'center',
		gap: 14
	},
	buttonContainer: {
		gap: 14
	}
})
