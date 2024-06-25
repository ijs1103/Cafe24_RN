import { useMemo } from "react";
import { View, Image, StyleSheet, Button, SectionList, TouchableOpacity } from "react-native";
import { useMyStackNavigation } from "../../../navigation/RootNavigation";
import { useAuth } from "../../../providers/AuthProvider";
import { Typography } from "../../../components/Typography";
import { Spacer } from "../../../components/Spacer";
import { MyPageItem } from "../../../components/ListItem/MyPageItem";
import { ProfileImageView } from "../../../components/ProfileImageView";

export const MyPageView: React.FC = () => {
	const navigation = useMyStackNavigation<'My'>();
	const { user, signOut } = useAuth();

	const DATA = useMemo(() => [
		{ data: [{ title: '작성한 리뷰', onPress: () => { } }] },
		{ data: [{ title: '정보 수정', onPress: () => { } }, { title: '회원탈퇴', onPress: () => { } }, { title: '개인정보 보호방침', onPress: () => { } }] }
	], []);

	const ListFooterComponent = () => {
		return (
			<TouchableOpacity style={styles.signOutButton} onPress={signOut}>
				<Typography fontWeight='800' fontSize={16} color='dimgray'>로그아웃</Typography>
			</TouchableOpacity>
		);
	};

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
				ListFooterComponent={ListFooterComponent} />
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