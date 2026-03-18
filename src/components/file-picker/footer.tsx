"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export interface FilePickerFooterProps {
  selectedCount: number;
  onCancel: () => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  onConfirm: () => void;
  isConfirmPending: boolean;
}

export function FilePickerFooter({
  selectedCount,
  onCancel,
  onSelectAll,
  isAllSelected,
  onConfirm,
  isConfirmPending,
}: FilePickerFooterProps) {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 border-b flex items-center justify-between bg-muted/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
            <span className="text-sm font-medium">Select all</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {selectedCount} selected
          </span>
        </div>
      </div>

      <div className="p-4 border-t bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold shrink-0">
            i
          </span>
          We recommend selecting as few items as needed.
        </p>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="ghost"
            className="flex-1 sm:flex-none"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={selectedCount === 0 || isConfirmPending}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] flex-1 sm:flex-none"
            onClick={onConfirm}
          >
            {isConfirmPending ? "Importing..." : `Import ${selectedCount}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
