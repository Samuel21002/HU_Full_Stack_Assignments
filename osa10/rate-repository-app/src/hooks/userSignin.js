import { useMutation, useApolloClient } from '@apollo/client';
import { AUTHENTICATE_USER } from '../graphql/mutations';
import useAuthStorage from '../hooks/useAuthStorage';

const useSignIn = () => {
	const authStorage = useAuthStorage();
	const apolloClient = useApolloClient();
	const [mutate, result] = useMutation(AUTHENTICATE_USER);

	const signIn = async ({ username, password }) => {
		const { data } = await mutate({
			variables: { username, password },
		});
		if (data && data.authenticate.accessToken) {
			await authStorage.setAccessToken(data.authenticate.accessToken);
			await apolloClient.resetStore();
		}
		return data;
	};

	return [signIn, result];
};

export { useSignIn };
