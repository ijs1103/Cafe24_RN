import { useState, useCallback, useEffect } from 'react';
import firestore, { FirebaseFirestoreTypes, Timestamp } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { COLLECTIONS } from '../utils/Constants';
import storage from '@react-native-firebase/storage';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../providers/AuthProvider';
import { Review, ReviewWithUser, User } from '../utils/Types';

export const useFirebase = () => {
	const { user, setUser } = useAuth();
	const [processingFirebase, setProcessingFirebase] = useState(false);
	const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
	const [cafeReviews, setCafeReviews] = useState<ReviewWithUser[] | null>(null);
	const [cafeRatings, setCafeRatings] = useState<number>(0.0);

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

	const getCafeReviewsWithUser = useCallback(async (cafeId: string) => {
			let reviewsQuery = firestore()
				.collection<Review>(COLLECTIONS.REVIEWS)
				.where('cafeId', '==', cafeId)
				.orderBy('createdAt', 'desc')
				.limit(10);
			if (lastVisible) {
				reviewsQuery = reviewsQuery.startAfter(lastVisible);
			}
			const reviewsSnapshot = await reviewsQuery.get();
			if (reviewsSnapshot.empty) {
				setCafeReviews(null);
			}
			setLastVisible(reviewsSnapshot.docs[reviewsSnapshot.docs.length - 1]);
			const reviews = reviewsSnapshot.docs.map(doc => doc.data());
			const reviewsWithUser = await Promise.all(
				reviews.map(async (review) => {
					const userSnapshot = await firestore()
						.collection<User>(COLLECTIONS.USERS)
						.doc(review.userId)
						.get();
					const user = userSnapshot.data() as User;
					return {
						...review,
						userId: user.userId,
						userName: user.name,
						userProfileUrl: user.profileUrl,
					};
				})
			);
			setCafeReviews(reviewsWithUser);
	}, []);

	const resetCafeReviewsData = useCallback(() => {
		setLastVisible(null);
	}, []);

	const getCafeRatingsAverage = useCallback(async (cafeId: string) => {
		try {
			const reviewsSnapshot = await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.where('cafeId', '==', cafeId)
			.get();
			if (reviewsSnapshot.empty) {
				setCafeRatings(0.0);
				return;
			}
			const total = reviewsSnapshot.docs.map(doc => doc.data()).reduce((acc, review) => acc + review.rating, 0)
			const average = parseFloat((total / reviewsSnapshot.docs.length).toFixed(1));
			setCafeRatings(average);
		} catch(error) {
			console.log(error);
			setCafeRatings(0.0);
		}
	}, []);

	const deleteReview = useCallback(async (userId: string, cafeId: string) => {
		try {
      setProcessingFirebase(true)
			await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.doc(`${cafeId}_${userId}`)
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
		processingFirebase, setProcessingFirebase, updateUserName, updateProfileImage, deleteUser, addReview, getCafeReviewsWithUser, resetCafeReviewsData, getCafeRatingsAverage, deleteReview, cafeReviews, cafeRatings
	}
}