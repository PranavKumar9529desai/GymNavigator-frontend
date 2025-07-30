/**
 * Utility function to parse authentication errors from NextAuth
 * Handles both custom error formats and default NextAuth errors
 */
export const parseAuthError = (error: string): { message: string; code: string } => {
	// Default error message
	let message = 'Failed to sign in. Check your credentials.';
	let code = 'UNKNOWN_ERROR';
	
	try {
		// Try to parse as JSON (our custom error format)
		const errorData = JSON.parse(error);
		message = errorData.message || message;
		code = errorData.code || errorData.error || code;
	} catch {
		// If parsing fails, check for specific error types
		if (error === 'CredentialsSignin') {
			message = 'Invalid email or password. Please check your credentials and try again.';
			code = 'INVALID_CREDENTIALS';
		} else if (error.includes('network') || error.includes('fetch')) {
			message = 'Network error. Please check your connection and try again.';
			code = 'NETWORK_ERROR';
		} else if (error.includes('timeout')) {
			message = 'Request timed out. Please try again.';
			code = 'TIMEOUT_ERROR';
		} else if (error.includes('server')) {
			message = 'Server error. Please try again later.';
			code = 'SERVER_ERROR';
		} else {
			message = error;
		}
	}
	
	return { message, code };
};

/**
 * Get user-friendly error message based on error code
 */
export const getErrorMessage = (code: string): string => {
	const errorMessages: Record<string, string> = {
		'INVALID_CREDENTIALS': 'Invalid email or password. Please check your credentials and try again.',
		'USER_NOT_FOUND': 'No account found with this email address.',
		'ACCOUNT_DISABLED': 'Your account has been disabled. Please contact support.',
		'TOO_MANY_ATTEMPTS': 'Too many failed attempts. Please try again later.',
		'NETWORK_ERROR': 'Network error. Please check your connection and try again.',
		'TIMEOUT_ERROR': 'Request timed out. Please try again.',
		'SERVER_ERROR': 'Server error. Please try again later.',
		'SIGNUP_FAILED': 'Failed to create account. Please try again.',
		'AUTH_ERROR': 'An unexpected error occurred during authentication.',
		'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.',
	};
	
	return errorMessages[code] || errorMessages.UNKNOWN_ERROR;
}; 