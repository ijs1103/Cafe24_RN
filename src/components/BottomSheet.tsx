import React, { useCallback, forwardRef } from "react";
import { View, Pressable, TouchableOpacity, Alert, Linking, Share } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SizeInfo, TrueSheet } from "@lodev09/react-native-true-sheet";
import Clipboard from '@react-native-clipboard/clipboard';
import { Typography } from './Typography';
import { Spacer } from './Spacer';
import { Division } from './Division';
import { CafeDTO } from '../utils/Types';
import { RatingsAndReviews } from "./RatingsAndReviews";
import { useToastMessage } from "../providers/ToastMessageProvider";
import { useFirebase } from "../hooks/useFirebase";
import { LoadingView } from "./LoadingView";

interface BottomSheetProps {
	cafe: CafeDTO | null;
	webViewHandler: () => void;
	directionsHandler: () => void;
	isLiked: boolean;
	likeHandler: () => void;
	sheetSizeChangeHandler: () => void;
}

export const BottomSheet = forwardRef<TrueSheet, BottomSheetProps>(({ cafe, webViewHandler, directionsHandler, isLiked, likeHandler, sheetSizeChangeHandler }, ref) => {
	const { showToastMessage } = useToastMessage();

	const copyToClipboard = useCallback((text?: string) => {
		if (!text) { return };
		Clipboard.setString(text);
	}, []);

	const onPressCall = useCallback(() => {
		if (!cafe?.phone) {
			showToastMessage('전화번호가 제공되지 않습니다.');
			return;
		}
		Linking.openURL(`tel:${cafe?.phone}`)
	}, [cafe]);

	const onPressShare = useCallback(async () => {
		if (!cafe?.place_url) {
			Alert.alert('웹페이지가 존재하지 않습니다');
			return;
		}
		try {
			const result = await Share.share({
				message: cafe.place_url,
			});
			if (result.action !== Share.sharedAction) {
				Alert.alert('알 수 없는 이유로 공유하기 실패');
			}
		} catch (error: any) {
			Alert.alert(error.message);
		}
	}, [cafe]);

	const onSizeChange = (sizeInfo: SizeInfo) => {
		if (sizeInfo.index === 1) {
			sheetSizeChangeHandler();
		}
	};

	return (
		<TrueSheet
			ref={ref}
			style={{
				elevation: 10
			}}
			sizes={['auto', 'large']}
			dimmed={false}
			cornerRadius={16}
			onSizeChange={onSizeChange}
		>
			<View style={{ backgroundColor: 'white' }}>
				<View style={{ paddingHorizontal: 14, paddingVertical: 16 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography fontSize={18} fontWeight='800' color='rebeccapurple' numberOfLines={1}>{cafe?.place_name ?? '알 수 없음'}</Typography>
						<TouchableOpacity onPress={likeHandler}>
							<Icon name={isLiked ? 'heart' : 'heart-outline'} size={30} color='crimson' />
						</TouchableOpacity>
					</View>
					<Spacer space={20} />
					<RatingsAndReviews ratings={4.25} reviewsCount={100} />
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
					<TouchableOpacity style={{ backgroundColor: 'rebeccapurple', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, alignItems: 'center' }} onPress={directionsHandler}>
						<Typography color='mintcream' fontSize={14}>길찾기</Typography>
					</TouchableOpacity>
				</View>
			</View>
		</TrueSheet>
	)
});