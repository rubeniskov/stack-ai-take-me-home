"use client";

import { useQuery } from "@tanstack/react-query";
import { listConnections } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useConnections() {
  const credentials = useCredentials();

  return useQuery({
    queryKey: ["connections", credentials?.access_token],
    queryFn: () => listConnections(credentials!),
    enabled: !!credentials,
  });
}
