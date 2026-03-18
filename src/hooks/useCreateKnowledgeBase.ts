"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKnowledgeBase } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useCreateKnowledgeBase() {
  const credentials = useCredentials();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      connectionId,
      resourceIds,
    }: {
      connectionId: string;
      resourceIds: string[];
    }) => createKnowledgeBase(credentials!, connectionId, resourceIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases"] });
      queryClient.invalidateQueries({ queryKey: ["kb-resources"] });
    },
  });
}
