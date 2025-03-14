import axios, { type AxiosInstance } from 'axios';

/**
 * Axios instance for unauthenticated requests related to signup/login
 *
 * Available endpoints:
 * - POST signup - Create a new user (owner, trainer, client, sales)
 * - POST isexists - Check if a user exists by name or email
 * - POST isexist - Login functionality to check if email exists
 * - POST google/:role - Google signup with specific role
 *
 * @returns Configured AxiosInstance
 */
export const SignupReqConfig = async (): Promise<AxiosInstance> => {
  const SignupAxios: AxiosInstance = await axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 10000, // 10 second timeout
  });

  // Optional: Add response interceptor for common error handling
  SignupAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API request failed:', error);
      return Promise.reject(error);
    },
  );

  return SignupAxios;
};
