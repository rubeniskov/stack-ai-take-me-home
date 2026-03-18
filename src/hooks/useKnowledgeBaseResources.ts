"use client";

import { useQuery } from "@tanstack/react-query";
import { listKnowledgeBaseResources } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useKnowledgeBaseResources(
  knowledgeBaseId?: string,
  path: string = "/",
) {
  const credentials = useCredentials();

  return useQuery({
    queryKey: [
      "kb-resources",
      knowledgeBaseId,
      path,
      credentials?.access_token,
    ],
    queryFn: () =>
      listKnowledgeBaseResources(credentials!, knowledgeBaseId!, path),
    enabled: !!credentials && !!knowledgeBaseId,
  });
}
