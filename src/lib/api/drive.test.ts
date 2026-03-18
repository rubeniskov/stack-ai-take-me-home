import { describe, it, expect, vi } from "vitest";
import { listConnections } from "./drive";
import { Connection, ConnectorType, PaginatedResponse } from "./types";

global.fetch = vi.fn();

describe("driveApi", () => {
  const mockToken = "test-token";

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

    const result = await listConnections(mockToken);
    expect(result).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });
});
