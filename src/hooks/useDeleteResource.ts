"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteKnowledgeBaseResource } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useDeleteResource() {
  const credentials = useCredentials();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      knowledgeBaseId,
      path,
    }: {
      knowledgeBaseId: string;
      path: string;
    }) => deleteKnowledgeBaseResource(credentials!, knowledgeBaseId, path),
    onSuccess: (_, { knowledgeBaseId }) => {
      queryClient.invalidateQueries({
        queryKey: ["kb-resources", knowledgeBaseId],
      });
    },
  });
}
