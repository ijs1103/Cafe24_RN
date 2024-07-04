import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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
			style={styles.container}
		>
			<View style={styles.subContainer}>
				<FlatList
					data={FILTER_TYPE_LIST}
					keyExtractor={(item) => item}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.button}
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

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	subContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	button: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 15,
	}
});