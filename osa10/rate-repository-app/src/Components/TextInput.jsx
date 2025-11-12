import { TextInput as NativeTextInput, StyleSheet } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  inputError: {
    borderColor: '#d73a49', // Red color for error state
  },
});

const TextInput = ({ error, style, ...props }) => {
  const inputStyle = [
    theme.input,
    error && styles.inputError,
    style,
  ];

  return <NativeTextInput style={inputStyle} {...props} />;
};

export default TextInput;