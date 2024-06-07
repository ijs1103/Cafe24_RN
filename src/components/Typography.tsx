import React from 'react';
import { Text } from 'react-native';

export const Typography: React.FC<{
	color?: string;
	fontSize?: number;
	numberOfLines?: number;
	children: React.ReactElement | string | React.ReactElement[];
}> = props => {
	return (
		<Text
			style={{
				color: props.color ?? 'black',
				fontSize: props.fontSize ?? 10,
			}}
			numberOfLines={props.numberOfLines}>
			{props.children}
		</Text>
	);
};
