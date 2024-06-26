import { useState, useCallback, useEffect } from 'react';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { COLLECTIONS } from '../utils/Constants';
import storage from '@react-native-firebase/storage';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../providers/AuthProvider';
import { Review, User } from '../utils/Types';

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

	const addReview = useCallback(async (review: Review) => {
		try {
			setProcessingFirebase(true)
			await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.doc(review.reviewId)
			.set({
				...review
			})
		} finally {
			setProcessingFirebase(false)
		}
	}, []);

	const getReviews = useCallback(async ({ cafeId }: Pick<Review, 'cafeId'>) => {
		try {
			setProcessingFirebase(true)
			const snapshot = await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.where('cafeId', '==', cafeId).get()
			return snapshot.docs.map(doc => doc.data())
		} finally {
			setProcessingFirebase(false)
		}
	}, []);

	const deleteReview = useCallback(async ({ userId, cafeId }: Pick<Review, 'userId' | 'cafeId'>) => {
		try {
      setProcessingFirebase(true)
			await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.doc(`${userId}_${cafeId}`)
			.delete()
    } finally {
      setProcessingFirebase(false)
    }
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
		processingFirebase, updateUserName, updateProfileImage, deleteUser, addReview, getReviews, deleteReview
	}
}