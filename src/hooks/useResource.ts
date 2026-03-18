"use client";

import { useQuery } from "@tanstack/react-query";
import { getResource } from "@/lib/api/drive";
import { useCredentials } from "./useCredentials";

export function useResource(connectionId?: string, resourceId?: string) {
  const credentials = useCredentials();

  return useQuery({
    queryKey: ["resource", connectionId, resourceId, credentials?.access_token],
    queryFn: () => getResource(credentials!, connectionId!, resourceId!),
    enabled: !!credentials && !!connectionId && !!resourceId,
  });
}
