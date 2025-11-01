import { useState, useEffect } from 'react';
import { GET_REPOSITORIES } from '../graphql/queries';
import { useQuery } from '@apollo/client';

const useRepositories = () => {
	const [repositories, setRepositories] = useState();
	const { data, error, loading: queryLoading, refetch } = useQuery(GET_REPOSITORIES, {
  		fetchPolicy: 'cache-and-network',
	});

	const fetchRepositories = async () => {
		if (data) {
			setRepositories(data.repositories);
		}
	};

	useEffect(() => {
		fetchRepositories();
	}, [data, error]);

	return { repositories, loading: queryLoading, refetch };
};

export default useRepositories;
