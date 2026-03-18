/**
 * Auth payload returned from the Stack AI API upon successful authentication. This includes the access token, refresh token, and expiration information.
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
}

/**
 * As defined by the Stack AI API documentation, these are the types that represent
 * the structure of the paginated data we receive from the API.
 */
export interface PaginatedResponse<T> {
  data: T[];
  next_cursor: string | null;
  current_cursor: string | null;
}

/**
 * Known providers for now, Extracted from the API response.
 * This can be extended in the future as we add more providers.
 */
export enum ConnectorType {
  GDRIVE = "gdrive",
}

/**
 * Represents the structure of a connection's data, including credentials and related information.
 */
export interface ConnectionData {
  credentials: {
    access_token: string;
    refresh_token: string;
    token_endpoint: string;
    client_id: string;
    client_secret: string;
    scopes: string[];
    expires_at: string; // ISO date string
  };
}

/**
 * Represents a connection to an external service (e.g., Google Drive) for a user.
 */
export interface Connection {
  connection_id: string;
  connector_id: string;
  provider_id: string;
  connector_type_id: ConnectorType;
  auth_method: string;
  org_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
