"use client";

import { useQuery } from "@tanstack/react-query";
import { listKnowledgeBases } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useKnowledgeBases() {
  const credentials = useCredentials();

  return useQuery({
    queryKey: ["knowledge-bases", credentials?.access_token],
    queryFn: () => listKnowledgeBases(credentials!),
    enabled: !!credentials,
  });
}
