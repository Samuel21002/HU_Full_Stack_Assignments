import { useApolloClient } from '@apollo/client';
import useAuthStorage from './useAuthStorage';

const useSignOut = () => {
	const authStorage = useAuthStorage();
	const apolloClient = useApolloClient();

	const signOut = async () => {
		// Remove access token from storage first (crucial order!)
		await authStorage.removeAccessToken();
		// Then reset Apollo Client's store
		await apolloClient.resetStore();
	};

	return signOut;
};

export default useSignOut;