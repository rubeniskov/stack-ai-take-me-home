"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface FilePickerHeaderProps {
  providerName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FilePickerHeader({
  providerName,
  searchQuery,
  onSearchChange,
}: FilePickerHeaderProps) {
  return (
    <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background">
      <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold shrink-0">
          {providerName.charAt(0)}
        </div>
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold truncate">{providerName}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 w-full sm:w-[200px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
