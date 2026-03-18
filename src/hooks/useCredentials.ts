"use client";

import { useAuth } from "./useAuth";
import { AuthResponse } from "@/lib/api/types";

export function useCredentials(): AuthResponse | null {
  const { data: session } = useAuth();
  if (!session) return null;

  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token || "",
    expires_in: session.expires_in || 0,
    expires_at: session.expires_at || 0,
    token_type: session.token_type,
  };
}
