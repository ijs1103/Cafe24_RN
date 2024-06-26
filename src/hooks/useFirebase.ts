import { useState, useCallback, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { COLLECTIONS } from '../utils/Constants';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../providers/AuthProvider';
import { User } from '../utils/Types';

export const useFirebase = () => {
	const { user, setUser } = useAuth();
	const [processingFirebase, setProcessingFirebase] = useState(false);

	const updateUserName = useCallback(async (uid: string, name: string) => {
		try {
			setProcessingFirebase(true)
			await auth().currentUser?.updateProfile({ displayName: name });	
			await firestore()
			.collection(COLLECTIONS.USERS)
			.doc(uid)
			.update({ name })
		} finally {
			setProcessingFirebase(false)
		}
	}, []);

	const updateProfileImage = useCallback(
		async (uid: string, filepath: string) => {
			const tempArray = filepath.split('/')
			const fileName = tempArray[tempArray.length - 1]
			const storageFilepath = `users/${uid}/${fileName}`;
			try {
				setProcessingFirebase(true)
				await storage().ref(storageFilepath).putFile(filepath);
				const url = await storage().ref(storageFilepath).getDownloadURL();
				await auth().currentUser?.updateProfile({ photoURL: url });
				await firestore().collection(COLLECTIONS.USERS).doc(uid).update({
					profileUrl: url,
				});
			} finally {
				setProcessingFirebase(false)
			}
		}, []);

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

	const myProfileSubscriber = useCallback(() => {
		const uid = auth().currentUser?.uid
		if (!uid) {
			return 
		}
		return firestore()
			.collection<User>(COLLECTIONS.USERS)
			.doc(uid)
			.onSnapshot(snapshot => {
				const data = snapshot.data()
				if (data) {
					setUser(data)
				}
			}, error => {
				throw new Error(error.message)
			})
	}, []);

	useEffect(() => {
		if (!user?.userId) return

		const unsubscribe = firestore()
			.collection<User>(COLLECTIONS.USERS)
			.doc(user.userId)
			.onSnapshot(snapshot => {
				const data = snapshot.data()
				if (data) {
					setUser(data)
				}
			}, error => {
				console.log('snapshot error - ', error.message)
			})
		return unsubscribe
	}, []);

	return {
		processingFirebase, updateUserName, updateProfileImage, deleteUser, myProfileSubscriber
	}
}