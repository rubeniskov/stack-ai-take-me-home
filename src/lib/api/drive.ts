import { getAuthHeaders } from "./auth";
import { BASE_URL } from "../constants";
import {
  AuthResponse,
  Connection,
  ConnectorType,
  PaginatedResponse,
} from "./types";

/**
 * Retrieves a list of connections for the authenticated user.
 */
export async function listConnections(
  credentials: AuthResponse,
  provider: ConnectorType = ConnectorType.GDRIVE,
): Promise<Connection[]> {
  const response = await fetch(
    `${BASE_URL}/v1/connections?connection_provider=${provider}&limit=1`,
    {
      headers: getAuthHeaders(credentials),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to list connections");
  }

  const data: PaginatedResponse<Connection> = await response.json();
  return data.data || [];
}
