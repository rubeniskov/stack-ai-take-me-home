import { describe, it, expect, vi } from "vitest";
import { getAuthHeaders } from "./auth";
import { AuthResponse } from "./types";

global.fetch = vi.fn();

describe("authApi", () => {
  describe("getAuthHeaders", () => {
    it("should return correct authorization headers", () => {
      const mockPayload: AuthResponse = {
        access_token: "test-access-token",
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: "test-refresh-token",
        expires_at: 1700000000,
      };

      const headers = getAuthHeaders(mockPayload);

      expect(headers).toEqual({
        Authorization: "Bearer test-access-token",
      });
    });
  });
});
