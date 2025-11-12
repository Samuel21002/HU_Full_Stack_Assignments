import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
	const [notification, setNotification] = useState(null);
	const timeoutRef = useRef(null);

	const showNotification = useCallback(
		(message, type = 'info', duration = 3000) => {
			// Clear any existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			
			setNotification({ message, type });
			
			if (duration > 0) {
				timeoutRef.current = setTimeout(() => {
					setNotification(null);
					timeoutRef.current = null;
				}, duration);
			}
		},
		[],
	);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const clearNotification = useCallback(() => setNotification(null), []);

	return (
		<NotificationContext.Provider
			value={{ notification, showNotification, clearNotification }}
		>
			{children}
		</NotificationContext.Provider>
	);
};
