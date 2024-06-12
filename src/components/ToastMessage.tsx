import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Animated, View, Text, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export interface ToastMessageRef {
	showToastMessage: () => void;
}

const ToastMessage = forwardRef<ToastMessageRef, { message: string; }>((props, ref) => {
	const translateYAnimation = useRef(new Animated.Value(100)).current;

	const showToastMessage = () => {
		Animated.sequence([
			Animated.timing(translateYAnimation, {
				toValue: 0,
				duration: 300,
				easing: Easing.out(Easing.circle),
				useNativeDriver: true,
			}),
			Animated.delay(2000),
			Animated.timing(translateYAnimation, {
				toValue: 100,
				duration: 500,
				easing: Easing.in(Easing.circle),
				useNativeDriver: true,
			}),
		]).start();
	};

	useImperativeHandle(ref, () => ({
		showToastMessage
	}));

	return (
		<Animated.View
			style={{
				position: 'absolute',
				bottom: 0,
				width: '100%',
				transform: [
					{
						translateY: translateYAnimation,
					},
				],
			}}
		>
			<View
				style={{
					backgroundColor: '#222',
					flexDirection: 'row',
					paddingVertical: 14,
					paddingHorizontal: 20,
					margin: 14,
					borderRadius: 4,
					alignItems: 'center',
				}}
			>
				<Icon name="checkmark-circle" color="white" size={24} />
				<Text style={{ color: 'white', fontSize: 15, marginLeft: 10 }}>
					{props.message}
				</Text>
			</View>
		</Animated.View>
	);
});
export default ToastMessage;