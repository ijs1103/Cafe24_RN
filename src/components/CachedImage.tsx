import FastImage, { ImageStyle } from 'react-native-fast-image'
import { StyleProp } from 'react-native';

interface Props {
	uri: string | undefined;
	emptyImage?: React.ReactNode
	style: StyleProp<ImageStyle>;
}

export const CachedImage: React.FC<Props> = ({ uri, emptyImage, style }) => {
	if (uri) {
		return <FastImage
			style={style}
			source={{ uri }}
		/>
	} else {
		return emptyImage
	}
};