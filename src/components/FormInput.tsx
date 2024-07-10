import React, {
	memo,
	useRef,
	useCallback,
	useEffect,
	RefObject,
} from 'react';
import {
	Animated,
	View,
	Text,
	TextInput,
	KeyboardTypeOptions,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import { Controller, Control } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import { REGEX, FORM_ERROR_MESSAGE, INPUT_LABEL, } from '../utils/Constants';
import { RegexType } from '../utils/Types';

interface Props {
	constraintslabel?: string;
	name: keyof RegexType;
	errorMsg?: string;
	textInputConfig: ITextInputConfig;
	control: Control<any>;
	passwordVal?: string;
	accessibilityHint?: string;
	onNext?: () => void;
	onClear: (name: string) => void
	inputRef?: RefObject<TextInput>;
}
type ITextInputConfig = {
	keyboardType?: KeyboardTypeOptions;
	maxLength?: number;
	placeholder?: string;
	secureTextEntry?: boolean;
};

const FormInput = ({
	constraintslabel,
	name,
	errorMsg,
	textInputConfig,
	control,
	passwordVal,
	onNext = () => { },
	inputRef,
	onClear
}: Props) => {
	const aniRef = useRef(new Animated.Value(0));
	const shake = useCallback(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(aniRef.current, {
					toValue: -6,
					duration: 50,
					useNativeDriver: true,
				}),
				Animated.timing(aniRef.current, {
					toValue: 6,
					duration: 50,
					useNativeDriver: true,
				}),
				Animated.timing(aniRef.current, {
					toValue: 0,
					duration: 50,
					useNativeDriver: true,
				}),
			]),
			{ iterations: 4 },
		).start();
	}, [aniRef]);

	useEffect(() => {
		if (!errorMsg) {
			return;
		}
		shake();
	}, [shake, errorMsg]);

	const isPwCheck = name === 'PASSWORD_CHECK';

	const rules = isPwCheck
		? {
			required: true,
			validate: {
				samePassword: (val: string) =>
					val === passwordVal || FORM_ERROR_MESSAGE[name],
			},
		}
		: {
			required: true,
			pattern: {
				value: REGEX[name] as RegExp,
				message: FORM_ERROR_MESSAGE[name],
			},
		};


	return (
		<Animated.View
			style={[
				styles.container,
				{
					transform: [{ translateX: aniRef.current }],
				},
			]}>
			<View style={styles.labelContainer}>
				<Text style={styles.label}>
					{INPUT_LABEL[name]}
				</Text>
				<Text style={styles.constraintslabel}>
					{constraintslabel}
				</Text>
			</View>
			<Controller
				control={control}
				name={name}
				rules={rules}
				render={({ field: { onChange, value } }) => (
					<View style={styles.inputContainer}>
						<TextInput
							style={errorMsg ? styles.errorInput : styles.input}
							onChangeText={onChange}
							value={value}
							autoCapitalize="none"
							onSubmitEditing={() => onNext()}
							ref={inputRef}
							{...textInputConfig}
						/>
						{value && <TouchableOpacity style={styles.clearButton} onPress={() => onClear(name)}>
							<Icon name="close-circle" size={24} color='dimgray' />
						</TouchableOpacity>}
					</View>
				)}
			/>
			{errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
		</Animated.View>
	);
}
export default memo(FormInput);

interface ICommonInput {
	backgroundColor: string;
	padding: number;
	paddingRight: number;
	borderRadius: number;
	fontSize: number;
	borderWidth: number;
}
const commonInput: ICommonInput = {
	backgroundColor: 'white',
	padding: 10,
	paddingRight: 40,
	borderRadius: 6,
	fontSize: 18,
	borderWidth: 1,
};
const styles = StyleSheet.create({
	container: {
		marginVertical: 16,
		width: '100%',
	},
	labelContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	inputContainer: {
		position: 'relative'
	},
	label: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 16,
	},
	constraintslabel: {
		marginLeft: 20,
		fontWeight: '300',
	},
	input: {
		...commonInput,
		borderColor: '#000',
		color: '#111'
	},
	errorInput: {
		...commonInput,
		borderColor: 'red',
		backgroundColor: '#FFC3C3',
	},
	errorMsg: {
		color: 'red',
		fontSize: 12,
		marginTop: 10,
	},
	clearButton: {
		position: 'absolute',
		top: '25%',
		right: 10,
	}
});
