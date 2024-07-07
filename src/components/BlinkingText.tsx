import { useState, useEffect } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

export const BlinkingText: React.FC<{ text: string; }> = ({ text }) => {
	const [opacity] = useState(new Animated.Value(1));

	useEffect(() => {
		const blinkAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 0,
					duration: 600,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 600,
					useNativeDriver: true,
				}),
			])
		);

		blinkAnimation.start();

		return () => {
			blinkAnimation.stop();
		};
	}, [opacity]);

	return (
		<Animated.Text style={[styles.text, { opacity }]}>
			{text}
		</Animated.Text>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 18,
		color: 'saddlebrown',
	},
});