"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnections } from "@/hooks/useConnections";
import { useResources } from "@/hooks/useResources";
import { useResource } from "@/hooks/useResource";
import { KnowledgeBaseResource } from "@/lib/api/types";
import { listResources } from "@/lib/api/drive";
import { useCredentials } from "@/hooks/useCredentials";
import { useKnowledgeBases } from "@/hooks/useKnowledgeBases";
import { useKnowledgeBaseResources } from "@/hooks/useKnowledgeBaseResources";
import { useCreateKnowledgeBase } from "@/hooks/useCreateKnowledgeBase";
import { useSyncKnowledgeBase } from "@/hooks/useSyncKnowledgeBase";
import { useDeleteResource } from "@/hooks/useDeleteResource";
import { FilePickerSidebar } from "./sidebar";
import { FilePickerHeader } from "./header";
import { FilePickerTable } from "./table";
import { FilePickerFooter } from "./footer";
import { ConnectionNames } from "./constants";

export interface FilePickerProps {
  initialConnectionId?: string;
  initialFolderId?: string;
}

const normalizePath = (p: string) => p.replace(/^\/+|\/+$/g, "");

export function FilePicker({
  initialConnectionId,
  initialFolderId,
}: FilePickerProps) {
  const router = useRouter();
  const credentials = useCredentials();

  const { data: connections } = useConnections();

  // If initialConnectionId is provided, use it. Otherwise, use the first available connection.
  const currentConnectionId =
    initialConnectionId || connections?.[0]?.connection_id || null;

  const currentFolderId = initialFolderId;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  // Fetch current folder metadata to get parent ID or path
  const { data: currentFolderMetadata } = useResource(
    currentConnectionId || undefined,
    currentFolderId,
  );

  // Redirect to first connection if none selected
  useEffect(() => {
    if (!initialConnectionId && connections && connections.length > 0) {
      router.replace(`/browse/${connections[0].connection_id}`);
    }
  }, [initialConnectionId, connections, router]);

  const { data: resources, isLoading: isLoadingResources } = useResources(
    currentConnectionId || undefined,
    currentFolderId,
  );

  const rawPath = currentFolderMetadata?.inode_path.path || "/";
  const normalizedCurrentPath = normalizePath(rawPath);

  const { data: kbs } = useKnowledgeBases();
  const currentKb = useMemo(
    () => kbs?.find((kb) => kb.connection_id === currentConnectionId),
    [kbs, currentConnectionId],
  );

  const { data: kbResources } = useKnowledgeBaseResources(
    currentKb?.knowledge_base_id,
    rawPath,
  );

  const { data: rootKbResources } = useKnowledgeBaseResources(
    currentKb?.knowledge_base_id,
    "/",
  );

  const isCurrentFolderIndexed = useMemo(() => {
    if (!currentFolderMetadata || !rootKbResources?.data) return false;
    const currentPath = normalizePath(currentFolderMetadata.inode_path.path);

    // Check if any top-level indexed resource is a parent of current path
    return rootKbResources.data.some((r) => {
      const indexedPath = normalizePath(r.inode_path.path);
      return (
        currentPath === indexedPath || currentPath.startsWith(indexedPath + "/")
      );
    });
  }, [currentFolderMetadata, rootKbResources]);

  const currentConnection = useMemo(
    () => connections?.find((c) => c.connection_id === currentConnectionId),
    [connections, currentConnectionId],
  );

  const createKb = useCreateKnowledgeBase();
  const syncKb = useSyncKnowledgeBase();
  const deleteResource = useDeleteResource();

  const indexedResources = useMemo(() => {
    const map = new Map<string, KnowledgeBaseResource>();
    kbResources?.data.forEach((r) => {
      if (r.resource_id) {
        map.set(r.resource_id, r);
      }
      // Also map by path as a fallback for directories
      if (r.inode_path.path) {
        map.set(normalizePath(r.inode_path.path), r);
      }
    });
    return map;
  }, [kbResources]);

  const filteredResources = useMemo(() => {
    if (!resources?.data) return [];
    return resources.data.filter((r) =>
      r.inode_path.path
        .split("/")
        .pop()
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [resources, searchQuery]);

  const selectableResources = useMemo(() => {
    return (
      resources?.data?.filter(
        (r) =>
          !isCurrentFolderIndexed &&
          !indexedResources.has(r.resource_id) &&
          !indexedResources.has(normalizePath(r.inode_path.path)),
      ) || []
    );
  }, [resources, indexedResources, isCurrentFolderIndexed]);

  const handleToggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allSelected =
      selectableResources.length > 0 &&
      selectableResources.every((r) => selectedIds.has(r.resource_id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableResources.map((r) => r.resource_id)));
    }
  }, [selectableResources, selectedIds]);

  const handleFolderClick = (id: string) => {
    setSelectedIds(new Set());
    router.push(`/browse/${currentConnectionId}/${id}`);
  };

  const handleBack = useCallback(() => {
    setSelectedIds(new Set());
    // If we have parent information, we can try to go up one level
    // But connection resources don't expose parent_id directly in the current Resource type
    // If currentFolderId is missing, we are at root.
    // Since we don't have parent_id, we go to root as a fallback.
    router.push(`/browse/${currentConnectionId}`);
  }, [router, currentConnectionId]);

  const handleConnectionSelect = useCallback(
    (id: string) => {
      setSelectedIds(new Set());
      router.push(`/browse/${id}`);
    },
    [router],
  );

  const handleConfirm = useCallback(async () => {
    if (!currentConnectionId || selectedIds.size === 0) return;
    setIsPerformingAction(true);

    const existingIds = currentKb?.connection_source_ids || [];
    const newIds = Array.from(selectedIds);
    const combinedIds = Array.from(new Set([...existingIds, ...newIds]));

    const kb = await createKb.mutateAsync({
      connectionId: currentConnectionId,
      resourceIds: combinedIds,
    });
    await syncKb.mutateAsync(kb.knowledge_base_id);
    setSelectedIds(new Set());
  }, [currentConnectionId, currentKb, selectedIds, createKb, syncKb]);

  const handleImport = useCallback(
    async (id: string) => {
      if (!currentConnectionId) return;
      setIsPerformingAction(true);

      const existingIds = currentKb?.connection_source_ids || [];
      const combinedIds = Array.from(new Set([...existingIds, id]));

      const kb = await createKb.mutateAsync({
        connectionId: currentConnectionId,
        resourceIds: combinedIds,
      });
      await syncKb.mutateAsync(kb.knowledge_base_id);
    },
    [currentConnectionId, currentKb, createKb, syncKb],
  );

  const handleRemove = useCallback(
    async (id: string, path: string) => {
      if (!currentKb || !currentConnectionId || !credentials) return;

      const sourceIds = new Set(currentKb.connection_source_ids);

      // 1. If it's a direct source, just remove it
      if (sourceIds.has(id)) {
        setIsPerformingAction(true);
        const newIds = Array.from(sourceIds).filter((sid) => sid !== id);
        const kb = await createKb.mutateAsync({
          connectionId: currentConnectionId,
          resourceIds: newIds,
        });
        await syncKb.mutateAsync(kb.knowledge_base_id);
        return;
      }

      // 2. If it's not a direct source, it might be indexed because a parent is a source
      const parentSource = rootKbResources?.data.find(
        (r) =>
          path.startsWith(r.inode_path.path + "/") &&
          sourceIds.has(r.resource_id),
      );

      if (!parentSource) {
        // Fallback: Just call the delete resource API
        deleteResource.mutate({
          knowledgeBaseId: currentKb.knowledge_base_id,
          path: path,
        });
        return;
      }

      // 3. Shatter the parent source: remove parent, add all other children recursively
      setIsPerformingAction(true);

      const shatter = async (
        sourceId: string,
        targetPath: string,
      ): Promise<string[]> => {
        const children = await listResources(
          credentials,
          currentConnectionId,
          sourceId,
        );
        const newSources: string[] = [];
        for (const child of children.data) {
          if (child.inode_path.path === targetPath) {
            // This is the one to remove
            continue;
          }
          if (targetPath.startsWith(child.inode_path.path + "/")) {
            // Target is inside this child, shatter it
            const subSources = await shatter(child.resource_id, targetPath);
            newSources.push(...subSources);
          } else {
            // Not target, keep it
            newSources.push(child.resource_id);
          }
        }
        return newSources;
      };

      try {
        const newIdsFromShatter = await shatter(parentSource.resource_id, path);
        const finalIds = Array.from(sourceIds)
          .filter((sid) => sid !== parentSource.resource_id)
          .concat(newIdsFromShatter);

        const kb = await createKb.mutateAsync({
          connectionId: currentConnectionId,
          resourceIds: finalIds,
        });
        await syncKb.mutateAsync(kb.knowledge_base_id);
      } catch (error) {
        console.error("Failed to shatter source:", error);
      } finally {
        setIsPerformingAction(false);
      }
    },
    [
      currentKb,
      currentConnectionId,
      credentials,
      rootKbResources,
      createKb,
      syncKb,
      deleteResource,
    ],
  );

  const connectionName = currentConnection?.connector_type_id
    ? ConnectionNames[currentConnection?.connector_type_id]
    : null;

  const isSyncing = useMemo(() => {
    // Check if any resource at current path or any top-level resource is pending
    const hasPendingInPath = kbResources?.data.some(
      (r) => r.status === "pending",
    );
    const hasPendingInRoot = rootKbResources?.data.some(
      (r) => r.status === "pending",
    );

    // If we have sources but no resources, we are definitely syncing
    const hasSourcesButNoResources =
      (currentKb?.connection_source_ids.length || 0) > 0 &&
      (rootKbResources?.data.length || 0) === 0;

    return hasPendingInPath || hasPendingInRoot || hasSourcesButNoResources;
  }, [kbResources, rootKbResources, currentKb]);

  // Reset isPerformingAction once syncing is finished
  useEffect(() => {
    if (!isSyncing && !createKb.isPending && !syncKb.isPending) {
      setIsPerformingAction(false);
    }
  }, [isSyncing, createKb.isPending, syncKb.isPending]);

  const isActionPending =
    createKb.isPending ||
    syncKb.isPending ||
    deleteResource.isPending ||
    isSyncing ||
    isPerformingAction;

  const isAllSelected =
    selectableResources.length > 0 &&
    selectableResources.every((r) => selectedIds.has(r.resource_id));

  if (!connections?.length) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center border rounded-lg bg-background shadow-lg">
        <p className="text-muted-foreground">No connections available</p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] w-full overflow-hidden border rounded-lg bg-background shadow-lg">
      <FilePickerSidebar
        connections={connections}
        currentConnectionId={currentConnectionId}
        onConnectionSelect={handleConnectionSelect}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <FilePickerHeader
          providerName={connectionName || "Unknown"}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <FilePickerTable
          resources={filteredResources}
          isLoading={isLoadingResources}
          onFolderClick={handleFolderClick}
          onBack={currentFolderId ? handleBack : undefined}
          indexedResources={indexedResources}
          isParentIndexed={isCurrentFolderIndexed}
          selectedIds={selectedIds}
          onToggleSelection={handleToggleSelection}
          onImport={handleImport}
          onRemove={handleRemove}
          isActionPending={isActionPending}
        />

        <FilePickerFooter
          selectedCount={selectedIds.size}
          onCancel={() => setSelectedIds(new Set())}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
          onConfirm={handleConfirm}
          isConfirmPending={isActionPending}
        />
      </div>
    </div>
  );
}
