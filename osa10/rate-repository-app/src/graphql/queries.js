import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
	query Repositories {
		repositories {
			edges {
				node {
					id
					fullName
					ratingAverage
					reviewCount
					stargazersCount
					forksCount
					ownerAvatarUrl
					description
					language
				}
			}
		}
	}
`;

export const GET_SIGNED_IN_USER = gql`
	query Me {
		me {
			id
			username
		}
	}
`;

export const GET_REPOSITORY = gql`
	query Repository($repositoryId: ID!) {
		repository(id: $repositoryId) {
			id
			fullName
			reviewCount
			ratingAverage
			stargazersCount
			forksCount
			ownerAvatarUrl
			description
			language
			url
			reviews {
				edges {
					node {
						id
						text
						rating
						createdAt
						user {
							id
							username
						}
					}
				}
			}
		}
	}
`;
