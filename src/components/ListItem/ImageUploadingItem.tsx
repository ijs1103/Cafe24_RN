import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CachedImage } from '../CachedImage';

interface Props {
	imageUrl: string;
	imageCloseHandler: () => void;
}

export const ImageUploadingItem: React.FC<Props> = ({ imageUrl, imageCloseHandler }) => {
	return (
		<TouchableOpacity style={styles.container}>
			<View style={styles.imageContainer}>
				<CachedImage style={styles.image} uri={imageUrl}  />
			</View>
			<TouchableOpacity style={styles.icon} onPress={imageCloseHandler}>
				<Icon name='close-circle' size={30} color={'#fff'} />
			</TouchableOpacity>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	imageContainer: {
		borderRadius: 8,
		width: 100,
		height: 100,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover'
	},
	icon: {
		position: 'absolute',
		top: 4,
		right: 4,
	}
})