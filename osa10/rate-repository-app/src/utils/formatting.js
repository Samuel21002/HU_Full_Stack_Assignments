export const formatDate = dateString => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-UK', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

export const formatCount = count => {
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k`;
	}
	return count.toString();
};
