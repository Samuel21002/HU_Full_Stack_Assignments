import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
	constructor(namespace = 'auth') {
		this.namespace = namespace;
	}

	async getAccessToken() {
		const credentials = await AsyncStorage.getItem(
			`${this.namespace}:credentials`,
		);
		return credentials ? JSON.parse(credentials).accessToken : null;
	}

	async setAccessToken(accessToken) {
		await AsyncStorage.setItem(
			`${this.namespace}:credentials`,
			JSON.stringify({ accessToken }),
		);
	}

	async removeAccessToken() {
		await AsyncStorage.removeItem(`${this.namespace}:credentials`);
	}
}

export default AuthStorage;
