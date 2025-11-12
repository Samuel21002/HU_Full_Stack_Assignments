import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../graphql/mutations';
import { useSignIn } from './userSignin';

const useSignUp = () => {
	const [mutate, result] = useMutation(SIGN_UP);
	const [signIn] = useSignIn();

	const signUp = async ({ username, password }) => {
		const { data, errors } = await mutate({
			variables: { username, password },
		});
		if (!errors && data && data.createUser) {
			await signIn({ username, password });
		}
		return data;
	};

	return [signUp, result];
};

export { useSignUp };
