import { Pressable, View } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import Text from './Text';
import TextInput from './TextInput';
import theme from "../theme";

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

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
});

const SigninForm = ({ onSubmit }) => {
	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
    validationSchema,
		onSubmit: (values) => {
			// Only call onSubmit if form is valid
			if (formik.isValid) {
				onSubmit(values);
			}
		},
	});

	const handleSubmit = () => {
		// Mark all fields as touched to show validation errors
		formik.setTouched({
			username: true,
			password: true,
		});
		
		// Only proceed if form is valid
		if (formik.isValid) {
			formik.handleSubmit();
		}
	};

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
        <Text color="error" style={styles.errorText}>{formik.errors.username}</Text>
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
        <Text color="error" style={styles.errorText}>{formik.errors.password}</Text>
      )}
			
			<Pressable onPress={handleSubmit} style={styles.button}>
				<Text style={styles.buttonText}>Sign In</Text>
			</Pressable>
		</View>
	);
};

const SignIn = () => {
	const onSubmit = (values) => {
		console.log(values);
	};
	return <SigninForm onSubmit={onSubmit} />;
};

export default SignIn;
