import React, { useCallback, forwardRef } from "react";
import { View, Pressable, TouchableOpacity, Alert, Linking } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TrueSheet } from "@lodev09/react-native-true-sheet";
import Clipboard from '@react-native-clipboard/clipboard';
import { Typography } from './Typography';
import { Spacer } from './Spacer';
import { Division } from './Division';
import { CafeDTO } from '../utils/Interfaces';

interface BottomSheetProps {
	cafe: CafeDTO | null;
	toastMessageHandler: () => void;
	webViewHandler: () => void;
}

export const BottomSheet = forwardRef<TrueSheet, BottomSheetProps>(({ cafe, toastMessageHandler, webViewHandler }, ref) => {

	const copyToClipboard = useCallback((text?: string) => {
		if (!text) { return };
		Clipboard.setString(text);
	}, []);

	const onPressCall = useCallback(() => {
		if (!cafe?.phone) {
			toastMessageHandler();
			return;
		}
		Linking.openURL(`tel:${cafe?.phone}`)
	}, [cafe]);

	const onPressWebSite = useCallback(() => {

	}, []);

	const onPressShare = useCallback(() => {
		//TODO: dynamic links 

	}, []);

	const onPressGetDirections = useCallback(() => {
		//TODO: 길찾기 react-native-maps-directions
	}, []);

	return (
		<TrueSheet
			ref={ref}
			style={{
				elevation: 10
			}}
			sizes={['auto', 'large']}
			dimmed={false}
			cornerRadius={16}
			dismissible={false}
		>
			<View style={{ backgroundColor: 'white' }}>
				<View style={{ paddingHorizontal: 14, paddingVertical: 16 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography fontSize={18} fontWeight='800' color='rebeccapurple' numberOfLines={1}>{cafe?.place_name ?? '알 수 없음'}</Typography>
						<Icon name='heart' size={30} color='crimson' />
					</View>
					<Spacer space={20} />
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Icon name='star-sharp' size={16} color='gold' />
							<Typography fontSize={16} color='dimgray' fontWeight='600'>4.25</Typography>
						</View>
						<Spacer horizontal={true} space={4} />
						<Typography fontSize={16} color='darkgray'>•</Typography>
						<Spacer horizontal={true} space={4} />
						<Typography fontSize={16} color='dimgray' fontWeight='600'>리뷰 100개</Typography>
					</View>
					<Spacer space={10} />
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Typography fontSize={16} fontWeight='800'>{cafe?.distance ? `${cafe.distance}m` : '알 수 없음'}</Typography>
						<Spacer horizontal={true} space={4} />
						<Typography fontSize={16} color='darkgray'>•</Typography>
						<Spacer horizontal={true} space={4} />
						<Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => copyToClipboard(cafe?.address_name)}>
							<Typography fontSize={16} color='dimgray' fontWeight='600'>{cafe?.address_name ?? '알 수 없음'}</Typography>
							<Spacer horizontal={true} space={4} />
							<Icon name='copy-sharp' size={14} color='yellowgreen' />
						</Pressable>
					</View>
				</View>
				<Division />
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 16 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 26 }}>
						<TouchableOpacity onPress={onPressCall}>
							<Icon name='call' color={'gray'} size={24} />
						</TouchableOpacity>
						<TouchableOpacity onPress={webViewHandler}>
							<MCIcon name='web' color={'gray'} size={24} />
						</TouchableOpacity>
						<TouchableOpacity onPress={onPressShare}>
							<Icon name='share-social' color={'gray'} size={24} />
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={{ backgroundColor: 'rebeccapurple', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, alignItems: 'center' }} onPress={onPressGetDirections}>
						<Typography color='mintcream' fontSize={14}>길찾기</Typography>
					</TouchableOpacity>
				</View>
			</View>
		</TrueSheet>
	)
});