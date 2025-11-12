import { View, StyleSheet, FlatList, Pressable, Alert, Platform } from "react-native";
import { useNavigate } from "react-router-native";
import useCurrentUser from "../hooks/useCurrentUser";
import useDeleteReview from "../hooks/useDeleteReview";
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
		backgroundColor: "white",
		padding: 15,
		flexDirection: "row",
	},
	ratingContainer: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		borderWidth: 2,
		borderColor: theme.colors.primary,
		justifyContent: "center",
		alignItems: "center",
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
	repositoryName: {
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
		backgroundColor: "#e1e4e8",
	},
	buttonsContainer: {
		flexDirection: "row",
		padding: 15,
		backgroundColor: "white",
		gap: 15,
	},
	button: {
		flex: 1,
		padding: 15,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	viewButton: {
		backgroundColor: theme.colors.primary,
	},
	deleteButton: {
		backgroundColor: "#d73a4a",
	},
	buttonText: {
		color: "white",
		fontWeight: theme.fontWeights.bold,
		fontSize: theme.fontSizes.subheading,
	},
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review, onViewRepository, onDelete, showActions }) => {
	return (
		<View>
			<View style={styles.reviewItem}>
				<View style={styles.ratingContainer}>
					<Text style={styles.ratingText}>{review.rating}</Text>
				</View>
				<View style={styles.reviewContent}>
					<View style={styles.reviewHeader}>
						<Text style={styles.repositoryName}>
							{review.repository.fullName}
						</Text>
						<Text style={styles.date}>{formatDate(review.createdAt)}</Text>
					</View>
					<Text style={styles.reviewText}>{review.text}</Text>
				</View>
			</View>
			{showActions && (
				<View style={styles.buttonsContainer}>
					<Pressable
						style={[styles.button, styles.viewButton]}
						onPress={() => onViewRepository(review.repositoryId)}
					>
						<Text style={styles.buttonText}>View repository</Text>
					</Pressable>
					<Pressable
						style={[styles.button, styles.deleteButton]}
						onPress={() => onDelete(review.id)}
					>
						<Text style={styles.buttonText}>Delete review</Text>
					</Pressable>
				</View>
			)}
		</View>
	);
};

const MyReviews = () => {
	const { user, reviews, loading, error, refetch } = useCurrentUser(true);
	const [deleteReview] = useDeleteReview();
	const navigate = useNavigate();

	const handleViewRepository = (repositoryId) => {
		navigate(`/repository/${repositoryId}`);
	};

	const handleDelete = (reviewId) => {
		if (Platform.OS === 'web') {
			const confirmed = window.confirm(
				"Are you sure you want to delete this review?"
			);
			if (confirmed) {
				deleteReview(reviewId, refetch).then((success) => {
					if (!success) {
						window.alert("Failed to delete review");
					}
				});
			}
		} else {
			Alert.alert(
				"Delete review",
				"Are you sure you want to delete this review?",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "Delete",
						onPress: async () => {
							const success = await deleteReview(reviewId, refetch);
							if (!success) {
								Alert.alert("Error", "Failed to delete review");
							}
						},
						style: "destructive",
					},
				]
			);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<Text>Loading your reviews...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Text>Error loading reviews</Text>
			</View>
		);
	}

	if (!reviews || reviews.length === 0) {
		return (
			<View style={styles.errorContainer}>
				<Text>No reviews yet</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={reviews}
			renderItem={({ item }) => (
				<ReviewItem
					review={item}
					onViewRepository={handleViewRepository}
					onDelete={handleDelete}
					showActions={user && item.user && user.id === item.user.id} // Show actions only for own reviews
				/>
			)}
			keyExtractor={({ id }) => id}
			ItemSeparatorComponent={ItemSeparator}
			style={styles.container}
		/>
	);
};

export default MyReviews;
