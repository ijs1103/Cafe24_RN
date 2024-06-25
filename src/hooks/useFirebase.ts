import { useState, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../utils/Constants';

export const useFirebase = () => {
	const [processingFirebase, setProcessingFirebase] = useState(false);
	const deleteUser = useCallback(async (uid: string) => {
		try {
			setProcessingFirebase(true)
			await firestore()
			.collection(COLLECTIONS.USERS)
			.doc(uid)
			.delete()
		} finally {
			setProcessingFirebase(false)
		}
	}, []);

	return {
		processingFirebase, deleteUser
	}
}