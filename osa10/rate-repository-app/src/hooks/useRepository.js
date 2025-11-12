import { useQuery, NetworkStatus } from '@apollo/client';
import { GET_REPOSITORY } from '../graphql/queries';

const useRepository = (repositoryId, options = {}) => {
	const first = options.first || 5;

	const { data, loading, error, fetchMore, networkStatus } = useQuery(GET_REPOSITORY, {
		fetchPolicy: 'cache-and-network',
		variables: { repositoryId, first },
		skip: !repositoryId,
		notifyOnNetworkStatusChange: true,
	});

	const repository = data?.repository;
	const reviews = repository?.reviews?.edges?.map(edge => edge.node) || [];

	const handleFetchMore = () => {
		const isFetchingMore = networkStatus === NetworkStatus.fetchMore;
		const canFetchMore =
			!loading && !isFetchingMore && data?.repository?.reviews?.pageInfo?.hasNextPage;

		if (!canFetchMore) {
			return;
		}

		fetchMore({
			variables: {
				after: data.repository.reviews.pageInfo.endCursor,
				repositoryId,
				first,
			},
		});
	};

	return {
		repository,
		reviews,
		loading,
		error,
		fetchMore: handleFetchMore,
	};
};

export default useRepository;
