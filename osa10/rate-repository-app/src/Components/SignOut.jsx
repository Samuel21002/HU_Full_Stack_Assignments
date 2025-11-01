import { useEffect } from 'react';
import { useNavigate } from 'react-router-native';
import useSignOut from '../hooks/useSignOut';

const SignOut = () => {
	const signOut = useSignOut();
	const navigate = useNavigate();

	useEffect(() => {
		const performSignOut = async () => {
			await signOut();
			navigate('/');
		};

		performSignOut();
	}, [signOut, navigate]);

	return null; // This component doesn't render anything
};

export default SignOut;