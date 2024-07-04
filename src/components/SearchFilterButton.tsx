import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Typography } from "./Typography";
import Icon from 'react-native-vector-icons/Ionicons';
import { FILTER_TYPE } from "../utils/Types";

interface SearchFilterProps {
	selectedFilter: FILTER_TYPE;
	isActive: boolean;
	SearchFilterButtonPressHandler: () => void;
}

export const SearchFilterButton: React.FC<SearchFilterProps> = ({ selectedFilter, isActive, SearchFilterButtonPressHandler }) => {
	return (
		<TouchableOpacity onPress={SearchFilterButtonPressHandler} style={{ flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 6, alignItems: 'center', gap: 4, backgroundColor: isActive ? 'floralwhite' : 'transparent', borderWidth: isActive ? 0 : 1, borderColor: isActive ? 'none' : 'gray', borderRadius: 12, elevation: isActive ? 5 : 0 }}>
			<Typography color='#444' fontSize={12}>{selectedFilter}</Typography>
			<Icon color='#444' name={isActive ? 'chevron-up' : 'chevron-down'} size={12} />
		</TouchableOpacity>
	);
}