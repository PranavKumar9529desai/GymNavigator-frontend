"use server";

import {
  type ApiResult,
  signupClient,
} from "@/lib/AxiosInstance/Signup/sign-up-client";

/**
 * Server action to check if a user email already exists in the system
 * @param email The email address to check
 * @returns Response indicating whether the email exists
 */
export async function checkUserExists(
  email: string
): Promise<ApiResult<boolean>> {
  console.log("Checking if email exists:", email);
  return signupClient.checkUserExists(email);
}
