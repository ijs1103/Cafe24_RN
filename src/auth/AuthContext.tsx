import { createContext } from 'react';
import { User, SIGNUP_TYPE } from '../utils/Types';

export interface AuthContextProps {
	initialized: boolean;
	user: User | null;
	signup: (type: SIGNUP_TYPE, email?: string, password?: string, name?: string) => Promise<void>;
	processingSignup: boolean;
	signin: (email: string, password: string) => Promise<void>;
	processingSignin: boolean;
	updateProfileImage: (filepath: string) => Promise<void>;
	googleSignin: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
	initialized: false,
	user: null,
	signup: async () => { },
	processingSignup: false,
	signin: async () => { },
	processingSignin: false,
	updateProfileImage: async () => { },
	googleSignin: async () => { },
});
