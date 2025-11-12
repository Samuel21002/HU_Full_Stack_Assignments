import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
	query Repositories(
		$after: String
		$first: Int
		$orderBy: AllRepositoriesOrderBy
		$orderDirection: OrderDirection
		$searchKeyword: String
	) {
		repositories(
			after: $after
			first: $first
			orderBy: $orderBy
			orderDirection: $orderDirection
			searchKeyword: $searchKeyword
		) {
			totalCount
			edges {
				node {
					id
					name
					ownerName
					fullName
					description
					language
					forksCount
					stargazersCount
					ratingAverage
					reviewCount
					ownerAvatarUrl
					url
					createdAt
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
