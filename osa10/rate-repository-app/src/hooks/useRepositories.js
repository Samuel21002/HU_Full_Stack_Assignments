import { useMemo } from 'react';
import { GET_REPOSITORIES } from '../graphql/queries';
import { useQuery, NetworkStatus } from '@apollo/client';

const useRepositories = (variables, options = {}) => {
	const first = options.first || 5;

	const queryVariables = useMemo(
		() => ({
			orderBy: 'CREATED_AT',
			orderDirection: 'DESC',
			...variables,
			first,
		}),
		[variables, first],
	);

	const { data, error, loading, fetchMore, refetch, networkStatus } = useQuery(
		GET_REPOSITORIES,
		{
			variables: queryVariables,
			fetchPolicy: 'cache-first',
			notifyOnNetworkStatusChange: true,
		},
	);

	const repositories = data?.repositories;

	const handleFetchMore = () => {
		const isFetchingMore = networkStatus === NetworkStatus.fetchMore;
		const canFetchMore =
			!loading && !isFetchingMore && data?.repositories.pageInfo.hasNextPage;

		if (!canFetchMore) {
			return;
		}

		fetchMore({
			variables: {
				after: data.repositories.pageInfo.endCursor,
				...variables,
				first,
			},
		});
	};

	return { repositories, loading, fetchMore: handleFetchMore, refetch, error };
};

export default useRepositories;
