import { FlatList, View, StyleSheet } from "react-native";
import RepositoryListItem from "./RepositoryListItem";
import { useEffect, useState } from "react";
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
	separator: {
		height: 10,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

// Presentational component that receives repositories as props
export const RepositoryListContainer = ({ repositories }) => {
	const repositoryNodes = repositories
		? repositories.edges.map((edge) => edge.node)
		: [];

	return (
		<FlatList
			data={repositoryNodes}
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) => <RepositoryListItem repository={item} />}
			keyExtractor={(item) => item.id}
		/>
	);
};

// Container component that fetches data and passes it to the presentational component
const RepositoryList = () => {
	const { repositories } = useRepositories();
	return <RepositoryListContainer repositories={repositories} />;
};

export default RepositoryList;
