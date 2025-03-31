/**
 * Type declarations for the Credential Management API
 */

export interface PasswordCredential extends Credential {
	password: string;
}

export interface PasswordCredentialData {
	id: string;
	password: string;
	name?: string;
	iconURL?: string;
}

export interface FederatedCredentialData {
	id: string;
	provider: string;
	name?: string;
	iconURL?: string;
	protocol?: string;
}

export interface CredentialCreationOptions {
	password?: PasswordCredentialData;
	federated?: FederatedCredentialData;
	publicKey?: PublicKeyCredentialCreationOptions;
}

// Augment the global interfaces for the Credential Management API
declare global {
	interface Window {
		PasswordCredential?: {
			new (data: PasswordCredentialData): PasswordCredential;
		};
		FederatedCredential?: {
			new (data: FederatedCredentialData): FederatedCredential;
		};
	}

	interface FederatedCredential extends Credential {
		provider: string;
		protocol?: string;
	}

	interface CredentialsContainer {
		create(options?: CredentialCreationOptions): Promise<Credential | null>;
		get(options?: CredentialRequestOptions): Promise<Credential | null>;
		store(credential: Credential): Promise<Credential>;
		preventSilentAccess(): Promise<void>;
	}
}
