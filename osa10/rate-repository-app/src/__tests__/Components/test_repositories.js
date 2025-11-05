import React from 'react';
import { render, screen, within } from '@testing-library/react-native';
import { NativeRouter } from 'react-router-native';
import { RepositoryListContainer } from '../../Components/RepositoryList';
import { formatCount } from '../../utils/formatting';

describe('RepositoryList', () => {
	describe('RepositoryListContainer', () => {
		it('renders repository information correctly', () => {
			const repositories = {
				totalCount: 8,
				pageInfo: {
					hasNextPage: true,
					endCursor:
						'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
					startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
				},
				edges: [
					{
						node: {
							id: 'jaredpalmer.formik',
							fullName: 'jaredpalmer/formik',
							description: 'Build forms in React, without the tears',
							language: 'TypeScript',
							forksCount: 1619,
							stargazersCount: 21856,
							ratingAverage: 88,
							reviewCount: 3,
							ownerAvatarUrl:
								'https://avatars2.githubusercontent.com/u/4060187?v=4',
						},
						cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
					},
					{
						node: {
							id: 'async-library.react-async',
							fullName: 'async-library/react-async',
							description: 'Flexible promise-based React data loader',
							language: 'JavaScript',
							forksCount: 69,
							stargazersCount: 1760,
							ratingAverage: 72,
							reviewCount: 3,
							ownerAvatarUrl:
								'https://avatars1.githubusercontent.com/u/54310907?v=4',
						},
						cursor:
							'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
					},
				],
			};

			render(
				<NativeRouter>
					<RepositoryListContainer repositories={repositories} />
				</NativeRouter>,
			);

			const repositoryItems = screen.getAllByTestId('repositoryItem');
			expect(repositoryItems).toHaveLength(repositories.edges.length);

			repositories.edges.forEach((edge, index) => {
				const repositoryItem = repositoryItems[index];
				const { node: repository } = edge;

				const withinRepository = within(repositoryItem);
				
				// Test repository information
				expect(withinRepository.getByText(repository.fullName)).toBeDefined();
				expect(withinRepository.getByText(repository.description)).toBeDefined();
				expect(withinRepository.getByText(repository.language)).toBeDefined();
				expect(withinRepository.getByText(formatCount(repository.forksCount))).toBeDefined();
				expect(withinRepository.getByText(formatCount(repository.stargazersCount))).toBeDefined();
				expect(withinRepository.getByText(formatCount(repository.ratingAverage))).toBeDefined();
				expect(withinRepository.getByText(formatCount(repository.reviewCount))).toBeDefined();
			});
		});
	});
});

