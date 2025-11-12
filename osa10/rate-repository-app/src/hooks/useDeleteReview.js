import { useMutation } from '@apollo/client';
import { DELETE_REVIEW } from '../graphql/mutations';

const useDeleteReview = () => {
	const [deleteReview, { loading }] = useMutation(DELETE_REVIEW);

	const remove = async (id, refetch) => {
		try {
			const { data } = await deleteReview({
				variables: {
					deleteReviewId: id,
				},
			});

			if (data?.deleteReview) {
				await refetch();
				return true;
			}
			return false;
		} catch {
			// Error deleting review
			return false;
		}
	};

	return [remove, { loading }];
};

export default useDeleteReview;
