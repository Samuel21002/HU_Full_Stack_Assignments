import { useQuery } from '@apollo/client';
import { GET_SIGNED_IN_USER } from '../graphql/queries';

const useSignedInUser = () => {
	const { data, error, loading, refetch } = useQuery(GET_SIGNED_IN_USER, {
		fetchPolicy: 'cache-and-network',
	});

	const isSignedIn = !error && Boolean(data?.me);
	const user = data?.me || null;

	return {
		user,
		isSignedIn,
		loading,
		error,
		refetch,
	};
};

export default useSignedInUser;