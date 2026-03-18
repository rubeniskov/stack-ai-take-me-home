"use client";

import { useState } from "react";
import { useConnections } from "@/hooks/useConnections";
import { FilePickerHeader } from "./header";
import { ConnectorType } from "@/lib/api";

const ConnectionNames: Record<ConnectorType, string> = {
  [ConnectorType.GDRIVE]: "Google Drive",
};

export function FilePicker() {
  const { data: connections } = useConnections();
  const [selectedConnectionId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  if (!connections?.length) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center border rounded-lg bg-background shadow-lg">
        <p className="text-muted-foreground">No connections available</p>
      </div>
    );
  }

  const currentConnectionId =
    selectedConnectionId || connections?.[0]?.connection_id;

  const currentConnection = connections?.find(
    (conn) => conn.connection_id === currentConnectionId,
  );

  const connectionName = currentConnection
    ? ConnectionNames[currentConnection.connector_type_id as ConnectorType]
    : "Unknown Connection";

  return (
    <div className="flex w-full overflow-hidden border rounded-lg bg-background shadow-lg">
      <FilePickerHeader
        providerName={connectionName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
