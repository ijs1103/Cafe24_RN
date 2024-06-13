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
			<View
				style={{
					flexDirection: 'row',
					height: 56,
					borderBottomColor: 'gray',
					borderBottomWidth: 1,
					alignItems: 'center',
				}}>
				<Spacer horizontal={true} space={12} />
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}>
					<Spacer horizontal={true} space={1} />
					<TouchableOpacity onPress={onPressCloseButton}>
						<Icon name='close' size={32} color={'black'} />
					</TouchableOpacity>
				</View>
				<Spacer horizontal={true} space={12} />
			</View>
			<WebView source={{ uri: routes.params.uri ?? 'https://reactnative.dev/' }} />
		</View>
	);
}; 