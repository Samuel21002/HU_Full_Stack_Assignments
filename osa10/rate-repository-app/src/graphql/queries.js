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

