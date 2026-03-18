"use client";

import { useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  FolderIcon,
  FileIcon,
  Trash2,
  ArrowUpLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Resource, KnowledgeBaseResource } from "@/lib/api";

const normalizePath = (p: string) => p.replace(/^\/+|\/+$/g, "");

export interface FilePickerTableProps {
  resources: Resource[] | undefined;
  indexedResources: Map<string, KnowledgeBaseResource>;
  isParentIndexed?: boolean;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  isActionPending: boolean;
  isLoading: boolean;
  onFolderClick: (id: string) => void;
  onBack?: () => void;
  onImport: (id: string) => void;
  onRemove: (id: string, path: string) => void;
}

export function FilePickerTable({
  resources,
  isLoading,
  onFolderClick,
  onBack,
  indexedResources,
  isParentIndexed,
  selectedIds,
  onToggleSelection,
  onImport,
  onRemove,
  isActionPending,
}: FilePickerTableProps) {
  const handleFolderClick = useCallback(
    (id: string) => {
      onFolderClick(id);
    },
    [onFolderClick],
  );

  const resourceNodes = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, idx) => (
        <TableRow key={idx}>
          <TableCell className="w-10">
            <Skeleton className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ));
    }

    const nodes = [];

    if (onBack) {
      nodes.push(
        <TableRow key="back-button" className="group">
          <TableCell className="w-10" />
          <TableCell colSpan={2}>
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-primary font-medium"
              onClick={onBack}
            >
              <ArrowUpLeft className="w-5 h-5 text-muted-foreground shrink-0" />
              <span>..</span>
            </div>
          </TableCell>
        </TableRow>,
      );
    }

    if (!resources || resources.length === 0) {
      nodes.push(
        <TableRow key="empty-state">
          <TableCell className="w-10" />
          <TableCell
            colSpan={2}
            className="h-32 text-center text-muted-foreground"
          >
            No files found in this folder.
          </TableCell>
        </TableRow>,
      );
    } else {
      nodes.push(
        ...resources.map((resource) => {
          const isFolder = resource.inode_type === "directory";
          const name = resource.inode_path.path.split("/").pop() || "/";
          const indexedResource =
            indexedResources.get(resource.resource_id) ||
            indexedResources.get(normalizePath(resource.inode_path.path));
          const isIndexed = isParentIndexed || !!indexedResource;
          const isPending = indexedResource?.status === "pending";
          const isSelected = selectedIds.has(resource.resource_id);

          return (
            <TableRow key={resource.resource_id} className="group">
              <TableCell className="w-10">
                {!isIndexed && (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() =>
                      onToggleSelection(resource.resource_id)
                    }
                  />
                )}
              </TableCell>
              <TableCell className={cn(!isIndexed && "opacity-50")}>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center gap-3 cursor-pointer",
                      isFolder ? "hover:text-primary font-medium" : "",
                    )}
                    onClick={() =>
                      isFolder ? handleFolderClick(resource.resource_id) : null
                    }
                  >
                    {isFolder ? (
                      <FolderIcon className="w-5 h-5 text-blue-500 fill-blue-500/20 shrink-0" />
                    ) : (
                      <FileIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate max-w-[300px]">{name}</span>
                  </div>
                  {isPending && (
                    <Badge
                      variant="secondary"
                      className="gap-1 px-1.5 py-0 h-5 text-[10px] font-normal"
                    >
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      Syncing...
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {isIndexed ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      onRemove(resource.resource_id, resource.inode_path.path)
                    }
                    disabled={isActionPending || isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => onImport(resource.resource_id)}
                    disabled={isActionPending}
                  >
                    Import
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        }),
      );
    }

    return nodes;
  }, [
    resources,
    indexedResources,
    isParentIndexed,
    isActionPending,
    isLoading,
    onImport,
    onRemove,
    handleFolderClick,
    onBack,
    selectedIds,
    onToggleSelection,
  ]);

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{resourceNodes}</TableBody>
      </Table>
    </div>
  );
}
