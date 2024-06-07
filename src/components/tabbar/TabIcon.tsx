import Icon from 'react-native-vector-icons/Ionicons';

export const TabIcon: React.FC<{
	name: string;
	color: string;
	isFocused: boolean;
	size?: number;
}> = props => {
	return (
		<Icon
			name={props.isFocused ? props.name : `${props.name}-outline`}
			color={props.color}
			size={props.size ?? 24}
		/>
	);
};
