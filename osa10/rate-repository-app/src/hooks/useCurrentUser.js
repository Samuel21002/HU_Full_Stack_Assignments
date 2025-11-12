import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '../graphql/queries';

const useCurrentUser = (includeReviews = false) => {
	const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
		fetchPolicy: 'cache-and-network',
		variables: { includeReviews },
	});

	const user = data?.me;
	const reviews = user?.reviews?.edges?.map(edge => edge.node) || [];

	return {
		user,
		reviews,
		loading,
		error,
		refetch,
	};
};

export default useCurrentUser;
