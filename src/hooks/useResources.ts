"use client";

import { useQuery } from "@tanstack/react-query";
import { listResources } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useResources(connectionId?: string, resourceId?: string) {
  const credentials = useCredentials();

  return useQuery({
    queryKey: [
      "resources",
      connectionId,
      resourceId,
      credentials?.access_token,
    ],
    queryFn: () => listResources(credentials!, connectionId!, resourceId),
    enabled: !!credentials && !!connectionId,
  });
}
