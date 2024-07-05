import { useState, useCallback, useEffect } from 'react';
import firestore, { FirebaseFirestoreTypes, Timestamp } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { COLLECTIONS } from '../utils/Constants';
import storage from '@react-native-firebase/storage';
import { v4 as uuid } from 'uuid';
import { useGlobalState } from '../providers/GlobalStateProvider';
import { Review, ReviewWithUser, User } from '../utils/Types';

export const useFirebase = () => {
	const { user, setUser } = useGlobalState();
	const [processingFirebase, setProcessingFirebase] = useState(false);
	const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
	const [myReviewLastVisible, setMyReviewLastVisible] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
	const [myReviews, setMyReviews] = useState<Review[] | null>(null);
	const [reviewsCount, setReviewsCount] = useState(0);
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
				await firestore().collection(COLLECTIONS.USERS).doc(uid).update({
					profileUrl: url,
				});
				await auth().currentUser?.updateProfile({ photoURL: url });
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
		await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.doc(review.reviewId)
			.set({
				...review
			})
	}, []);

	const getMyReviews = useCallback(async () => {
		if (!user?.userId) return
		try {
			setProcessingFirebase(true)
			let query = firestore()
				.collection<Review>(COLLECTIONS.REVIEWS)
				.where('userId', '==', user.userId)
				.orderBy('createdAt', 'desc')
				.limit(10);
			if (myReviewLastVisible) {
				query = query.startAfter(myReviewLastVisible);
			}
			const reviewsSnapshot = await query.get();
			if (reviewsSnapshot.empty) {
				return;
			}
			setMyReviewLastVisible(reviewsSnapshot.docs[reviewsSnapshot.docs.length - 1]);
			const reviews = reviewsSnapshot.docs.map(doc => doc.data());
			setMyReviews((prev) => {
				if (prev != null) {
					return prev.concat(reviews)
				} else {
					return reviews
				}
			})
		} finally {
			setProcessingFirebase(false)
		}
	}, []);

	const getReviewsCount = useCallback(async (cafeId: string) => {
		try {
			const reviews = await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.where('cafeId', '==', cafeId)
			.get()
			setReviewsCount(reviews.size)
		} catch {
			setReviewsCount(0)
		}
	}, []);

	const resetMyReviewsData = useCallback(() => {
		setMyReviewLastVisible(null);
		setMyReviews(null);
	}, []);

	const isMyReviewExisting = useCallback(async (cafeId: string, userId: string) => {
		const review = await firestore()
				.collection<Review>(COLLECTIONS.REVIEWS)
				.where('cafeId', '==', cafeId)
				.where('userId', '==', userId)
				.get()
		return (!review.empty)
	}, []);

	const getCafeReviewsWithUser = useCallback(async (cafeId: string) => {
			let query = firestore()
				.collection<Review>(COLLECTIONS.REVIEWS)
				.where('cafeId', '==', cafeId)
				.orderBy('createdAt', 'desc')
				.limit(10);
			if (lastVisible) {
				query = query.startAfter(lastVisible);
			}
			const reviewsSnapshot = await query.get();
			if (reviewsSnapshot.empty) {
				return;
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
			setCafeReviews((prev) => {
				if (prev != null) {
					return prev.concat(reviewsWithUser);
				} else {
					return reviewsWithUser;
				}
			});
	}, []);

	const resetCafeReviewsData = useCallback(() => {
		setLastVisible(null);
		setCafeReviews(null);
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
		await firestore()
			.collection<Review>(COLLECTIONS.REVIEWS)
			.doc(`${cafeId}_${userId}`)
			.delete()
	}, []);

	const uploadAndGetDownloadedUrls = async (cafeId: string, filePaths: string[]): Promise<string[]> => {
		const urls = [];
		for (const filePath of filePaths) {
			const fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
			const storageFilepath = `cafes/${cafeId}/${fileName}`;
			await storage().ref(storageFilepath).putFile(filePath);
			const url = await storage().ref(storageFilepath).getDownloadURL();
			urls.push(url);
		}
		return urls;
	}

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
		processingFirebase, 
		setProcessingFirebase, 
		updateUserName, 
		updateProfileImage, 
		deleteUser, 
		addReview, 
		isMyReviewExisting,
		getCafeReviewsWithUser, 
		resetCafeReviewsData, 
		getCafeRatingsAverage, 
		deleteReview, 
		cafeReviews, 
		cafeRatings,
		uploadAndGetDownloadedUrls,
		getMyReviews,
		myReviews,
		resetMyReviewsData,
		getReviewsCount,
		reviewsCount
	}
}