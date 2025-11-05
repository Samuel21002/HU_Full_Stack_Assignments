import { useState } from 'react';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import { CREATE_REVIEW } from '../graphql/mutations';

const useCreateReview = () => {
	const navigate = useNavigate();
	const [createReview, { loading }] = useMutation(CREATE_REVIEW);
	const [error, setError] = useState(null);

	const submitReview = async values => {
		const { ownerName, repositoryName, rating, text } = values;
		setError(null);

		try {
			const { data } = await createReview({
				variables: {
					review: {
						ownerName,
						repositoryName,
						rating,
						text,
					},
				},
			});

			if (data && data.createReview) {
				const repositoryId = data.createReview.repositoryId;
				navigate(`/repository/${repositoryId}`);
			}
		} catch (error) {
			setError(error);
		}
	};

	return {
		submitReview,
		loading,
		error,
	};
};

export default useCreateReview;
