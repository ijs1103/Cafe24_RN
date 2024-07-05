import { useState, useMemo, useEffect } from "react";
import { View, Image, StyleSheet, Button, SectionList, TouchableOpacity } from "react-native";
import { useMyStackNavigation } from "../../../navigation/RootNavigation";
import { useGlobalState } from "../../../providers/GlobalStateProvider";
import { Typography } from "../../../components/Typography";
import { Spacer } from "../../../components/Spacer";
import { MyPageItem } from "../../../components/ListItem/MyPageItem";
import { ProfileImageView } from "../../../components/ProfileImageView";
import { URL } from "../../../utils/Constants";

const ListFooterComponent: React.FC<{ signOutHandler: () => void; }> = ({ signOutHandler }) => {
	return (
		<TouchableOpacity style={styles.signOutButton} onPress={signOutHandler}>
			<Typography fontWeight='800' fontSize={16} color='dimgray'>로그아웃</Typography>
		</TouchableOpacity>
	);
};

export const MyPageView: React.FC = () => {
	const navigation = useMyStackNavigation<'My'>();
	const { user, signOut } = useGlobalState();

	const DATA = useMemo(() => [
		{ data: [{ title: '작성한 리뷰', onPress: () => { navigation.navigate('MyReview') } }] },
		{ data: [{ title: '프로필 수정', onPress: () => navigation.navigate('EditProfile') }, { title: '회원탈퇴', onPress: () => navigation.navigate('WithDrawal') }, { title: '개인정보 보호방침', onPress: () => navigation.navigate('WebView', { uri: URL.PRIVACY_POLICY }) }] }
	], []);

	return (
		<View style={styles.container}>
			<SectionList
				sections={DATA}
				keyExtractor={(item) => item.title}
				renderItem={({ item }) => <MyPageItem {...item} />}
				SectionSeparatorComponent={() => <Spacer space={16} />}
				ItemSeparatorComponent={() => <Spacer space={2} />}
				contentContainerStyle={{ padding: 30 }}
				ListHeaderComponent={() => <ProfileImageView uri={user?.profileUrl} name={user?.name} />}
				ListFooterComponent={() => <ListFooterComponent signOutHandler={signOut} />} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	signOutButton: {
		marginTop: 16,
		borderRadius: 10,
		backgroundColor: '#fff',
		padding: 10,
		alignItems: 'center'
	}
});