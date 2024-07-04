import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMainStackNavigation, useMainStackRoute } from '../navigation/RootNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { Spacer } from '../components/Spacer';
import { Header } from '../components/header/Header';

export const WebViewScreen: React.FC = () => {
	const navigation = useMainStackNavigation<'WebView'>();
	const routes = useMainStackRoute<'WebView'>();

	const goBackHandler = () => {
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<Header goBackHandler={goBackHandler} />
			<WebView source={{ uri: routes.params.uri ?? 'https://reactnative.dev/' }} />
		</View>
	);
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});