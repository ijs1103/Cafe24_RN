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
	signup: (type: SIGNUP_TYPE, email?: string, password?: string, name?: string) => Promise<void>;
	processingSignup: boolean;
	signin: (email: string, password: string) => Promise<void>;
	processingSignin: boolean;
	updateProfileImage: (filepath: string) => Promise<void>;
	googleSignin: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
	initialized: false,
	user: null,
	signup: async () => { },
	processingSignup: false,
	signin: async () => { },
	processingSignin: false,
	updateProfileImage: async () => { },
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
					profileUrl: undefined
				});
			} else {
				setUser(null);
			}
			setInitialized(true);
		})
		return unSubscribe
	}, []);

	const signup = useCallback(
		async (type: SIGNUP_TYPE, email?: string, password?: string, name?: string) => {
			setProcessingSignup(true);
			try {
				let currentUser: FirebaseAuthTypes.User;
				if (type === SIGNUP.EMAIL_PASSWORD && email && password) {
					const { user } = await auth().createUserWithEmailAndPassword(email, password);
					currentUser = user;
				} else {
					await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
					const { idToken } = await GoogleSignin.signIn();
					const googleCredential = auth.GoogleAuthProvider.credential(idToken);
					const { user } = await auth().signInWithCredential(googleCredential);
					currentUser = user;
				}
				await currentUser.updateProfile({ displayName: name });
				await firestore()
					.collection(COLLECTIONS.USERS)
					.doc(currentUser.uid)
					.set({
						userId: currentUser.uid,
						email: currentUser.email,
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
			await auth().signInWithCredential(googleCredential);
		} finally {
			setProcessingSignin(false);
		}
	}, []);


	const updateProfileImage = useCallback(
		async (filepath: string) => {
			if (user == null) {
				throw new Error('User is undefined');
			}
			const fileName = filepath.split('/')[filepath.length - 1]
			if (fileName == null) {
				throw new Error('filename is undefined');
			}
			const storageFilepath = `users/${user.userId}/${fileName}`;
			await storage().ref(storageFilepath).putFile(filepath);
			const url = await storage().ref(storageFilepath).getDownloadURL();
			await auth().currentUser?.updateProfile({ photoURL: url });
			await firestore().collection(COLLECTIONS.USERS).doc(user.userId).update({
				profileUrl: url,
			});
		},
		[user],
	);

	const signOut = useCallback(async () => {
		await auth().signOut();
		setUser(null);
	}, []);

	const value = useMemo(() => {
		return {
			initialized,
			user,
			signup,
			processingSignup,
			signin,
			processingSignin,
			updateProfileImage,
			googleSignin,
			signOut,
		};
	}, [
		initialized,
		user,
		signup,
		processingSignup,
		signin,
		processingSignin,
		updateProfileImage,
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