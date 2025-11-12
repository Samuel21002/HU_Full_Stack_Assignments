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
				cursor
			}
			pageInfo {
				startCursor
				hasNextPage
				hasPreviousPage
				endCursor
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
	query Repository($repositoryId: ID!, $first: Int, $after: String) {
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
			reviews(first: $first, after: $after) {
				totalCount
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
					cursor
				}
				pageInfo {
					endCursor
					startCursor
					hasNextPage
				}
			}
		}
	}
`;

export const GET_CURRENT_USER = gql`
	query getCurrentUser($includeReviews: Boolean = false) {
		me {
			id
			username
			reviews @include(if: $includeReviews) {
				edges {
					node {
						id
						text
						rating
						createdAt
						repositoryId
						user {
							id
							username
						}
						repository {
							id
							fullName
						}
					}
				}
			}
		}
	}
`;
