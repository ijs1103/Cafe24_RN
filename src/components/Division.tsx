import { View, StyleSheet } from 'react-native';

export const Division: React.FC<{ separatorStyle?: boolean; }> = ({ separatorStyle }) => {
	const styles = getStyles(separatorStyle);

	return (
		<View style={styles.container} />
	);
};

const getStyles = (separatorStyle?: boolean) => {
	return StyleSheet.create({
		container: {
			width: '100%',
			height: separatorStyle ? 1 : 0.5,
			backgroundColor: separatorStyle ? 'wheat' : 'lightgray'
		}
	})
};