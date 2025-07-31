import type { User } from 'next-auth';
import type { Rolestype, GymInfo } from '@/lib/api/types';

// Extended User interface for GymNavigator
export interface ExtendedUser extends User {
	id: string;
	name: string;
	email: string;
	role: Rolestype;
	gymInfo?: GymInfo;
}

// Auth handler types
export interface AuthHandlerResult {
	success: boolean;
	user?: ExtendedUser;
	error?: {
		code: string;
		message: string;
	};
}

// Google auth specific types
export interface GoogleAuthData {
	name: string;
	email: string;
	role: Rolestype;
}

// Credential auth types
export interface CredentialAuthData {
	email: string;
	password: string;
	name?: string;
	role?: Rolestype;
}

// Session types
export interface GymNavigatorSession {
	user: {
		id: string;
		name?: string;
		email?: string;
	};
	role: Rolestype;
	gym?: GymInfo;
	accessToken?: string;
}

// JWT token types
export interface GymNavigatorToken {
	id?: string;
	role?: Rolestype;
	gym?: GymInfo;
	accessToken?: string;
}
