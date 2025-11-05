import { useQuery } from '@apollo/client';
import { GET_REPOSITORY } from '../graphql/queries';

const useRepository = repositoryId => {
	const { data, loading, error } = useQuery(GET_REPOSITORY, {
		fetchPolicy: 'cache-and-network',
		variables: { repositoryId },
		skip: !repositoryId,
	});

	const repository = data?.repository;
	const reviews = repository?.reviews?.edges?.map(edge => edge.node) || [];

	return {
		repository,
		reviews,
		loading,
		error,
	};
};

export default useRepository;
