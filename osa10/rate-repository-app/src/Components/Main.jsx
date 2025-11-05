import { Route, Routes, Navigate } from "react-router-native";
import { StyleSheet, View } from "react-native";
import RepositoryList from "./RepositoryList";
import SingleRepository from "./SingleRepository";
import AppBar from "./AppBar";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import CreateReview from "./CreateReview";

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		flexShrink: 1,
		backgroundColor: "#e1e4e8",
	},
});

const Main = () => {
	return (
		<View style={styles.container}>
			<AppBar />
			<Routes>
				<Route path="/" element={<RepositoryList />} />
				<Route path="/repository/:id" element={<SingleRepository />} />
				<Route path="/create-review" element={<CreateReview />} />
				<Route path="/login" element={<SignIn />} />
				<Route path="/logout" element={<SignOut />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</View>
	);
};

export default Main;
