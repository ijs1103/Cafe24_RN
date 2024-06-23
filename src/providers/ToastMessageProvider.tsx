import React, { createContext, useContext, useRef } from 'react';
import ToastMessage, { ToastMessageRef } from '../components/ToastMessage';

const ToastContext = createContext<ToastMessageRef>({ showToastMessage: () => { } });

const ToastMessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const toastMessageRef = useRef<ToastMessageRef>(null);

	const showToastMessage = (text: string, completion?: () => void) => {
		toastMessageRef.current?.showToastMessage(text, completion);
	};

	return (
		<ToastContext.Provider value={{ showToastMessage }}>
			{children}
			<ToastMessage ref={toastMessageRef} />
		</ToastContext.Provider>
	);
};

const useToastMessage = (): ToastMessageRef => {
	const context = useContext(ToastContext);
	return context;
};

export { ToastMessageProvider, useToastMessage }