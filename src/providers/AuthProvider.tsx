import React, { createContext, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User, SIGNUP_TYPE } from '../utils/Types';
import { COLLECTIONS, SIGNUP } from '../utils/Constants';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

interface AuthContextProps {
	initialized: boolean;
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	emailSignup: (email: string, password: string, name: string) => Promise<void>;
	processingSignup: boolean;
	signin: (email: string, password: string) => Promise<void>;
	processingSignin: boolean;
	googleSignin: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
	initialized: false,
	user: null,
	setUser: () => { },
	emailSignup: async () => { },
	processingSignup: false,
	signin: async () => { },
	processingSignin: false,
	googleSignin: async () => { },
	signOut: async () => { },
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [initialized, setInitialized] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [processingSignup, setProcessingSignup] = useState(false);
	const [processingSignin, setProcessingSignin] = useState(false);

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
	]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	const context = useContext(AuthContext);
	return context;
};

export { AuthProvider, useAuth };