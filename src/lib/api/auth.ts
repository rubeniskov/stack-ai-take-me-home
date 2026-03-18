import { SUPABASE_URL, ANON_KEY } from "../constants";
import { AuthResponse } from "./types";

/**
 * Authenticates a user with the provided email and password.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the authentication token.
 * @throws An error if the authentication fails.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Apikey: ANON_KEY,
      },
      body: JSON.stringify({ email, password, gotrue_meta_security: {} }),
    },
  );

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  const data = await response.json();

  return data;
}

/**
 * Constructs the Authorization header value from the authentication response payload.
 * @param payload
 * @returns
 */
export const getAuthHeaders = (payload: AuthResponse) => {
  return {
    Authorization: `${payload.token_type} ${payload.access_token}`,
  };
};
