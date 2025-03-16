"use server";

import {
  type ApiResult,
  type UserInfoResponse,
  authClient,
} from "@/lib/AxiosInstance/Signin/sign-in-client";

/**
 * Server action to check if a user email exists in the system
 * @param email The email address to check
 * @returns Response indicating whether the email exsists and any associated role
 */
export async function getUserByEmail(
  email: string
): Promise<ApiResult<UserInfoResponse>> {
  console.log("Checking email existence for:", email);
  return authClient.getUserInfo(email);
}
