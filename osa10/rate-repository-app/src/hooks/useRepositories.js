import { useMemo } from 'react';
import { GET_REPOSITORIES } from '../graphql/queries';
import { useQuery } from '@apollo/client';

const useRepositories = variables => {
	const queryVariables = useMemo(() => ({
		first: 30,
		orderBy: 'CREATED_AT',
		orderDirection: 'DESC',
		...variables,
	}), [variables]);
	
	const { data, error, loading, refetch } = useQuery(GET_REPOSITORIES, {
		variables: queryVariables,
		fetchPolicy: 'cache-first',
		notifyOnNetworkStatusChange: true,
	});

	const repositories = data?.repositories;

	return { repositories, loading, refetch, error };
};

export default useRepositories;
