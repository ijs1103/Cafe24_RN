import { View, StyleSheet, Text, Touchable, TouchableOpacity } from "react-native";
import ImageView from "react-native-image-viewing";
import Icon from 'react-native-vector-icons/Ionicons';
import { ImageViewResourceType } from '../utils/Types';

interface Props {
	photoUrls: ImageViewResourceType[];
	visible: boolean;
	onRequestClose: () => void;
}

export const FullScreenImageSlider: React.FC<Props> = ({ photoUrls, visible, onRequestClose }) => {
	return (
		<ImageView
			HeaderComponent={({ imageIndex }) => {
				return (
					<View style={styles.headerContainer}>
						<TouchableOpacity onPress={onRequestClose}>
							<Icon name='close' size={30} color={'#fff'} />
						</TouchableOpacity>
						<Text style={styles.baseText}>
							<Text style={styles.whiteText}>{`${imageIndex + 1}`}</Text>
							<Text style={styles.grayText}>{` / ${photoUrls.length}`}</Text>
						</Text>
					</View>
				);
			}}
			images={photoUrls}
			imageIndex={0}
			keyExtractor={(_, index) => `${index}`}
			visible={visible}
			onRequestClose={onRequestClose}
		/>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
	},
	baseText: {
		fontSize: 20,
		fontWeight: '700'
	},
	whiteText: {
		color: '#fff'
	},
	grayText: {
		color: 'dimgray'
	}
})

