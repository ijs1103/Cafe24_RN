import React from 'react';
import { View } from 'react-native';

export const Division: React.FC<{ separatorStyle?: boolean; }> = ({ separatorStyle }) => {
	return (
		<View style={{ width: '100%', height: separatorStyle ? 1 : 0.5, backgroundColor: separatorStyle ? 'wheat' : 'lightgray' }} />
	)
};