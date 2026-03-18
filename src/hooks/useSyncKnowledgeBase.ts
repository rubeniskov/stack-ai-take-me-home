"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncKnowledgeBase } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useSyncKnowledgeBase() {
  const credentials = useCredentials();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (knowledgeBaseId: string) =>
      syncKnowledgeBase(credentials!, knowledgeBaseId),
    onSuccess: (_, knowledgeBaseId) => {
      queryClient.invalidateQueries({
        queryKey: ["kb-resources", knowledgeBaseId],
      });
    },
  });
}
