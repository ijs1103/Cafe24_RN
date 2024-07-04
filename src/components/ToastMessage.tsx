import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Animated, View, Text, Easing, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface ToastMessageRef {
	showToastMessage: (text: string, completion?: () => void) => void;
}

const ToastMessage = forwardRef<ToastMessageRef>((props, ref) => {
	const translateYAnimation = useRef(new Animated.Value(-200)).current;
	const [message, setMessage] = useState<string>('');

	const showToastMessage = (text: string, completion?: () => void) => {
		setMessage(text);
		Animated.sequence([
			Animated.timing(translateYAnimation, {
				toValue: 0,
				duration: 300,
				easing: Easing.out(Easing.circle),
				useNativeDriver: true,
			}),
			Animated.delay(2000),
			Animated.timing(translateYAnimation, {
				toValue: -200,
				duration: 500,
				easing: Easing.in(Easing.circle),
				useNativeDriver: true,
			}),
		]).start(() => {
			completion && completion()
		});
	};

	useImperativeHandle(ref, () => ({
		showToastMessage
	}));

	return (
		<Animated.View
			style={{
				position: 'absolute',
				top: 0,
				width: '100%',
				transform: [
					{
						translateY: translateYAnimation,
					},
				],
			}}
		>
			<View style={styles.subContainer}>
				<Icon name="checkmark-circle" color="white" size={24} />
				<Text style={styles.message}>
					{message}
				</Text>
			</View>
		</Animated.View>
	);
});

const styles = StyleSheet.create({
	subContainer: {
		backgroundColor: '#222',
		flexDirection: 'row',
		paddingVertical: 14,
		paddingHorizontal: 20,
		margin: 14,
		borderRadius: 4,
		alignItems: 'center',
	},
	message: {
		color: 'white',
		fontSize: 15,
		marginLeft: 10
	}
});

export default ToastMessage;