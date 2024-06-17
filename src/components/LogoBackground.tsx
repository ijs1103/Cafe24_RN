import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ediya from '../../assets/cafe_logo/ediya.svg';
import Cafebene from '../../assets/cafe_logo/cafebene.svg';
import Hollys from '../../assets/cafe_logo/hollys.svg';
import Tomntoms from '../../assets/cafe_logo/tomntoms.svg';
import Twosomeplace from '../../assets/cafe_logo/twosomeplace.svg';
import Starbucks from '../../assets/cafe_logo/starbucks.svg';
import Mega from '../../assets/cafe_logo/mega.svg';
import Paik from '../../assets/cafe_logo/paik.svg';
import { FRANCHISE_CAFE } from '../utils/Types';

export const LogoBackground: React.FC<{ selectedCafe: FRANCHISE_CAFE | null; headerBgAnim: Animated.Value; }> = ({ selectedCafe, headerBgAnim }) => {
	return (
		<Animated.View
			style={{
				zIndex: -1,
				position: 'absolute',
				height: 300,
				width: '100%',
				opacity: headerBgAnim.interpolate({
					inputRange: [0, 100],
					outputRange: [1, 0],
				}),
			}}
		>
			{selectedCafe && <>
				{selectedCafe === '카페베네' && <Cafebene width={'100%'} height={300} opacity={0.3} />}
				{selectedCafe === '이디야' && <Ediya width={'100%'} height={300} opacity={0.3} />}
				{selectedCafe === '할리스' && <Hollys width={'100%'} height={300} opacity={0.3} />}
				{selectedCafe === '탐앤탐스' && <Tomntoms width={'100%'} height={300} opacity={0.3} />}
				{selectedCafe === '투썸플레이스' && <Twosomeplace width={'100%'} height={300} opacity={0.3} />}
				{selectedCafe === '스타벅스' && <Starbucks width={'100%'} height={300} opacity={0.3} />}
				{selectedCafe === '메가커피' && <Mega width={'100%'} height={300} opacity={0.3} />}
				{selectedCafe === '빽다방' && <Paik width={'100%'} height={300} opacity={0.3} />}
				<LinearGradient
					start={{ x: 0.5, y: 0.1 }}
					end={{ x: 0.5, y: 1 }}
					locations={[0, 1]}
					colors={['#faebd700', '#faebd7']}
					style={{
						position: 'absolute',
						height: 300,
						width: '100%',
					}}
				/>
			</>}
		</Animated.View>
	);
}
