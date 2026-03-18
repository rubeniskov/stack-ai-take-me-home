"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConnections } from "@/hooks/useConnections";
import { useResources } from "@/hooks/useResources";
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

export function FilePicker({
  initialConnectionId,
  initialFolderId,
}: FilePickerProps) {
  const router = useRouter();

  const { data: connections } = useConnections();

  // If initialConnectionId is provided, use it. Otherwise, use the first available connection.
  const currentConnectionId =
    initialConnectionId || connections?.[0]?.connection_id || null;

  const currentFolderId = initialFolderId;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const { data: kbs } = useKnowledgeBases();
  const currentKb = useMemo(
    () => kbs?.find((kb) => kb.connection_id === currentConnectionId),
    [kbs, currentConnectionId],
  );

  const { data: kbResources } = useKnowledgeBaseResources(
    currentKb?.knowledge_base_id,
  );

  const currentConnection = useMemo(
    () => connections?.find((c) => c.connection_id === currentConnectionId),
    [connections, currentConnectionId],
  );

  const createKb = useCreateKnowledgeBase();
  const syncKb = useSyncKnowledgeBase();
  const deleteResource = useDeleteResource();
  console.log("Current KB:", kbResources);
  const indexedPaths = useMemo(() => {
    return new Set(kbResources?.data.map((r) => r.inode_path.path) || []);
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
      resources?.data?.filter((r) => !indexedPaths.has(r.inode_path.path)) || []
    );
  }, [resources, indexedPaths]);

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
    if (!currentConnectionId || selectedIds.size === 0 || !currentKb) return;

    await createKb.mutateAsync({
      connectionId: currentConnectionId,
      resourceIds: Array.from(selectedIds),
    });
    await syncKb.mutateAsync(currentKb.knowledge_base_id);
    setSelectedIds(new Set());
  }, [currentConnectionId, currentKb, selectedIds, createKb, syncKb]);

  const handleImport = useCallback(
    async (id: string) => {
      if (!currentConnectionId || !currentKb) return;
      await createKb.mutateAsync({
        connectionId: currentConnectionId,
        resourceIds: [id],
      });
      await syncKb.mutateAsync(currentKb.knowledge_base_id);
    },
    [currentConnectionId, currentKb, createKb, syncKb],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      if (!currentKb) return;
      const resource = resources?.data?.find((r) => r.resource_id === id);
      if (!resource) return;

      deleteResource.mutate({
        knowledgeBaseId: currentKb.knowledge_base_id,
        path: resource.inode_path.path,
      });
    },
    [currentKb, resources, deleteResource],
  );

  const connectionName = currentConnection?.connector_type_id
    ? ConnectionNames[currentConnection?.connector_type_id]
    : null;

  const isActionPending =
    createKb.isPending || syncKb.isPending || deleteResource.isPending;

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
          indexedPaths={indexedPaths}
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
