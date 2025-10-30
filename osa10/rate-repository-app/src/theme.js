import { Platform } from 'react-native';

const theme = {
	colors: {
		textPrimary: '#24292e',
		textSecondary: '#586069',
		primary: '#0366d6',
		appbar: '#24292e',
		error: '#d73a49',
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
};

export default theme;
