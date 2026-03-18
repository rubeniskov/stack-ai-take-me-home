"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Connection } from "@/lib/api";
import { ConnectionNames } from "./constants";
import { useMemo } from "react";

export interface FilePickerSidebarProps {
  connections: Connection[] | undefined;
  currentConnectionId: string | null;
  onConnectionSelect: (id: string) => void;
}

export function FilePickerSidebar({
  connections,
  currentConnectionId,
  onConnectionSelect,
}: FilePickerSidebarProps) {
  const connectionNodes = useMemo(
    () =>
      connections?.map((conn) => (
        <Button
          key={conn.connection_id}
          variant="ghost"
          onClick={() => onConnectionSelect(conn.connection_id)}
          className={cn(
            "justify-start gap-2 text-left h-auto py-2",
            currentConnectionId === conn.connection_id &&
              "bg-accent text-accent-foreground",
          )}
        >
          <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold shrink-0">
            {ConnectionNames[conn.connector_type_id].charAt(0)}
          </div>
          <span className="truncate">
            {ConnectionNames[conn.connector_type_id]}
          </span>
        </Button>
      )),
    [connections, currentConnectionId, onConnectionSelect],
  );
  return (
    <div className="w-64 border-r bg-muted/30 p-4 flex flex-col gap-4 shrink-0">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Integrations
      </h3>
      <div className="flex flex-col gap-1">
        {connectionNodes}
        {(!connections || connections.length === 0) && (
          <div className="text-sm text-muted-foreground p-2 italic">
            No connections found
          </div>
        )}
      </div>
    </div>
  );
}
