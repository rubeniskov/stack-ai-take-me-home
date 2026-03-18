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
import { FolderIcon, FileIcon, Trash2, ArrowUpLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Resource } from "@/lib/api";

export interface FilePickerTableProps {
  resources: Resource[] | undefined;
  indexedPaths: Set<string>;
  isActionPending: boolean;
  isLoading: boolean;
  onFolderClick: (id: string) => void;
  onBack?: () => void;
  onImport: (id: string) => void;
  onRemove: (id: string) => void;
}

export function FilePickerTable({
  resources,
  isLoading,
  onFolderClick,
  onBack,
  indexedPaths,
  onImport,
  onRemove,
  isActionPending,
}: FilePickerTableProps) {
  const handleImport = useCallback(
    (id: string) => {
      onImport(id);
    },
    [onImport],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onRemove(id);
    },
    [onRemove],
  );

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
          <TableCell
            colSpan={2}
            className="h-32 text-center text-muted-foreground"
          >
            No files found in this folder.
          </TableCell>
        </TableRow>,
      );
    } else {
      console.log("Rendering resources:", resources, indexedPaths);
      nodes.push(
        ...resources.map((resource) => {
          const isFolder = resource.inode_type === "directory";
          const name = resource.inode_path.path.split("/").pop() || "/";
          const isIndexed = indexedPaths.has(resource.inode_path.path);

          return (
            <TableRow key={resource.resource_id} className="group">
              <TableCell className={cn(!isIndexed && "opacity-50")}>
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
              </TableCell>
              <TableCell className="text-right">
                {isFolder ? null : isIndexed ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(resource.resource_id)}
                    disabled={isActionPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleImport(resource.resource_id)}
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
    indexedPaths,
    isActionPending,
    isLoading,
    handleImport,
    handleRemove,
    handleFolderClick,
    onBack,
  ]);

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{resourceNodes}</TableBody>
      </Table>
    </div>
  );
}
