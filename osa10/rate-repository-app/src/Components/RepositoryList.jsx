import React, { useState, useMemo } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import RepositoryListItem from "./RepositoryListItem";
import { useDebounce } from "use-debounce";
import useRepositories from "../hooks/useRepositories";
import RepositoryResultsFilter from "./RepositoryResultsFilter";

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
export class RepositoryListContainer extends React.Component {
	renderHeader = () => {
		const { filter, onFilterChange, searchKeyword, onSearchChange } =
			this.props;

		return (
			<RepositoryResultsFilter
				filter={filter}
				onFilterChange={onFilterChange}
				searchKeyword={searchKeyword}
				onSearchChange={onSearchChange}
			/>
		);
	};

	render() {
		const { repositories, onEndReach } = this.props;
		const repositoryNodes = repositories
			? repositories.edges.map((edge) => edge.node)
			: [];

		return (
			<FlatList
				data={repositoryNodes}
				ItemSeparatorComponent={ItemSeparator}
				renderItem={({ item }) => <RepositoryListItem repository={item} />}
				keyExtractor={(item) => item.id}
				ListHeaderComponent={this.renderHeader}
				style={styles.container}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={true}
				onEndReached={onEndReach}
				onEndReachedThreshold={0.1}
			/>
		);
	}
}

// Container component that fetches data and passes it to the presentational component
const RepositoryList = () => {
	const [filter, setFilter] = useState({ Type: "CREATED_AT", SortBy: "DESC" });
	const [searchKeyword, setSearchKeyword] = useState("");
	const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500);

	const variables = useMemo(
		() => ({
			orderBy: filter.Type,
			orderDirection: filter.SortBy,
			searchKeyword: debouncedSearchKeyword,
		}),
		[filter.Type, filter.SortBy, debouncedSearchKeyword]
	);

	const { repositories, fetchMore } = useRepositories(variables, { first: 5 });

	const onEndReach = () => {
		fetchMore();
	};

	return (
		<View style={styles.container}>
			<RepositoryListContainer
				repositories={repositories}
				filter={filter}
				onFilterChange={setFilter}
				searchKeyword={searchKeyword}
				onSearchChange={setSearchKeyword}
				onEndReach={onEndReach}
			/>
		</View>
	);
};

export default RepositoryList;
