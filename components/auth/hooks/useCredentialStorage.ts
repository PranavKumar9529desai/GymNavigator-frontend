// After successful login, store the credentials
const storeCredentials = async (email: string, password: string): Promise<void> => {
	// Check if Credential Management API is supported
	if ('credentials' in navigator && window.PasswordCredential) {
		try {
			const cred = new window.PasswordCredential({
				id: email,
				password: password,
				name: email,
				iconURL: `${window.location.origin}/favicon.ico`,
			});
			await navigator.credentials.store(cred);
		} catch (e) {
			console.error('Error storing credentials:', e);
		}
	}
};

export function useCredentialStorage() {
	return {
		storeCredentials,
	};
} 