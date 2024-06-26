import { View, Image, StyleSheet } from "react-native";
import { Typography } from "./Typography";
import CameraIcon from '../../assets/icon_camera_s.svg';
interface Props {
	uri?: string;
	name?: string;
	editMode?: boolean;
}

export const ProfileImageView: React.FC<Props> = ({ uri, name, editMode }) => {
	return (
		<View style={styles.avatarContainer} >
			<View>
				<Image style={styles.avatar} resizeMode="cover" source={uri ? { uri } : require('../../assets/no_avatar.jpg')} />
				{editMode && <CameraIcon style={styles.cameraIcon} width={36} height={36} />}
			</View>
			{!editMode && <Typography fontSize={20} fontWeight="800">{name ?? '닉네임을 설정해주세요.'}</Typography>}
		</View>
	);
};

const styles = StyleSheet.create({
	avatarContainer: {
		gap: 10,
		alignItems: 'center',
		marginVertical: 16,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: 'saddlebrown'
	},
	cameraIcon: {
		position: 'absolute',
		bottom: 0,
		right: 0
	}
});
