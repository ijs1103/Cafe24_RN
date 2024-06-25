import { View, Image, StyleSheet } from "react-native";
import { Typography } from "./Typography";

export const ProfileImageView: React.FC<{ uri?: string; name?: string; }> = ({ uri, name }) => {
	return (
		<View style={styles.avatarContainer} >
			<Image style={styles.avatar} resizeMode="cover" source={uri ? { uri } : require('../../assets/no_avatar.jpg')} />
			<Typography fontSize={20} fontWeight="800">{name ?? '닉네임을 설정해주세요.'}</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	avatarContainer: {
		gap: 10,
		alignItems: 'center',
		marginVertical: 16
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: 'saddlebrown'
	},
});
