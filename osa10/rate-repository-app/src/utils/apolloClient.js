import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import Constants from "expo-constants";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from '@apollo/client/utilities';

const createApolloClient = (authStorage) => {
	const authLink = setContext(async (_, { headers }) => {
		try {
			const accessToken = await authStorage.getAccessToken();
			return {
				headers: {
					...headers,
					authorization: accessToken ? `Bearer ${accessToken}` : "",
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
			})
		),
		cache: new InMemoryCache({
			typePolicies: {
				Query: {
					fields: {
						repositories: {
							keyArgs: ["orderBy", "orderDirection", "searchKeyword"],
							merge(existing, incoming, { args }) {
								if (!args) {
									return incoming;
								}

								if (!existing) {
									return incoming;
								}

								if (!args.after) {
									// This is a fresh query, not a fetchMore
									return incoming;
								}

								// This is a fetchMore call, merge the edges while preserving order
								const existingEdges = existing.edges || [];
								const incomingEdges = incoming.edges || [];

								return {
									...incoming,
									edges: [...existingEdges, ...incomingEdges],
								};
							},
						},
					},
				},
				Repository: {
					fields: {
						reviews: relayStylePagination(),
					},
				},
			},
		}),
	});
};

export default createApolloClient;
