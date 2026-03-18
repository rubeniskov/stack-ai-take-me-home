import { AuthResponse } from "./types";

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
