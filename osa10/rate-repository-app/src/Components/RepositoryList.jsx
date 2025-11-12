import { FlatList, View, StyleSheet } from "react-native";
import RepositoryListItem from "./RepositoryListItem";
import { useState, useMemo } from "react";
import useRepositories from '../hooks/useRepositories';
import RepositoryResultsFilter from './RepositoryResultsFilter';

const styles = StyleSheet.create({
	separator: {
		height: 10,
	},
	container: {
		flex: 1,
	},
	listContent: {
		paddingBottom: 20,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

// Presentational component that receives repositories as props
export const RepositoryListContainer = ({ repositories, filter, onFilterChange }) => {
	const repositoryNodes = repositories
		? repositories.edges.map((edge) => edge.node)
		: [];

	const ListHeaderComponent = () => (
		<RepositoryResultsFilter filter={filter} onFilterChange={onFilterChange} />
	);

	return (
		<FlatList
			data={repositoryNodes}
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) => <RepositoryListItem repository={item} />}
			keyExtractor={(item) => item.id}
			ListHeaderComponent={ListHeaderComponent}
			style={styles.container}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={true}
		/>
	);
};

// Container component that fetches data and passes it to the presentational component
const RepositoryList = () => {
	const [filter, setFilter] = useState({ Type: 'CREATED_AT', SortBy: 'DESC' });
	
	const variables = useMemo(() => ({
		orderBy: filter.Type,
		orderDirection: filter.SortBy,
	}), [filter.Type, filter.SortBy]);
	
	const { repositories, loading, error } = useRepositories(variables);
	
	if (loading) return null;
	if (error) return null;
	
	return (
		<View style={styles.container}>
			<RepositoryListContainer 
				repositories={repositories} 
				filter={filter} 
				onFilterChange={setFilter} 
			/>
		</View>
	);
};

export default RepositoryList;
