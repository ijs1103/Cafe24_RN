import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRootNavigation, useRootRoute } from '../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { Spacer } from './Spacer';

export const MyWebView: React.FC = () => {
	const navigation = useRootNavigation<'WebView'>();
	const routes = useRootRoute<'WebView'>();

	const onPressCloseButton = () => {
		navigation.goBack();
	};

	return (
		<View style={{ flex: 1 }}>
			
			<WebView source={{ uri: routes.params.uri ?? 'https://reactnative.dev/' }} />
		</View>
	);
}; 