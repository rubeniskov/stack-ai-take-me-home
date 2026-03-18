import { describe, it, expect, vi, beforeEach } from "vitest";
import { authenticate, getAuthHeaders } from "./auth";
import { AuthResponse } from "./types";
import { SUPABASE_URL, ANON_KEY } from "../constants";

global.fetch = vi.fn();

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should successfully authenticate and return AuthResponse", async () => {
      const mockAuthResponse: AuthResponse = {
        access_token: "test-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "test-refresh-token",
        expires_at: 1700000000,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthResponse,
      } as Response);

      const email = "test@example.com";
      const password = "password123";
      const result = await authenticate(email, password);

      expect(fetch).toHaveBeenCalledWith(
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
      expect(result).toEqual(mockAuthResponse);
    });

    it("should throw an error if authentication fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(
        authenticate("test@example.com", "wrong-password"),
      ).rejects.toThrow("Authentication failed");
    });
  });

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
