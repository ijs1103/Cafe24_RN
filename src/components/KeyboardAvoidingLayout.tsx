import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";

export const KeyboardAvoidingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				{children}
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	)
};