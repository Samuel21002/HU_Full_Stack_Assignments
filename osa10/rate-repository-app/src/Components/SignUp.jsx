import { Pressable, View } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import Text from "./Text";
import TextInput from "./TextInput";
import theme from "../theme";
import { useSignUp } from "../hooks/userSignup";
import { useNavigate } from "react-router-native";
import { useNotification } from "../contexts/NotificationContext";

const styles = {
	button: {
		backgroundColor: "#007AFF",
		padding: 10,
		alignItems: "center",
		borderRadius: 4,
	},
	buttonText: {
		font: theme.fonts.main,
		color: "white",
		fontWeight: "bold",
	},
	container: {
		padding: 16,
		maxWidth: "50%", // Limit max width to 1/2 of the screen width
		alignSelf: "start",
	},
	errorText: {
		marginBottom: 12,
		marginTop: -8,
	},
};

const validationSchema = yup.object({
	username: yup.string().required("Username is required"),
	password: yup.string().min(8).required("Password is required"),
	password_again: yup
		.string()
		.oneOf([yup.ref("password"), null], "Password confirmation must match")
		.required("Password confirmation is required"),
});

// Pure form component for testing - only handles form presentation and validation
export const SignInForm = ({ onSubmit }) => {
	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
			password_again: "",
		},
		validationSchema,
		onSubmit: (values) => {
			onSubmit(values);
		},
	});
	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Username"
				value={formik.values.username}
				onChangeText={formik.handleChange("username")}
				onBlur={formik.handleBlur("username")}
				error={formik.touched.username && formik.errors.username}
			/>
			{formik.touched.username && formik.errors.username && (
				<Text color="error" style={styles.errorText}>
					{formik.errors.username}
				</Text>
			)}

			<TextInput
				secureTextEntry
				placeholder="Password"
				value={formik.values.password}
				onChangeText={formik.handleChange("password")}
				onBlur={formik.handleBlur("password")}
				error={formik.touched.password && formik.errors.password}
			/>
			{formik.touched.password && formik.errors.password && (
				<Text color="error" style={styles.errorText}>
					{formik.errors.password}
				</Text>
			)}

			<TextInput
				secureTextEntry
				placeholder="Password again"
				value={formik.values.password_again}
				onChangeText={formik.handleChange("password_again")}
				onBlur={formik.handleBlur("password_again")}
				error={formik.touched.password_again && formik.errors.password_again}
			/>
			{formik.touched.password_again && formik.errors.password_again && (
				<Text color="error" style={styles.errorText}>
					{formik.errors.password_again}
				</Text>
			)}

			<Pressable onPress={formik.handleSubmit} style={styles.button}>
				<Text style={styles.buttonText}>Sign Up</Text>
			</Pressable>
		</View>
	);
};

const SignIn = () => {
	const [signup] = useSignUp();
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	const onSubmit = async (values) => {
		const { username, password } = values;

		try {
			const data = await signup({ username, password });
			if (data && data.createUser) {
				navigate("/");
			}
		} catch (e) {
			// Handle sign-up error (e.g., show notification)
			showNotification(
				e.message || "Sign up failed. Please try again.",
				"error",
				5000
			);
		}
	};

	return <SignInForm onSubmit={onSubmit} />;
};

export default SignIn;
