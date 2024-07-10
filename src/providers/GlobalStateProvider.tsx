import React, { createContext, useContext, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { LatLng } from "react-native-maps/lib/sharedTypes";
import { User } from '../utils/Types';
import { COLLECTIONS } from '../utils/Constants';

import ToastMessage, { ToastMessageRef } from '../components/ToastMessage';

interface GlobalStateContextProps {
	initialized: boolean;
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	emailSignup: (email: string, password: string, name: string) => Promise<void>;
	processingSignup: boolean;
	signin: (email: string, password: string) => Promise<void>;
	processingSignin: boolean;
	googleSignin: () => Promise<void>;
	signOut: () => Promise<void>;
	currentRegion: LatLng;
	setCurrentRegion: React.Dispatch<React.SetStateAction<LatLng>>;
	showToastMessage: (text: string, completion?: () => void) => void;
}

const GlobalStateContext = createContext<GlobalStateContextProps>({
	initialized: false,
	user: null,
	setUser: () => { },
	emailSignup: async () => { },
	processingSignup: false,
	signin: async () => { },
	processingSignin: false,
	googleSignin: async () => { },
	signOut: async () => { },
	currentRegion: { latitude: 37.526126, longitude: 126.922255 },
	setCurrentRegion: () => { },
	showToastMessage: () => { }
});

const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const toastMessageRef = useRef<ToastMessageRef>(null);
	const [initialized, setInitialized] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [processingSignup, setProcessingSignup] = useState(false);
	const [processingSignin, setProcessingSignin] = useState(false);
	const [currentRegion, setCurrentRegion] = useState<LatLng>({ latitude: 37.526126, longitude: 126.922255 });

	useEffect(() => {
		GoogleSignin.configure({
			webClientId: GOOGLE_WEB_CLIENT_ID,
		});

		const unSubscribe = auth().onAuthStateChanged(async firebaseUser => {
			if (firebaseUser != null) {
				setUser({
					userId: firebaseUser.uid,
					email: firebaseUser.email ?? '',
					name: firebaseUser.displayName ?? '',
					profileUrl: firebaseUser.photoURL ?? '',
				});
			} else {
				setUser(null);
			}
			setInitialized(true);
		})
		return unSubscribe
	}, []);

	const showToastMessage = useCallback((text: string, completion?: () => void) => {
		toastMessageRef.current?.showToastMessage(text, completion);
	}, []);

	const emailSignup = useCallback(
		async (email: string, password: string, name: string) => {
			setProcessingSignup(true);
			try {
				const { user } = await auth().createUserWithEmailAndPassword(email, password);
				await user.updateProfile({ displayName: name });
				await firestore()
					.collection(COLLECTIONS.USERS)
					.doc(user.uid)
					.set({
						userId: user.uid,
						email,
						name,
					});
			} finally {
				setProcessingSignup(false);
			}
		},
		[],
	);

	const signin = useCallback(async (email: string, password: string) => {
		try {
			setProcessingSignin(true);
			await auth().signInWithEmailAndPassword(email, password);
		} finally {
			setProcessingSignin(false);
		}
	}, []);

	const googleSignin = useCallback(async () => {
		try {
			setProcessingSignin(true);
			await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
			const { idToken } = await GoogleSignin.signIn();
			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			const userCredential = await auth().signInWithCredential(googleCredential);
			const user = userCredential.user
			let result = await firestore()
				.collection(COLLECTIONS.USERS)
				.doc(user.uid)
				.get()
			const isSignedUp = result.exists
			if (!isSignedUp) {
				await firestore()
					.collection(COLLECTIONS.USERS)
					.doc(user.uid)
					.set({
						userId: user.uid,
						email: user.email,
						name: user.displayName,
					});
			}
		} finally {
			setProcessingSignin(false);
		}
	}, []);

	const signOut = useCallback(async () => {
		await auth().signOut();
		setUser(null);
	}, []);

	const value = useMemo(() => {
		return {
			initialized,
			user,
			setUser,
			emailSignup,
			processingSignup,
			signin,
			processingSignin,
			googleSignin,
			signOut,
			currentRegion,
			setCurrentRegion,
			showToastMessage
		};
	}, [
		initialized,
		user,
		setUser,
		emailSignup,
		processingSignup,
		signin,
		processingSignin,
		googleSignin,
		signOut,
		currentRegion,
		setCurrentRegion,
		showToastMessage
	]);
	return (
		<GlobalStateContext.Provider value={value}>
			{children}
			<ToastMessage ref={toastMessageRef} />
		</GlobalStateContext.Provider>
	);
};

const useGlobalState = () => {
	const context = useContext(GlobalStateContext);
	return context;
};

export { GlobalStateProvider, useGlobalState };