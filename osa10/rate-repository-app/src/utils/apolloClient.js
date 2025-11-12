import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';
import { setContext } from '@apollo/client/link/context';

const createApolloClient = authStorage => {
	const authLink = setContext(async (_, { headers }) => {
		try {
			const accessToken = await authStorage.getAccessToken();
			return {
				headers: {
					...headers,
					authorization: accessToken ? `Bearer ${accessToken}` : '',
				},
			};
		} catch (e) {
			// eslint-disable-next-line no-console, no-undef
			console.log(e);
			return {
				headers,
			};
		}
	});

	return new ApolloClient({
		link: authLink.concat(
			new HttpLink({
				uri: Constants.expoConfig.extra.apolloUri,
			}),
		),
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						repositories: {
							// Cache repositories separately by their arguments to enable smooth filtering
							keyArgs: ['orderBy', 'orderDirection', 'searchKeyword'],
							// Merge function to handle pagination and updates
							merge(_existing = { edges: [] }, incoming) {
								return {
									...incoming,
									edges: incoming.edges || [],
								};
							},
						},
					},
				},
			},
		}),
	});
};

export default createApolloClient;
