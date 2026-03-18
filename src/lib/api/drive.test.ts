import { describe, it, expect, vi } from "vitest";
import {
  listConnections,
  listKnowledgeBases,
  createKnowledgeBase,
  syncKnowledgeBase,
  listKnowledgeBaseResources,
} from "./drive";
import {
  Connection,
  ConnectorType,
  KnowledgeBase,
  KnowledgeBaseResource,
  PaginatedResponse,
  AuthResponse,
} from "./types";

global.fetch = vi.fn();

describe("driveApi", () => {
  const mockCredentials: AuthResponse = {
    access_token: "test-token",
    token_type: "Bearer",
    refresh_token: "test-refresh-token",
    expires_in: 3600,
    expires_at: Date.now() + 3600 * 1000,
  };

  it("lists connections correctly", async () => {
    const mockData: PaginatedResponse<Connection> = {
      data: [
        {
          connection_id: "conn-123",
          name: "My Drive",
          connector_type_id: ConnectorType.GDRIVE,
          auth_method: "oauth",
          org_id: "org-456",
          provider_id: "gdrive",
          connector_id: "ctor-789",
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ],
      next_cursor: null,
      current_cursor: null,
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await listConnections(mockCredentials);
    expect(result).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });

  it("lists knowledge bases correctly", async () => {
    const mockData: PaginatedResponse<KnowledgeBase> = {
      data: [
        {
          knowledge_base_id: "kb-123",
          connection_id: "conn-123",
          connection_source_ids: ["src-1", "src-2"],
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
        },
      ],
      next_cursor: null,
      current_cursor: null,
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await listKnowledgeBases(mockCredentials);
    expect(result).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });

  it("creates a knowledge base correctly", async () => {
    const mockData: KnowledgeBase = {
      knowledge_base_id: "kb-123",
      connection_id: "conn-123",
      connection_source_ids: ["src-1"],
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
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await createKnowledgeBase(mockCredentials, "conn-123", [
      "src-1",
    ]);
    expect(result.knowledge_base_id).toBe("kb-123");
    expect(result).toMatchSnapshot();
  });

  it("syncs a knowledge base correctly", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    await syncKnowledgeBase(mockCredentials, "kb-123");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/kb-123/sync"),
      {
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      },
    );
  });

  it("lists knowledge base resources correctly", async () => {
    const mockData: PaginatedResponse<KnowledgeBaseResource> = {
      data: [
        {
          resource_id: "res-123",
          inode_type: "file",
          inode_path: { path: "/test.txt" },
          status: "indexed",
        },
      ],
      next_cursor: null,
      current_cursor: null,
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await listKnowledgeBaseResources(mockCredentials, "kb-123");
    expect(result.data).toHaveLength(1);
    expect(result.data[0].resource_id).toBe("res-123");
    expect(result).toMatchSnapshot();
  });
});
