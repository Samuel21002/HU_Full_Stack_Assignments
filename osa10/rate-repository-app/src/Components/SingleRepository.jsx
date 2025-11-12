import { View, StyleSheet, FlatList } from "react-native";
import { useParams } from "react-router-native";
import useRepository from "../hooks/useRepository";
import RepositoryItem from "./RepositoryItem";
import Text from "./Text";
import theme from "../theme";
import { formatDate } from "../utils/formatting";

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	reviewItem: {
		backgroundColor: 'white',
		padding: 15,
		flexDirection: 'row',
	},
	ratingContainer: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		borderWidth: 2,
		borderColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	ratingText: {
		color: theme.colors.primary,
		fontWeight: theme.fontWeights.bold,
		fontSize: theme.fontSizes.subheading,
	},
	reviewContent: {
		flex: 1,
	},
	reviewHeader: {
		marginBottom: 5,
	},
	username: {
		fontWeight: theme.fontWeights.bold,
		fontSize: theme.fontSizes.subheading,
		marginBottom: 2,
	},
	date: {
		color: theme.colors.textSecondary,
		fontSize: theme.fontSizes.body,
	},
	reviewText: {
		fontSize: theme.fontSizes.body,
		lineHeight: 20,
	},
	separator: {
		height: 10,
		backgroundColor: '#e1e4e8',
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryInfo = ({ repository }) => {
	return <RepositoryItem repository={repository} showGitHubButton={true} />;
};

const ReviewItem = ({ review }) => {
	return (
		<View style={styles.reviewItem}>
			<View style={styles.ratingContainer}>
				<Text style={styles.ratingText}>{review.rating}</Text>
			</View>
			<View style={styles.reviewContent}>
				<View style={styles.reviewHeader}>
					<Text style={styles.username}>{review.user.username}</Text>
					<Text style={styles.date}>{formatDate(review.createdAt)}</Text>
				</View>
				<Text style={styles.reviewText}>{review.text}</Text>
			</View>
		</View>
	);
};

const SingleRepository = () => {
	const { id } = useParams();
	const { repository, reviews, loading, error } = useRepository(id);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Loading repository...</Text>
			</View>
		);
	}

	if (error || !repository) {
		return (
			<View style={styles.errorContainer}>
				<Text>Repository not found</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={reviews}
			renderItem={({ item }) => <ReviewItem review={item} />}
			keyExtractor={({ id }) => id}
			ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
			ItemSeparatorComponent={ItemSeparator}
			style={styles.container}
		/>
	);
};

export default SingleRepository;
