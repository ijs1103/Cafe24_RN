import { useEffect, useState } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';

export const SkeletonView: React.FC<{ size: { width: number; height: number; } }> = ({ size: { width, height } }) => {
	const [animated] = useState(new Animated.Value(0));

	const startAnimation = () => {
		Animated.loop(
			Animated.timing(animated, {
				toValue: 1,
				duration: 2000,
				easing: Easing.bezier(0.3, 0.49, 0.71, 0.5),
				useNativeDriver: false,
			}),
		).start();
	};

	const backgroundColor = animated.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: ['#EDF1F7', '#c7c9cc', '#EDF1F7'],
	});

	useEffect(() => {
		startAnimation();
	}, []);

	return (
		<View>
			<Animated.View style={[styles.skeleton, { width, height, backgroundColor }]} />
		</View>
	);
};

const styles = StyleSheet.create({
	skeleton: {
		alignSelf: 'center',
		borderRadius: 6,
		backgroundColor: '#EDF1F7',
	},
});

