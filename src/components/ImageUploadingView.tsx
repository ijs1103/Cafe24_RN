import { StyleSheet, View, FlatList, Text } from 'react-native';
import { ImageUploadingListHeader } from './ListItem/ImageUploadingListHeader';
import { ImageUploadingItem } from './ListItem/ImageUploadingItem';
import { Spacer } from './Spacer';

interface Props {
	label: string;
	imageUrls: string[];
	imageCloseHandler: (url: string) => void;
	openImagePicker: () => void;
}

export const ImageUploadingView: React.FC<Props> = ({ label, imageUrls, imageCloseHandler, openImagePicker }) => {
	return (
		<View>
			<Text style={styles.label}>{label}</Text>
			<FlatList
				data={imageUrls}
				renderItem={({ item }) => <ImageUploadingItem imageUrl={item} imageCloseHandler={() => imageCloseHandler(item)} />}
				keyExtractor={(item, index) => `${index}`}
				ListHeaderComponent={<ImageUploadingListHeader pressHandler={openImagePicker} />}
				ItemSeparatorComponent={() => <Spacer space={16} horizontal />}
				showsHorizontalScrollIndicator={false}
				horizontal />
		</View>
	);
}

const styles = StyleSheet.create({
	label: {
		fontSize: 16,
		color: '#333',
		fontWeight: 'bold',
		marginBottom: 12,
	},
})
