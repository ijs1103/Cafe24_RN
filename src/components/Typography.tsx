import React from 'react';
import { Text } from 'react-native';

export const Typography: React.FC<{
	color?: string;
	fontSize?: number;
	numberOfLines?: number;
	fontWeight?:
	| 'normal'
	| 'bold'
	| '100'
	| '200'
	| '300'
	| '400'
	| '500'
	| '600'
	| '700'
	| '800'
	| '900';
	children: React.ReactElement | string | React.ReactElement[];
}> = props => {
	return (
		<Text
			style={{
				color: props.color ?? 'black',
				fontSize: props.fontSize ?? 10,
				fontWeight: props.fontWeight ?? 'normal',
			}}
			numberOfLines={props.numberOfLines}>
			{props.children}
		</Text>
	);
};
