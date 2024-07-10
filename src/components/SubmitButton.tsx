import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

interface Props {
	title?: string;
	color?: string;
	onPress: () => void;
	isLoading?: boolean;
	disabled: boolean;
}

export const SubmitButton = ({
	title,
	color = '#2F2F33',
	onPress,
	isLoading,
	disabled = true
}: Props) => {
	return (
		<View style={styles.container}>
			<Pressable
				disabled={disabled}
				onPress={onPress}
				style={({ pressed }) =>
					!disabled
						? { ...btnStyle, backgroundColor: color }
						: {
							...btnStyle,
							backgroundColor: color,
							opacity: 0.6,
						}
				}>
				{isLoading ? (
					<ActivityIndicator color="white" />
				) : (
					<Text style={styles.text}>
						{title}
					</Text>
				)}
			</Pressable>
		</View>
	);
}

interface IBtnStyle {
	borderRadius: number;
	padding: number;
}

const btnStyle: IBtnStyle = {
	borderRadius: 10,
	padding: 12,
};

const styles = StyleSheet.create({
	text: {
		color: 'white',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
	},
	container: {
		width: '100%',
	},
	btnLayout: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		marginRight: 10,
	},
});
