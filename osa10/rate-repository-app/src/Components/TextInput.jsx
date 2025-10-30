import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: theme.colors.textSecondary,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  inputError: {
    borderColor: '#d73a49', // Red color for error state
  },
});

const TextInput = ({ error, style, ...props }) => {
  const inputStyle = [
    styles.input,
    error && styles.inputError,
    style,
  ];

  return <NativeTextInput style={inputStyle} {...props} />;
};

export default TextInput;