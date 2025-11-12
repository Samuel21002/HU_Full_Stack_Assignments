import { Platform } from 'react-native';

const theme = {
	colors: {
		textPrimary: '#24292e',
		textPrimaryLight: '#7eb7f8ff',
		textSecondary: '#586069',
		headers: '#088d38ff',
		primary: '#0366d6',
		appbar: '#24292e',
		error: '#d73a49',
		errorText: '#ffffff',
	},
	fontSizes: {
		body: 14,
		subheading: 16,
	},
	fonts: Platform.select({
		android: 'Roboto-Regular, Roboto, sans-serif',
		ios: 'Arial, "San Francisco", -apple-system, sans-serif', 
		web: '"Helvetica Neue", Arial, Helvetica, sans-serif',
		default: 'system-ui, -apple-system, sans-serif',
	}),
	fontWeights: {
		normal: '400',
		bold: '700',
	},
	input: {
   	 	height: 40,
   	 	borderColor: '#586069',
   	 	borderWidth: 1,
   	 	marginBottom: 12,
   		paddingHorizontal: 8,
    	borderRadius: 4,
	},
};

export default theme;
