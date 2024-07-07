import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
	width: number;
	total: number;
	now: number;
}

export const ProgressBar: React.FC<Props> = ({ width, total, now }) => {
	const loadingAnimRef = useRef(new Animated.Value(0));

	const startAnimation = useCallback(() => {
		Animated.timing(loadingAnimRef.current, {
			toValue: now / total,
			duration: 1000,
			useNativeDriver: false,
		}).start();
	}, [now, total]);

	useEffect(() => {
		startAnimation();
	}, [startAnimation]);

	const progressWidth = useMemo(() => {
		return loadingAnimRef.current.interpolate({
			inputRange: [0, 1],
			outputRange: [0, width],
			extrapolate: 'clamp',
		});
	}, [width]);

	const outerStyle = useMemo<StyleProp<ViewStyle>>(
		() => [styles.outer, { width }],
		[width],
	);

	return (
		<View style={outerStyle}>
			<Animated.View style={[styles.inner, { width: progressWidth }]} />
		</View>
	);
};

const styles = StyleSheet.create({
	outer: {
		height: 24,
		borderWidth: 2,
		borderRadius: 10,
		borderColor: 'saddlebrown',
		overflow: 'hidden'
	},
	inner: {
		height: '100%',
		backgroundColor: 'saddlebrown',
	},
});