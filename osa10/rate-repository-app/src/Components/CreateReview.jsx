import { Pressable, View } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import Text from "./Text";
import TextInput from "./TextInput";
import theme from "../theme";
import useCreateReview from "../hooks/useCreateReview";

const styles = {
	button: {
		backgroundColor: "#007AFF",
		padding: 10,
		alignItems: "center",
		borderRadius: 4,
	},
	buttonText: {
		fontFamily: theme.fonts.main,
		color: "white",
		fontWeight: "bold",
	},
	container: {
		padding: 16,
		alignSelf: "center",
		maxWidth: 400,
		width: "100%",
	},
	errorText: {
		marginBottom: 12,
		marginTop: -8,
	},
	multilineInput: {
		height: 80,
		textAlignVertical: "top",
		paddingTop: 8,
	},
};

const validationSchema = yup.object().shape({
	ownerName: yup.string().required("Repository owner username is required"),
	repositoryName: yup.string().required("Repository name is required"),
	rating: yup
		.number()
		.typeError("Rating must be a number")
		.integer("Rating must be an integer")
		.min(0, "Rating must be at least 0")
		.max(100, "Rating must be at most 100")
		.required("Rating is required"),
	text: yup.string(),
});

export const CreateReviewForm = ({ onSubmit, error, loading }) => {
	const formik = useFormik({
		initialValues: {
			ownerName: "",
			repositoryName: "",
			rating: "",
			text: "",
		},
		validationSchema,
		onSubmit: (values) => {
			onSubmit({
				...values,
				rating: parseInt(values.rating),
			});
		},
	});

	return (
		<View style={styles.container}>
			{error && (
				<Text id="error-message" color="error" style={styles.errorText}>
					{error.message || error}
				</Text>
			)}
			<Text fontWeight="bold" fontSize="subheading">
				Create a review
			</Text>
			<TextInput
				placeholder="Repository owner name"
				value={formik.values.ownerName}
				onChangeText={formik.handleChange("ownerName")}
				onBlur={formik.handleBlur("ownerName")}
				error={formik.touched.ownerName && formik.errors.ownerName}
			/>
			{formik.touched.ownerName && formik.errors.ownerName && (
				<Text color="error" style={styles.errorText}>
					{formik.errors.ownerName}
				</Text>
			)}

			<TextInput
				placeholder="Repository name"
				value={formik.values.repositoryName}
				onChangeText={formik.handleChange("repositoryName")}
				onBlur={formik.handleBlur("repositoryName")}
				error={formik.touched.repositoryName && formik.errors.repositoryName}
			/>
			{formik.touched.repositoryName && formik.errors.repositoryName && (
				<Text color="error" style={styles.errorText}>
					{formik.errors.repositoryName}
				</Text>
			)}

			<TextInput
				placeholder="Rating between 0 and 100"
				value={formik.values.rating}
				onChangeText={formik.handleChange("rating")}
				onBlur={formik.handleBlur("rating")}
				error={formik.touched.rating && formik.errors.rating}
				keyboardType="numeric"
			/>
			{formik.touched.rating && formik.errors.rating && (
				<Text color="error" style={styles.errorText}>
					{formik.errors.rating}
				</Text>
			)}

			<TextInput
				placeholder="Review"
				value={formik.values.text}
				onChangeText={formik.handleChange("text")}
				onBlur={formik.handleBlur("text")}
				error={formik.touched.text && formik.errors.text}
				multiline={true}
				style={styles.multilineInput}
			/>
			{formik.touched.text && formik.errors.text && (
				<Text color="error" style={styles.errorText}>
					{formik.errors.text}
				</Text>
			)}

			<Pressable 
				onPress={formik.handleSubmit} 
				style={[styles.button, loading && { opacity: 0.7 }]}
				disabled={loading}
			>
				<Text style={styles.buttonText}>
					{loading ? "Creating review..." : "Create a review"}
				</Text>
			</Pressable>
		</View>
	);
};

const CreateReview = () => {
	const { submitReview, loading, error } = useCreateReview();

	const onSubmit = async (values) => {
		await submitReview(values);
	};

	return <CreateReviewForm onSubmit={onSubmit} error={error} loading={loading} />;
};

export default CreateReview;
