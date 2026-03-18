import { getAuthHeaders } from "./auth";
import { BASE_URL } from "../constants";
import {
  AuthResponse,
  Connection,
  ConnectorType,
  KnowledgeBase,
  KnowledgeBaseResource,
  PaginatedResponse,
  Resource,
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

/**
 * Lists knowledge bases for the authenticated user.
 */
export async function listKnowledgeBases(
  credentials: AuthResponse,
): Promise<KnowledgeBase[]> {
  const response = await fetch(`${BASE_URL}/v1/knowledge-bases`, {
    headers: getAuthHeaders(credentials),
  });

  if (!response.ok) {
    throw new Error("Failed to list knowledge bases");
  }

  const data: KnowledgeBase[] = await response.json();

  return data || [];
}

/**
 * List available resources under a connection.
 * @param credentials
 * @param connectionId
 * @param resourceId Optional, if provided lists children of the resource.
 */
export async function listResources(
  credentials: AuthResponse,
  connectionId: string,
  resourceId?: string,
): Promise<PaginatedResponse<Resource>> {
  const url = new URL(
    `${BASE_URL}/v1/connections/${connectionId}/resources/children`,
  );
  if (resourceId) {
    url.searchParams.append("resource_id", resourceId);
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(credentials),
  });

  if (!response.ok) {
    throw new Error("Failed to list resources");
  }

  const data = await response.json();
  return {
    data: data.data || [],
    next_cursor: data.next_cursor || null,
    current_cursor: data.current_cursor || null,
  };
}

/**
 * Gets a single resource by ID.
 */
export async function getResource(
  credentials: AuthResponse,
  connectionId: string,
  resourceId: string,
): Promise<Resource> {
  const url = new URL(`${BASE_URL}/v1/connections/${connectionId}/resources`);
  url.searchParams.append("resource_id", resourceId);

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(credentials),
  });

  if (!response.ok) {
    throw new Error("Failed to get resource");
  }

  const data = await response.json();
  const resources = data.data || [];
  if (resources.length === 0) {
    throw new Error("Resource not found");
  }
  return resources[0];
}

/**
 * Creates a knowledge base.
 */
export async function createKnowledgeBase(
  credentials: AuthResponse,
  connectionId: string,
  resourceIds: string[],
): Promise<KnowledgeBase> {
  const response = await fetch(`${BASE_URL}/v1/knowledge-bases`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(credentials),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      connection_id: connectionId,
      connection_source_ids: resourceIds,
      indexing_params: {
        ocr: false,
        unstructured: true,
        embedding_params: {
          embedding_model: "openai.text-embedding-ada-002",
          api_key: null,
        },
        chunker_params: {
          chunk_size: 1500,
          chunk_overlap: 500,
          chunker: "sentence",
        },
      },
      org_level_role: null,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create knowledge base");
  }

  return response.json();
}

/**
 * Syncs a knowledge base.
 */
export async function syncKnowledgeBase(
  credentials: AuthResponse,
  knowledgeBaseId: string,
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/v1/knowledge-bases/${knowledgeBaseId}/sync`,
    {
      method: "POST",
      headers: getAuthHeaders(credentials),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to sync knowledge base");
  }
}

/**
 * Lists resources in a knowledge base.
 */
export async function listKnowledgeBaseResources(
  credentials: AuthResponse,
  knowledgeBaseId: string,
  path: string = "/",
): Promise<PaginatedResponse<KnowledgeBaseResource>> {
  const url = new URL(
    `${BASE_URL}/v1/knowledge-bases/${knowledgeBaseId}/resources/children`,
  );
  url.searchParams.append("resource_path", path);

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(credentials),
  });

  if (!response.ok) {
    throw new Error("Failed to list knowledge base resources");
  }

  const data = await response.json();
  return {
    data: data.data || [],
    next_cursor: data.next_cursor || null,
    current_cursor: data.current_cursor || null,
  };
}

/**
 * Deletes a resource from a knowledge base.
 */
export async function deleteKnowledgeBaseResource(
  credentials: AuthResponse,
  knowledgeBaseId: string,
  path: string,
): Promise<void> {
  const url = new URL(
    `${BASE_URL}/v1/knowledge-bases/${knowledgeBaseId}/resources`,
  );
  url.searchParams.append("resource_path", path);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(credentials),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resource_path: path,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete knowledge base resource");
  }
}
