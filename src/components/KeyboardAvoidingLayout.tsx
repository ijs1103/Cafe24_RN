import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, StyleSheet } from "react-native";

export const KeyboardAvoidingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				{children}
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});