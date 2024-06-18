import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { FILTER_TYPE_LIST } from '../utils/Constants';
import { FILTER_TYPE } from '../utils/Types';
import { Typography } from './Typography';

interface SearchFilterModalProps {
	isModalVisible: boolean;
	selectedFilter: FILTER_TYPE;
	toggleModal: () => void;
	filterPressHandler: (filter: FILTER_TYPE) => void;
}

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({ isModalVisible, selectedFilter, toggleModal, filterPressHandler }) => {
	return (
		<Modal
			isVisible={isModalVisible}
			onBackdropPress={toggleModal}
			backdropOpacity={0.5}
			style={{
				justifyContent: 'flex-end',
				margin: 0,
			}}
		>
			<View style={{
				backgroundColor: 'white',
				padding: 20,
				borderTopLeftRadius: 20,
				borderTopRightRadius: 20,
			}}>
				<FlatList
					data={FILTER_TYPE_LIST}
					keyExtractor={(item) => item}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingVertical: 15,
							}}
							onPress={() => filterPressHandler(item)}
						>
							<Typography color={(selectedFilter === item) ? 'saddlebrown' : 'gray'} fontSize={16}>{item}</Typography>
							{selectedFilter === item && <Icon name={'checkmark'} color={'saddlebrown'} size={22} />}
						</TouchableOpacity>
					)}
				/>
			</View>
		</Modal >
	);
};
