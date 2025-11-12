import { Route, Routes, Navigate } from "react-router-native";
import { StyleSheet, View } from "react-native";
import RepositoryList from "./RepositoryList";
import SingleRepository from "./SingleRepository";
import AppBar from "./AppBar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignOut from "./SignOut";
import CreateReview from "./CreateReview";
import Notification from "./Notification";
import RepositoryResultsFilter from "./RepositoryResultsFilter";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e1e4e8",
	},
});

const Main = () => {
	return (
		<View style={styles.container}>
			<AppBar />
			<Notification />
			<Routes>
				<Route path="/" element={<RepositoryList />} />
				<Route path="/repository/:id" element={<SingleRepository />} />
				<Route path="/create-review" element={<CreateReview />} />
				<Route path="/login" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/logout" element={<SignOut />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</View>
	);
};

export default Main;
