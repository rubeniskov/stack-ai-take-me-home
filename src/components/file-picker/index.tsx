"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnections } from "@/hooks/useConnections";
import { FilePickerHeader } from "./header";
import { ConnectorType } from "@/lib/api";
import { ConnectionNames } from "./constants";
import { FilePickerSidebar } from "./sidebar";
import { useRouter } from "next/navigation";

export interface FilePickerProps {
  initialConnectionId?: string;
  initialFolderId?: string;
}

export function FilePicker({ initialConnectionId }: FilePickerProps) {
  const router = useRouter();
  const { data: connections } = useConnections();
  const [selectedConnectionId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const currentConnectionId =
    selectedConnectionId ||
    initialConnectionId ||
    connections?.[0]?.connection_id;

  const currentConnection = connections?.find(
    (conn) => conn.connection_id === currentConnectionId,
  );

  const connectionName = currentConnection
    ? ConnectionNames[currentConnection.connector_type_id as ConnectorType]
    : "Unknown Connection";

  useEffect(() => {
    if (!initialConnectionId && connections && connections.length > 0) {
      router.replace(`/browse/${connections[0].connection_id}`);
    }
  }, [initialConnectionId, connections, router]);

  const handleConnectionSelect = useCallback(
    (id: string) => {
      router.push(`/browse/${id}`);
    },
    [router],
  );

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
        currentConnectionId={currentConnectionId!}
        onConnectionSelect={handleConnectionSelect}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <FilePickerHeader
          providerName={connectionName}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
}
